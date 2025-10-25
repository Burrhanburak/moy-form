/**
 * Script to manually activate a paid package and create subscription
 * Run with: npx tsx scripts/activate-package.ts <packageId>
 */

import { prisma } from "../lib/prisma";
import { stripe } from "../lib/stripe";

async function activatePackage(packageId: string) {
  console.log(`🔍 Looking for package: ${packageId}\n`);

  // Get package
  const pkg = await prisma.packages.findUnique({
    where: { id: packageId },
    include: { user: true },
  });

  if (!pkg) {
    console.error(`❌ Package not found: ${packageId}`);
    return;
  }

  console.log(`✅ Found package: ${pkg.name}`);
  console.log(`   Status: ${pkg.status}`);
  console.log(`   User: ${pkg.user.email}`);
  console.log(`   Price: $${pkg.price / 100}`);

  if (pkg.status === "ACTIVE") {
    console.log(`\n✓ Package is already active!`);
    return;
  }

  // Check if user has a Stripe customer ID
  if (!pkg.user.stripeCustomerId) {
    console.error(`\n❌ User has no Stripe customer ID. Cannot proceed.`);
    return;
  }

  console.log(`\n🔍 Checking Stripe for subscriptions...`);

  // Get all subscriptions for this customer
  const stripeSubscriptions = await stripe.subscriptions.list({
    customer: pkg.user.stripeCustomerId,
    limit: 10,
  });

  console.log(
    `   Found ${stripeSubscriptions.data.length} subscriptions in Stripe`
  );

  // Find the most recent active subscription
  const activeSubscription = stripeSubscriptions.data.find(
    (sub) => sub.status === "active" || sub.status === "trialing"
  );

  if (!activeSubscription) {
    console.error(
      `\n❌ No active subscription found in Stripe for this customer`
    );
    console.log(`\n💡 Tip: Make sure payment was completed in Stripe`);
    return;
  }

  console.log(
    `\n✅ Found active Stripe subscription: ${activeSubscription.id}`
  );
  console.log(`   Status: ${activeSubscription.status}`);
  console.log(
    `   Amount: $${(activeSubscription.items.data[0].price.unit_amount || 0) / 100}/month`
  );

  // Check if subscription already exists in DB
  const existingSubscription = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: activeSubscription.id },
  });

  if (existingSubscription) {
    console.log(
      `\n✓ Subscription already exists in database: ${existingSubscription.id}`
    );
  } else {
    console.log(`\n📝 Creating subscription in database...`);

    // Create subscription in database
    const subscription = await prisma.subscription.create({
      data: {
        userId: pkg.userId,
        packageId: pkg.id,
        stripeSubscriptionId: activeSubscription.id,
        stripeCustomerId: pkg.user.stripeCustomerId,
        stripePriceId: activeSubscription.items.data[0].price.id,
        stripeProductId:
          typeof activeSubscription.items.data[0].price.product === "string"
            ? activeSubscription.items.data[0].price.product
            : "",
        status: "ACTIVE",
        currentPeriodStart: new Date(
          activeSubscription.current_period_start * 1000
        ),
        currentPeriodEnd: new Date(
          activeSubscription.current_period_end * 1000
        ),
        cancelAtPeriodEnd: activeSubscription.cancel_at_period_end || false,
        packageName: pkg.name,
      },
    });

    console.log(`✅ Subscription created: ${subscription.id}`);
  }

  // Activate package
  console.log(`\n🎯 Activating package...`);
  await prisma.packages.update({
    where: { id: packageId },
    data: { status: "ACTIVE" },
  });

  console.log(`✅ Package activated!`);

  // Create order if doesn't exist
  console.log(`\n📦 Checking for order...`);
  const existingOrder = await prisma.order.findFirst({
    where: {
      userId: pkg.userId,
      packageId: pkg.id,
    },
  });

  if (existingOrder) {
    console.log(`✓ Order already exists: ${existingOrder.orderNumber}`);
  } else {
    console.log(`📝 Creating order...`);

    const orderNumber = `ORD-${Date.now().toString().slice(-8)}`;
    const order = await prisma.order.create({
      data: {
        orderNumber,
        formEmail: pkg.user.email,
        userId: pkg.userId,
        packageId: pkg.id,
        packageName: pkg.name,
        selectedAddons: pkg.optionalAddons,
        businessField: [],
        packagePrice: pkg.price / 100,
        addOnsPrice: 0,
        totalPrice: pkg.price / 100,
        status: "PAID",
        customerName: pkg.user.name || "Customer",
        companyEmail: pkg.user.email,
      },
    });

    console.log(`✅ Order created: ${order.orderNumber}`);
  }

  console.log(`\n🎉 Done! Package is now active and ready to use.`);
}

// Main execution
async function main() {
  const packageId = process.argv[2];

  if (!packageId) {
    console.log("Usage: npx tsx scripts/activate-package.ts <packageId>");
    console.log("\nExample:");
    console.log(
      "  npx tsx scripts/activate-package.ts cmgpb7r6b00014w51fi59hwmp"
    );
    process.exit(1);
  }

  await activatePackage(packageId);
  await prisma.$disconnect();
}

main().catch(console.error);
