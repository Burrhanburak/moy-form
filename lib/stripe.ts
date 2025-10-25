import Stripe from "stripe";
import {
  STRIPE_PRODUCTS,
  getWebsitePackage,
  getMaintenanceForPackage,
} from "@/utils/stripe-products";

// Use real Stripe key for testing
const stripeKey = process.env.STRIPE_SECRET_KEY || "";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("⚠️ STRIPE_SECRET_KEY not found - using dummy key for testing");
}

export const stripe = new Stripe(stripeKey, {
  apiVersion: "2025-08-27.basil",
});

export const createCheckoutSession = async (
  formData: Record<string, unknown>
) => {
  const {
    selectedPackage,
    selectedAddons = [],
    maintenanceRequired = false,
    ...customerData
  } = formData;

  // Get main website package
  const websitePackage = getWebsitePackage(
    selectedPackage as "Starter" | "Business" | "Ecommerce"
  );

  if (!websitePackage) {
    throw new Error(`Invalid package selected: ${selectedPackage}`);
  }

  // Create line items starting with the main website package
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
    {
      price_data: {
        currency: "usd",
        product_data: {
          name: websitePackage.name,
          description: websitePackage.description,
        },
        unit_amount: websitePackage.price,
      },
      quantity: 1,
    },
  ];

  // Add selected add-ons to line items
  if (selectedAddons && selectedAddons.length > 0) {
    for (const addonId of selectedAddons) {
      const addon = STRIPE_PRODUCTS[addonId];
      if (addon) {
        if (addon.type === "one_time") {
          lineItems.push({
            price_data: {
              currency: "usd",
              product_data: {
                name: addon.name,
                description: addon.description,
              },
              unit_amount: addon.price,
            },
            quantity: 1,
          });
        }
        // Recurring add-ons will be handled separately if needed
      }
    }
  }

  // Handle subscription data for recurring services
  const subscriptionLineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
    [];

  // Add maintenance - now mandatory for all packages
  if (true) {
    // Always add maintenance
    const maintenance = getMaintenanceForPackage(
      selectedPackage as "Starter" | "Business" | "Ecommerce"
    );
    if (maintenance) {
      subscriptionLineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: maintenance.name,
            description: maintenance.description,
          },
          unit_amount: maintenance.price,
          recurring: {
            interval: maintenance.interval as "month" | "year",
          },
        },
        quantity: 1,
      });
    }
  }

  // Add recurring add-ons to subscription
  if (selectedAddons && selectedAddons.length > 0) {
    for (const addonId of selectedAddons) {
      const addon = STRIPE_PRODUCTS[addonId];
      if (addon && addon.type === "recurring") {
        subscriptionLineItems.push({
          price_data: {
            currency: "usd",
            product_data: {
              name: addon.name,
              description: addon.description,
            },
            unit_amount: addon.price,
            recurring: {
              interval: addon.interval as "month" | "year",
            },
          },
          quantity: 1,
        });
      }
    }
  }

  // Determine checkout mode
  const hasSubscriptions = subscriptionLineItems.length > 0;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    payment_method_types: ["card"],
    success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/cancel?source=onboarding`,
    customer_email: customerData.email,
    metadata: {
      orderId: formData.orderId || "",
      orderNumber: formData.orderNumber || "",
      formEmail: customerData.email || "",
      package: selectedPackage,
      packageName: selectedPackage, // Webhook için
      customer_name: customerData.name || "",
      customer_email: customerData.email || "",
      customer_phone: customerData.phone || "",
      company_name: customerData.companyName || "",
      business_field: Array.isArray(customerData.businessField)
        ? customerData.businessField.slice(0, 2).join(", ") // İlk 2 alan
        : (customerData.businessField || "").substring(0, 50), // İlk 50 karakter
      form_submission_time: new Date().toISOString(),
      selected_addons: JSON.stringify(selectedAddons || []).substring(0, 100), // İlk 100 karakter
      maintenance_required: maintenanceRequired.toString(),
      // Subscription metadata - webhook için
      subscriptionPriceId: hasSubscriptions ? "maintenance" : "",
      subscriptionProductId: hasSubscriptions ? "maintenance-service" : "",
    },
  };

  if (hasSubscriptions) {
    // For subscription mode, we'll use line_items directly for recurring items
    sessionParams.mode = "subscription";
    sessionParams.line_items = [
      ...lineItems, // One-time items (setup fees)
      ...subscriptionLineItems, // Recurring items
    ];
    sessionParams.subscription_data = {
      metadata: {
        package: selectedPackage,
        customer_email: customerData.email,
        customer_name: customerData.name,
      },
    };
  } else {
    // One-time payment only
    sessionParams.mode = "payment";
    sessionParams.line_items = lineItems;
  }

  const session = await stripe.checkout.sessions.create(sessionParams);

  return session;
};
