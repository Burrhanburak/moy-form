/**
 * Script to check and fix invalid subscriptions in database
 * Run with: npx tsx scripts/check-subscriptions.ts
 */

import { prisma } from "../lib/prisma";
import { stripe } from "../lib/stripe";

async function checkSubscriptions() {
  console.log("🔍 Checking all subscriptions in database...\n");

  const subscriptions = await prisma.subscription.findMany({
    include: {
      user: {
        select: { email: true, name: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  console.log(`Found ${subscriptions.length} subscriptions in database\n`);

  for (const sub of subscriptions) {
    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`📋 DB Subscription ID: ${sub.id}`);
    console.log(`👤 User: ${sub.user.name} (${sub.user.email})`);
    console.log(`📅 Status: ${sub.status}`);
    console.log(`💳 Stripe ID: ${sub.stripeSubscriptionId}`);

    // Check if subscription exists in Stripe
    try {
      const stripeSubscription = await stripe.subscriptions.retrieve(
        sub.stripeSubscriptionId
      );

      console.log(`✅ VALID - Found in Stripe`);
      console.log(`   Stripe Status: ${stripeSubscription.status}`);
      console.log(
        `   Amount: $${(stripeSubscription.items.data[0].price.unit_amount || 0) / 100}/month`
      );
      console.log(
        `   Current Period: ${new Date(stripeSubscription.current_period_start * 1000).toLocaleDateString()} - ${new Date(stripeSubscription.current_period_end * 1000).toLocaleDateString()}`
      );

      // Check if DB needs update
      if (
        stripeSubscription.status.toUpperCase() !== sub.status ||
        stripeSubscription.current_period_end * 1000 !==
          sub.currentPeriodEnd.getTime()
      ) {
        console.log(`⚠️  DB IS OUT OF SYNC - Needs update`);
      }
    } catch (error: any) {
      console.log(`❌ INVALID - Not found in Stripe`);
      console.log(`   Error: ${error.message}`);
      console.log(`   This subscription should be deleted or fixed`);
    }
  }

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
}

async function fixInvalidSubscriptions() {
  console.log("🔧 Checking for invalid subscriptions to delete...\n");

  const subscriptions = await prisma.subscription.findMany();
  let deletedCount = 0;

  for (const sub of subscriptions) {
    try {
      await stripe.subscriptions.retrieve(sub.stripeSubscriptionId);
    } catch (error) {
      console.log(
        `❌ Deleting invalid subscription: ${sub.stripeSubscriptionId}`
      );
      await prisma.subscription.delete({
        where: { id: sub.id },
      });
      deletedCount++;
    }
  }

  console.log(`\n✅ Deleted ${deletedCount} invalid subscriptions\n`);
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (command === "fix") {
    await fixInvalidSubscriptions();
  } else if (command === "check") {
    await checkSubscriptions();
  } else {
    console.log("Usage:");
    console.log(
      "  npx tsx scripts/check-subscriptions.ts check  - Check all subscriptions"
    );
    console.log(
      "  npx tsx scripts/check-subscriptions.ts fix    - Delete invalid subscriptions"
    );
  }

  await prisma.$disconnect();
}

main().catch(console.error);
