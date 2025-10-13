import { prisma } from "./prisma";
import { PACKAGES } from "@/utils/packages";
import { addonOptions } from "@/utils/formSchema";

// Generate human readable order number
function generateOrderNumber(): string {
  const prefix = "MOY";
  const timestamp = Date.now().toString().slice(-6); // Last 6 digits
  const random = Math.random().toString(36).substring(2, 5).toUpperCase(); // 3 random chars
  return `${prefix}-${timestamp}-${random}`;
}

// Generate claim token for order claiming
function generateClaimToken(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

export interface CreateOrderData {
  // User Info
  userId?: string; // Added for linking order to user

  // Customer Info
  name: string;
  email: string;
  phone?: string;
  companyName?: string;

  // Business Info
  businessField: string[];
  hasDomain?: string;
  domainName?: string;
  hasSocialMedia?: string;
  socialMediaAccounts?: string[];

  // Package Info
  selectedPackage: string;
  selectedAddons?: string[];
  packageAnswers?: Record<string, any>;

  // Project Details
  projectDescription?: string;
  specialRequirements?: string;
  exampleSites?: string;
  additionalNotes?: string;

  // Pricing
  maintenancePrice?: number;
}

export async function createPendingOrder(data: CreateOrderData) {
  const packageInfo = PACKAGES[data.selectedPackage as keyof typeof PACKAGES];
  if (!packageInfo) {
    throw new Error("Invalid package selected");
  }

  // Calculate pricing
  const packagePrice = packageInfo.price;
  let addOnsPrice = 0;

  if (data.selectedAddons?.length) {
    addOnsPrice = data.selectedAddons.reduce((total, addonId) => {
      const addon = addonOptions.find((opt) => opt.id === addonId);
      if (addon) {
        const price = parseFloat(addon.price.replace(/[^0-9.-]+/g, ""));
        return total + price;
      }
      return total;
    }, 0);
  }

  // Add maintenance price (mandatory for all packages)
  const maintenancePriceString =
    data.maintenancePrice || packageInfo.maintenancePrice || "49";
  const maintenancePrice = parseFloat(
    maintenancePriceString.replace(/[^0-9.-]+/g, "")
  );
  const totalPrice = packagePrice + addOnsPrice + maintenancePrice;
  const orderNumber = generateOrderNumber();
  const claimToken = generateClaimToken();
  const claimTokenExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  try {
    const order = await prisma.order.create({
      data: {
        orderNumber,
        formEmail: data.email,
        userId: data.userId, // Link order to user

        // Customer Info
        customerName: data.name,
        customerPhone: data.phone,
        companyName: data.companyName,

        // Business Info
        businessField: data.businessField,
        hasDomain: data.hasDomain,
        domainName: data.domainName,
        hasSocialMedia: data.hasSocialMedia,
        socialMediaAccounts: data.socialMediaAccounts || [],

        // Package Info
        packageName: data.selectedPackage,
        selectedAddons: data.selectedAddons || [],
        packageAnswers: data.packageAnswers,

        // Project Details
        projectDescription: data.projectDescription,
        specialRequirements: data.specialRequirements,
        exampleSites: data.exampleSites,
        additionalNotes: data.additionalNotes,

        // Pricing
        packagePrice,
        addOnsPrice,
        totalPrice,

        // Status & Claim
        status: "PENDING_PAYMENT",
        claimToken,
        claimTokenExpiresAt,
      },
    });

    console.log(
      `✅ Order created: ${orderNumber} (${order.id}) for user: ${data.userId || "guest"}`
    );
    return order;
  } catch (error) {
    console.error("❌ Error creating order:", error);
    throw error;
  }
}

// Link existing order to user after signup
export async function linkOrderToUser(userId: string, email: string) {
  try {
    console.log(
      `🔍 Looking for orders to link for user ${userId} with email ${email}`
    );

    // Find orders with matching email that don't have a userId yet
    // Use case-insensitive email matching
    const orders = await prisma.order.findMany({
      where: {
        formEmail: {
          equals: email,
          mode: "insensitive",
        },
        userId: null,
      },
      select: {
        id: true,
        orderNumber: true,
        formEmail: true,
        customerName: true,
        companyName: true,
        createdAt: true,
      },
    });

    console.log(`📋 Found ${orders.length} orders to link:`, orders);

    if (orders.length > 0) {
      // Update all matching orders
      const result = await prisma.order.updateMany({
        where: {
          formEmail: {
            equals: email,
            mode: "insensitive",
          },
          userId: null,
        },
        data: {
          userId: userId,
        },
      });

      console.log(
        `✅ Successfully linked ${result.count} orders to user ${userId}`
      );
      return result.count;
    } else {
      console.log(`📭 No orders found to link for ${email}`);
      return 0;
    }
  } catch (error) {
    console.error("❌ Error linking orders to user:", error);
    throw error;
  }
}

// Update order with Stripe session info
export async function updateOrderWithStripeSession(
  orderId: string,
  stripeSessionId: string
) {
  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { stripeSessionId },
    });

    console.log(
      `✅ Updated order ${orderId} with Stripe session ${stripeSessionId}`
    );
    return order;
  } catch (error) {
    console.error("❌ Error updating order with Stripe session:", error);
    throw error;
  }
}

// Mark order as paid and create payment record
export async function markOrderAsPaid(
  orderId: string,
  stripePaymentIntentId: string,
  amount: number,
  currency: string = "usd"
) {
  try {
    // Start transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update order status
      const order = await tx.order.update({
        where: { id: orderId },
        data: {
          status: "PAID",
          stripePaymentIntentId,
        },
      });

      // Check if payment already exists
      const existingPayment = await tx.payment.findFirst({
        where: {
          OR: [{ orderId }, { stripePaymentIntentId }],
        },
      });

      let payment;
      if (existingPayment) {
        console.log("ℹ️ Payment already exists, skipping creation");
        payment = existingPayment;
      } else {
        // Create payment record
        payment = await tx.payment.create({
          data: {
            orderId,
            stripePaymentIntentId,
            amount,
            currency,
            status: "succeeded",
          },
        });
      }

      return { order, payment };
    });

    console.log(
      `✅ Order ${orderId} marked as paid with payment ${result.payment.id}`
    );
    return result;
  } catch (error) {
    console.error("❌ Error marking order as paid:", error);
    throw error;
  }
}
