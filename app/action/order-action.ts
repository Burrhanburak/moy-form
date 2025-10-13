"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";

export async function createOrder(orderData: {
  stripeSessionId: string;
  packageName: string;
  selectedAddons: string[];

  // Additional Information (stored in Order for historical record)
  customerPhone?: string;
  companyName?: string;
  companyEmail?: string;

  // Business Information
  businessField: string[];
  hasDomain?: string;
  domainName?: string;
  hasSocialMedia?: string;
  socialMediaAccounts?: string[];
  packageAnswers?: any;

  // Project Details
  projectDescription?: string;
  specialRequirements?: string;
  exampleSites?: string;
  additionalNotes?: string;

  // Pricing
  packagePrice: number;
  addOnsPrice: number;
  totalPrice: number;
  subscriptionId?: string;
}) {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session?.user?.id) {
      return { redirect: "/login" };
    }

    // Update user information from form
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        phone: orderData.customerPhone,
        companyName: orderData.companyName,
        companyEmail: orderData.companyEmail,
      },
    });

    // Create order in database
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        subscriptionId: orderData.subscriptionId || null,
        stripeSessionId: orderData.stripeSessionId,
        packageName: orderData.packageName,
        selectedAddons: orderData.selectedAddons,

        // Additional Information (stored for historical record)
        customerPhone: orderData.customerPhone,
        companyName: orderData.companyName,
        companyEmail: orderData.companyEmail,

        // Business Information
        businessField: orderData.businessField || [],
        hasDomain: orderData.hasDomain,
        domainName: orderData.domainName,
        hasSocialMedia: orderData.hasSocialMedia,
        socialMediaAccounts: orderData.socialMediaAccounts || [],
        packageAnswers: orderData.packageAnswers || {},

        // Project Details
        projectDescription: orderData.projectDescription,
        specialRequirements: orderData.specialRequirements,
        exampleSites: orderData.exampleSites,
        additionalNotes: orderData.additionalNotes,

        // Pricing
        packagePrice: orderData.packagePrice,
        addOnsPrice: orderData.addOnsPrice,
        totalPrice: orderData.totalPrice,
        status: "PENDING_PAYMENT",
      },
      include: {
        user: true,
        subscription: true,
      },
    });

    return { order };
  } catch (error) {
    console.error("Error creating order:", error);
    return { error: "Failed to create order" };
  }
}

export async function getOrders() {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });

    console.log("Session in getOrders:", session);

    if (!session?.user?.id) {
      return { redirect: "/login" };
    }

    console.log("Finding orders for user:", session.user.id);

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        orderNumber: true,
        packageName: true,
        selectedAddons: true,
        projectDescription: true,
        specialRequirements: true,
        exampleSites: true,
        additionalNotes: true,
        packagePrice: true,
        addOnsPrice: true,
        totalPrice: true,
        status: true,
        createdAt: true,
        stripeSessionId: true,
        customerName: true,
        formEmail: true,
        companyName: true,
        subscription: {
          select: {
            packageName: true,
            businessField: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    console.log("Found orders:", orders.length);

    return { orders };
  } catch (error) {
    console.error("Error fetching orders:", error);
    return { error: "Failed to fetch orders" };
  }
}

export async function getOrderById(orderId: string) {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session?.user?.id) {
      return { redirect: "/login" };
    }

    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
        userId: session.user.id,
      },
      include: {
        user: true,
        subscription: true,
      },
    });

    if (!order) {
      return { error: "Order not found" };
    }

    return { order };
  } catch (error) {
    console.error("Error fetching order:", error);
    return { error: "Failed to fetch order" };
  }
}

export async function updateOrderStatus(
  orderId: string,
  status:
    | "PENDING_PAYMENT"
    | "PAID"
    | "PROCESSING"
    | "COMPLETED"
    | "CANCELED"
    | "FAILED"
) {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session?.user?.id) {
      return { redirect: "/login" };
    }

    const order = await prisma.order.update({
      where: {
        id: orderId,
        userId: session.user.id,
      },
      data: { status },
      include: {
        user: true,
        subscription: true,
      },
    });

    return { order };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { error: "Failed to update order status" };
  }
}
