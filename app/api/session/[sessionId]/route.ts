import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const resolvedParams = await params;
    const sessionId = resolvedParams.sessionId;

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID required" },
        { status: 400 }
      );
    }

    console.log("🔍 Fetching session:", sessionId);
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log("📄 Session data:", session);

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Get order data from database
    let orderData = null;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      try {
        orderData = await prisma.order.findUnique({
          where: { id: orderId },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            subscription: true,
            payments: true,
          },
        });
        console.log("📦 Order data found:", orderData?.orderNumber);
      } catch (error) {
        console.error("❌ Error fetching order:", error);
      }
    }

    // Get customer data from order or session metadata
    const customerData = orderData
      ? {
          name: orderData.customerName || "",
          email: orderData.formEmail || session.customer_details?.email || "",
          company: orderData.companyName || "",
          phone: orderData.phone || "",
          businessField: orderData.businessField || [],
          selectedAddons: orderData.selectedAddons || [],
          orderNumber: orderData.orderNumber,
          orderStatus: orderData.status,
        }
      : {
          name: session.metadata?.customer_name || "",
          email:
            session.customer_details?.email ||
            session.metadata?.customer_email ||
            "",
          company: session.metadata?.company_name || "",
          phone:
            session.customer_details?.phone ||
            session.metadata?.customer_phone ||
            "",
          businessField: session.metadata?.business_field || "",
          selectedAddons: session.metadata?.selected_addons
            ? JSON.parse(session.metadata.selected_addons)
            : [],
          maintenanceRequired:
            session.metadata?.maintenance_required === "true",
        };

    const responseData = {
      id: session.id,
      package: session.metadata?.packageName || 
               session.metadata?.package || 
               orderData?.packageName || 
               "Custom Package",
      amount: session.amount_total
        ? session.amount_total / 100
        : orderData?.totalPrice || 0,
      currency: session.currency?.toUpperCase() || "USD",
      status: session.status,
      customerData,
      orderData: orderData
        ? {
            id: orderData.id,
            orderNumber: orderData.orderNumber,
            status: orderData.status,
            totalPrice: orderData.totalPrice,
            hasUser: !!orderData.userId,
            hasSubscription: !!orderData.subscription,
          }
        : null,
      created: session.created,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error fetching session:", error);
    return NextResponse.json(
      { error: "Failed to fetch session data" },
      { status: 500 }
    );
  }
}
