import { NextRequest, NextResponse } from "next/server";
import { createCheckoutSession } from "@/lib/stripe";
import { createCustomerRecord } from "@/lib/airtable";
import { sendWelcomeEmail, sendSlackNotification } from "@/lib/email";
import { PACKAGES } from "@/utils/packages";
import {
  createPendingOrder,
  updateOrderWithStripeSession,
} from "@/lib/order-utils";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    console.log("🚀 Checkout API called");
    const formData = await req.json();
    console.log("📝 Form data received:", JSON.stringify(formData, null, 2));

    // Get authenticated user
    const authSession = await auth.api.getSession({
      headers: await headers(),
    });

    const userId = authSession?.user?.id;
    console.log("👤 User ID from session:", userId);

    // Validate required fields
    const requiredFields = ["name", "email", "selectedPackage"];
    for (const field of requiredFields) {
      if (!formData[field]) {
        console.error(`❌ Missing required field: ${field}`);
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    const packageInfo =
      PACKAGES[formData.selectedPackage as keyof typeof PACKAGES];
    if (!packageInfo) {
      console.error("❌ Invalid package selected:", formData.selectedPackage);
      return NextResponse.json(
        { error: "Invalid package selected" },
        { status: 400 }
      );
    }
    console.log("📦 Package info found:", packageInfo);

    // 1. Create Order in Database (PENDING_PAYMENT)
    console.log("📦 Creating order in database...");
    const orderData = {
      ...formData,
      userId, // Add userId from session
      maintenancePrice: packageInfo.maintenancePrice || 49,
    };
    const order = await createPendingOrder(orderData);
    console.log(`✅ Order created: ${order.orderNumber} (${order.id})`);

    // 2. Create Stripe checkout session with order metadata
    console.log("💳 Creating Stripe session...");
    const sessionData = {
      ...formData,
      orderId: order.id,
      orderNumber: order.orderNumber,
    };
    const stripeSession = await createCheckoutSession(sessionData);
    console.log("✅ Stripe session created:", stripeSession.id);

    // 3. Update order with Stripe session ID
    await updateOrderWithStripeSession(order.id, stripeSession.id);

    // No password needed for checkout - user will be created via auth system
    console.log("✅ Skipping password handling - using auth system");

    // Create customer record in Airtable
    const customerRecord = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: "N/A", // Airtable requires password field
      companyName: formData.companyName,
      businessField: formData.businessField,
      selectedPackage: formData.selectedPackage,
      packagePrice: packageInfo.price,
      hasDomain: formData.hasDomain,
      domainName: formData.domainName,
      requiredFeatures:
        formData.requiredFeatures ||
        (formData.packageAnswers
          ? Object.values(formData.packageAnswers).flat()
          : []),
      hasSocialMedia: formData.hasSocialMedia,
      socialMediaAccounts: formData.socialMediaAccounts || [],
      selectedAddons: formData.selectedAddons || [],
      maintenanceRequired: true, // Now mandatory for all packages
      projectDescription: formData.projectDescription,
      specialRequirements: formData.specialRequirements,
      stripeSessionId: stripeSession.id,
      paymentStatus: "pending",
      createdAt: new Date().toISOString(),
    };

    console.log("📊 Creating Airtable record...");
    await createCustomerRecord(customerRecord);
    console.log("✅ Airtable record created");

    // Send welcome email (in background)
    console.log("📧 Sending notifications...");
    const emailData = {
      name: formData.name,
      email: formData.email,
      companyName: formData.companyName,
      selectedPackage: formData.selectedPackage,
      businessField: formData.businessField,
      requiredFeatures:
        formData.requiredFeatures ||
        (formData.packageAnswers
          ? Object.values(formData.packageAnswers).flat()
          : []),
      selectedAddons: formData.selectedAddons || [],
      maintenanceRequired: true,
      packageAnswers: formData.packageAnswers || {},
      hasDomain: formData.hasDomain,
      hasSocialMedia: formData.hasSocialMedia,
      socialMediaAccounts: formData.socialMediaAccounts || [],
    };

    // Send notifications asynchronously
    Promise.all([
      sendWelcomeEmail(emailData),
      sendSlackNotification(emailData),
    ]).catch((error) => {
      console.error("Error sending notifications:", error);
    });

    console.log("✅ All operations completed successfully");
    return NextResponse.json({ url: stripeSession.url });
  } catch (error) {
    console.error("❌ Checkout error:", error);
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack trace"
    );
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
