"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Stripe from "stripe";

export async function getSubscriptions() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      if (!session?.user?.id) {
        redirect("/login");
      }
    }

    console.log("🔍 Looking for subscriptions for user:", session.user.id);

    // Get ALL subscriptions from database (not just from one Stripe customer)
    const dbSubscriptions = await prisma.subscription.findMany({
      where: {
        userId: session.user.id,
        status: {
          in: ["ACTIVE", "TRIALING", "PAST_DUE"],
        },
      },
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });

    console.log("🔍 Found DB subscriptions:", dbSubscriptions.length);

    // Fetch Stripe details for each subscription
    const subscriptions = await Promise.all(
      dbSubscriptions.map(async (dbSubscription) => {
        try {
          // Get Stripe subscription details
          const stripeSubscription = await stripe.subscriptions.retrieve(
            dbSubscription.stripeSubscriptionId,
            {
              expand: ["items.data.price"],
            }
          );

          const lineItem = stripeSubscription.items.data[0];
          const price = lineItem.price as Stripe.Price;

          // Get product details
          let productName = dbSubscription.packageName || "Unknown Product";
          let productDescription = "";
          if (price.product && typeof price.product === "string") {
            try {
              const product = await stripe.products.retrieve(price.product);
              productName = product.name || productName;
              productDescription = product.description || "";
            } catch (error) {
              console.error("Error fetching product:", error);
            }
          }

          return {
            id: dbSubscription.id,
            customer: dbSubscription.user.name || "Unknown Customer",
            customerEmail: dbSubscription.user.email,
            status: dbSubscription.status,
            subscriptionDate: dbSubscription.createdAt,
            renewalDate: dbSubscription.currentPeriodEnd,
            product: productName,
            productDescription: productDescription,
            stripeSubscriptionId: stripeSubscription.id,
            cancelAtPeriodEnd: dbSubscription.cancelAtPeriodEnd,
            trialEnd: dbSubscription.trialEnd,
            amount: price.unit_amount ? price.unit_amount / 100 : 0,
            currency: price.currency,
            interval: price.recurring?.interval || "month",
            packageName: dbSubscription.packageName,
          };
        } catch (error) {
          console.error(
            `Error fetching Stripe subscription ${dbSubscription.stripeSubscriptionId}:`,
            error
          );
          // Return subscription with DB data only
          return {
            id: dbSubscription.id,
            customer: dbSubscription.user.name || "Unknown Customer",
            customerEmail: dbSubscription.user.email,
            status: dbSubscription.status,
            subscriptionDate: dbSubscription.createdAt,
            renewalDate: dbSubscription.currentPeriodEnd,
            product: dbSubscription.packageName || "Unknown Product",
            productDescription: "",
            stripeSubscriptionId: dbSubscription.stripeSubscriptionId,
            cancelAtPeriodEnd: dbSubscription.cancelAtPeriodEnd,
            trialEnd: dbSubscription.trialEnd,
            amount: 0,
            currency: "usd",
            interval: "month",
            packageName: dbSubscription.packageName,
          };
        }
      })
    );

    return { subscriptions };
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return { error: "Failed to fetch subscriptions" };
  }
}
export async function getSubscriptionById(subscriptionId: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      redirect("/login");
    }

    // Check if this is an order-based subscription (one-time payment)
    if (subscriptionId.startsWith("order-")) {
      const orderId = subscriptionId.replace("order-", "");
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { user: true },
      });

      if (!order) {
        return { error: "Order not found" };
      }

      // Return order as a subscription-like object
      const subscription = {
        id: subscriptionId,
        customer: order.user?.name || session.user.name || "Unknown Customer",
        customerEmail: order.user?.email || session.user.email || "No email",
        status: "PAID",
        subscriptionDate: order.createdAt,
        renewalDate: null, // One-time payment, no renewal
        product: order.packageName || "Custom/Single Order",
        productDescription: "One-time payment",
        stripeSubscriptionId: null,
        cancelAtPeriodEnd: false,
        trialEnd: null,
        trialStart: null,
        canceledAt: null,
        amount: order.totalPrice ? order.totalPrice / 100 : 0,
        currency: "usd",
        interval: "once",
        packageName: order.packageName,
        businessField: order.businessField || [],
        domainName: order.domainName,
        hasDomain: order.hasDomain,
        socialMediaAccounts: order.socialMediaAccounts || [],
        packageAnswers: order.packageAnswers || {},
      };

      return { subscription };
    }

    // Regular subscription lookup
    const dbSubscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
      include: { user: true },
    });

    if (!dbSubscription) {
      return { error: "Subscription not found" };
    }

    // Get Stripe subscription details
    const stripeSubscription = await stripe.subscriptions.retrieve(
      dbSubscription.stripeSubscriptionId,
      {
        expand: ["items.data.price", "customer"],
      }
    );

    const lineItem = stripeSubscription.items.data[0];
    const price = lineItem.price as Stripe.Price;

    // Get product details
    let productName = "Unknown Product";
    let productDescription = "";
    if (price.product && typeof price.product === "string") {
      try {
        const product = await stripe.products.retrieve(price.product);
        productName = product.name || "Unknown Product";
        productDescription = product.description || "";
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    }

    const subscription = {
      id: dbSubscription.id,
      customer: dbSubscription.user.name || "Unknown Customer",
      customerEmail: dbSubscription.user.email || "No email",
      status: dbSubscription.status,
      subscriptionDate: dbSubscription.createdAt,
      renewalDate: dbSubscription.currentPeriodEnd,
      product: productName,
      productDescription: productDescription,
      stripeSubscriptionId: stripeSubscription.id,
      cancelAtPeriodEnd: dbSubscription.cancelAtPeriodEnd || false,
      trialEnd: dbSubscription.trialEnd,
      trialStart: dbSubscription.trialStart,
      canceledAt: dbSubscription.canceledAt,
      amount: price.unit_amount ? price.unit_amount / 100 : 0,
      currency: price.currency || "usd",
      interval: price.recurring?.interval || "month",
      packageName: dbSubscription.packageName,
      businessField: dbSubscription.businessField || [],
      domainName: dbSubscription.domainName,
      hasDomain: dbSubscription.hasDomain,
      socialMediaAccounts: dbSubscription.socialMediaAccounts || [],
      packageAnswers: dbSubscription.packageAnswers || {},
    };

    return { subscription };
  } catch (error) {
    console.error("Error fetching subscription by ID:", error);
    return { error: "Failed to fetch subscription details" };
  }
}

export async function upgradeSubscription({
  subscriptionId,
  newPackageId,
}: {
  subscriptionId: string;
  newPackageId: string;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) return { redirect: "/login" };

  const subscription = await prisma.subscription.findUnique({
    where: { id: subscriptionId },
    include: { package: true },
  });
  if (!subscription) return { error: "Subscription not found" };

  const newPackage = await prisma.packages.findUnique({
    where: { id: newPackageId },
  });
  if (!newPackage) return { error: "New package not found" };

  const updatedSubscription = await prisma.subscription.update({
    where: { id: subscriptionId },
    data: {
      packageId: newPackage.id,
      packageName: newPackage.name,
    },
    include: { package: true },
  });

  return { success: true, subscription: updatedSubscription, newPackage };
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
