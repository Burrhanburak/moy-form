/**
 * Script to replay missed webhook events from Stripe
 * This will help sync your database with Stripe
 *
 * Run with: npx tsx scripts/replay-webhook-events.ts
 */

import { stripe } from "../lib/stripe";
import { prisma } from "../lib/prisma";

async function replayMissedEvents() {
  console.log("🔍 Checking for missed subscription events...\n");

  // Get all DB subscriptions
  const dbSubscriptions = await prisma.subscription.findMany({
    include: {
      user: {
        select: { email: true, stripeCustomerId: true },
      },
    },
  });

  console.log(`Found ${dbSubscriptions.length} subscriptions in database\n`);

  for (const dbSub of dbSubscriptions) {
    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`📋 Checking: ${dbSub.stripeSubscriptionId}`);

    try {
      // Get subscription from Stripe
      const stripeSub = await stripe.subscriptions.retrieve(
        dbSub.stripeSubscriptionId
      );

      console.log(`✅ Found in Stripe`);
      console.log(`   Stripe Status: ${stripeSub.status}`);
      console.log(`   DB Status: ${dbSub.status}`);

      // Check if needs update
      if (
        stripeSub.status.toUpperCase() !== dbSub.status ||
        stripeSub.current_period_end * 1000 !== dbSub.currentPeriodEnd.getTime()
      ) {
        console.log(`🔧 Syncing with Stripe data...`);

        await prisma.subscription.update({
          where: { id: dbSub.id },
          data: {
            status: mapStripeStatus(stripeSub.status),
            currentPeriodStart: new Date(stripeSub.current_period_start * 1000),
            currentPeriodEnd: new Date(stripeSub.current_period_end * 1000),
            cancelAtPeriodEnd: stripeSub.cancel_at_period_end || false,
            canceledAt: stripeSub.canceled_at
              ? new Date(stripeSub.canceled_at * 1000)
              : null,
            stripePriceId:
              stripeSub.items.data[0]?.price.id || dbSub.stripePriceId,
          },
        });

        console.log(`✅ Database updated!`);
      } else {
        console.log(`✓ Already in sync`);
      }
    } catch (error: any) {
      console.log(`❌ NOT FOUND in Stripe: ${error.message}`);
      console.log(
        `   This subscription is invalid and should be removed from DB`
      );
    }
  }

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
}

async function findMissingSubscriptions() {
  console.log("🔍 Checking for subscriptions in Stripe but not in DB...\n");

  // Get all users with Stripe customer IDs
  const users = await prisma.user.findMany({
    where: {
      stripeCustomerId: {
        not: null,
      },
    },
    select: {
      id: true,
      email: true,
      name: true,
      stripeCustomerId: true,
    },
  });

  console.log(`Found ${users.length} users with Stripe customer IDs\n`);

  for (const user of users) {
    if (!user.stripeCustomerId) continue;

    console.log(`\n👤 Checking user: ${user.email}`);

    try {
      // Get all subscriptions for this customer from Stripe
      const stripeSubscriptions = await stripe.subscriptions.list({
        customer: user.stripeCustomerId,
        limit: 100,
      });

      console.log(
        `   Found ${stripeSubscriptions.data.length} subscriptions in Stripe`
      );

      for (const stripeSub of stripeSubscriptions.data) {
        // Check if exists in DB
        const dbSub = await prisma.subscription.findUnique({
          where: { stripeSubscriptionId: stripeSub.id },
        });

        if (!dbSub) {
          console.log(`   ⚠️  MISSING in DB: ${stripeSub.id}`);
          console.log(`      Status: ${stripeSub.status}`);
          console.log(
            `      Created: ${new Date(stripeSub.created * 1000).toLocaleString()}`
          );

          // Ask if should create
          console.log(
            `      💡 You can create this subscription in DB manually`
          );
        }
      }
    } catch (error: any) {
      console.log(`   ❌ Error: ${error.message}`);
    }
  }

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
}

function mapStripeStatus(
  stripeStatus: string
):
  | "ACTIVE"
  | "CANCELED"
  | "INCOMPLETE"
  | "INCOMPLETE_EXPIRED"
  | "PAST_DUE"
  | "TRIALING"
  | "UNPAID" {
  switch (stripeStatus) {
    case "active":
      return "ACTIVE";
    case "canceled":
      return "CANCELED";
    case "incomplete":
      return "INCOMPLETE";
    case "incomplete_expired":
      return "INCOMPLETE_EXPIRED";
    case "past_due":
      return "PAST_DUE";
    case "trialing":
      return "TRIALING";
    case "unpaid":
      return "UNPAID";
    default:
      return "ACTIVE";
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  console.log("🔄 Webhook Event Replay Tool\n");

  if (command === "sync") {
    console.log("Mode: Sync existing subscriptions with Stripe\n");
    await replayMissedEvents();
  } else if (command === "find-missing") {
    console.log("Mode: Find subscriptions in Stripe but not in DB\n");
    await findMissingSubscriptions();
  } else {
    console.log("Usage:");
    console.log(
      "  npx tsx scripts/replay-webhook-events.ts sync          - Sync DB subscriptions with Stripe"
    );
    console.log(
      "  npx tsx scripts/replay-webhook-events.ts find-missing  - Find Stripe subscriptions not in DB"
    );
    console.log("");
    console.log("Examples:");
    console.log(
      "  # Update all existing subscriptions with latest Stripe data"
    );
    console.log("  npx tsx scripts/replay-webhook-events.ts sync");
    console.log("");
    console.log("  # Check if any Stripe subscriptions are missing from DB");
    console.log("  npx tsx scripts/replay-webhook-events.ts find-missing");
  }

  await prisma.$disconnect();
}

main().catch(console.error);
