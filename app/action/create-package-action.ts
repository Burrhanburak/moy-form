"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { calculatePackagePrice } from "@/utils/pricing-calculator";
import { stripe } from "@/lib/stripe";

const packageSchema = z.object({
  name: z.string().min(1, "Name cannot be empty"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  businessType: z.string().optional(),
  targetAudience: z.string().optional(),
  features: z.array(z.string()).min(1, "At least one feature is required"),
  optionalAddons: z.array(z.string()).optional(),
  uploadedImages: z.array(z.string()).optional(),
  advancedSeo: z.boolean().default(false),
  customUiUx: z.boolean().default(false),
  liveChat: z.boolean().default(false),
  maintenanceRequired: z.boolean(),

  // Site package specific fields
  numberOfPages: z.coerce.number().optional(),
  referenceImages: z.string().optional(),
  referenceUrls: z.string().optional(),
  deliveryTimeInDays: z.coerce.number().optional(),
  specialNotes: z.string().optional(),
  isCustomRequest: z.boolean().optional().default(false),
});

export async function createPackage(
  data: z.infer<typeof packageSchema>
): Promise<{
  success: boolean;
  error?: string;
  checkoutUrl?: string;
  packageId?: string;
}> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  // Validate input
  const result = packageSchema.safeParse(data);

  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  // Features are already arrays from MultiSelector
  const featuresArray = result.data.features || [];
  const optionalAddonsArray = result.data.optionalAddons || [];

  // Premium features to include in pricing
  const allFeatures = [...featuresArray];
  if (result.data.advancedSeo) allFeatures.push("Advanced SEO");
  if (result.data.customUiUx) allFeatures.push("Custom UI/UX Design");
  if (result.data.liveChat) allFeatures.push("Live Chat Integration");

  // Parse reference URLs/images from textarea
  const referenceUrlsArray = result.data.referenceUrls
    ? result.data.referenceUrls
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean)
    : [];

  const referenceImagesArray = result.data.referenceImages
    ? result.data.referenceImages
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean)
    : [];

  // Combine with uploaded images
  const allReferenceImages = [
    ...referenceImagesArray,
    ...(result.data.uploadedImages || []),
  ];

  // 🎯 OTOMATIK FIYAT HESAPLAMA
  const pricing = calculatePackagePrice({
    numberOfPages: result.data.numberOfPages,
    deliveryTimeInDays: result.data.deliveryTimeInDays,
    features: allFeatures,
    optionalAddons: optionalAddonsArray,
    maintenanceRequired: result.data.maintenanceRequired,
    isCustomRequest: result.data.isCustomRequest || false,
    referenceUrls: referenceUrlsArray,
    referenceImages: allReferenceImages,
  });

  console.log("💰 Auto-calculated pricing:", pricing);

  try {
    // Create PENDING package (will be activated after payment)
    const pkg = await prisma.packages.create({
      data: {
        name: result.data.name,
        price: pricing.totalPrice,
        description: result.data.description,
        features: allFeatures,
        optionalAddons: optionalAddonsArray,
        maintenanceRequired: result.data.maintenanceRequired,
        maintenancePrice: pricing.maintenancePrice.toString(),
        numberOfPages: result.data.numberOfPages,
        referenceImages: allReferenceImages,
        referenceUrls: referenceUrlsArray,
        deliveryTimeInDays: result.data.deliveryTimeInDays,
        specialNotes: result.data.specialNotes,
        isCustomRequest: result.data.isCustomRequest || false,
        userId: session.user.id,
        // Mark as pending until payment
        status: "PENDING", // We'll activate in webhook
      },
    });

    console.log("📦 Package created (PENDING):", pkg.id);

    // 2. Create Stripe Checkout Session
    // NOTE: Stripe doesn't allow mixing one-time and recurring in subscription mode
    // Solution: Create separate products - one for package, one for maintenance subscription

    if (pricing.maintenancePrice > 0) {
      // BEST SOLUTION: Separate payment for setup, then subscription
      // Step 1: Create payment for setup fee ($2,880)
      // Step 2: Redirect to subscription setup ($200/month)

      // For now: Show both amounts in description, charge in webhook
      const maintenanceProduct = await stripe.products.create({
        name: `${pkg.name} - Monthly Maintenance`,
        description: `Setup: $${(pricing.totalPrice / 100).toFixed(2)} + Monthly: $${(pricing.maintenancePrice / 100).toFixed(2)}`,
        metadata: {
          packageId: pkg.id,
          type: "custom_package_maintenance",
        },
      });

      const maintenancePrice = await stripe.prices.create({
        product: maintenanceProduct.id,
        currency: "usd",
        unit_amount: pricing.maintenancePrice,
        recurring: {
          interval: "month",
        },
      });

      // Checkout with ONLY maintenance (setup fee charged in webhook)
      const checkoutSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price: maintenancePrice.id,
            quantity: 1,
          },
        ],
        mode: "subscription",
        subscription_data: {
          metadata: {
            packageId: pkg.id,
            userId: session.user.id,
            setupFee: pricing.totalPrice.toString(),
            chargeSetupFee: "true",
          },
        },
        success_url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/cancel?source=custom_package&packageId=${pkg.id}`,
        customer_email: session.user.email,
        metadata: {
          packageId: pkg.id,
          packageName: pkg.name,
          userId: session.user.id,
          email: session.user.email,
          type: "custom_package_with_maintenance",
          setupFee: pricing.totalPrice.toString(),
          chargeSetupFee: "true",
          stripePriceId: maintenancePrice.id,
          stripeProductId: maintenanceProduct.id,
        },
      });

      console.log("✅ Stripe checkout session created:", checkoutSession.id);

      revalidatePath("/dashboard/benefits");

      return {
        success: true,
        checkoutUrl: checkoutSession.url || undefined,
        packageId: pkg.id,
      };
    } else {
      // PAYMENT MODE: One-time payment only (no maintenance)
      const packageProduct = await stripe.products.create({
        name: `${pkg.name} - One-time Package`,
        description: pkg.description,
        metadata: {
          packageId: pkg.id,
          type: "custom_package",
        },
      });

      const packagePrice = await stripe.prices.create({
        product: packageProduct.id,
        currency: "usd",
        unit_amount: pricing.totalPrice,
      });

      const checkoutSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price: packagePrice.id,
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/cancel?source=custom_package&packageId=${pkg.id}`,
        customer_email: session.user.email,
        metadata: {
          packageId: pkg.id,
          packageName: pkg.name,
          userId: session.user.id,
          email: session.user.email,
          type: "custom_package",
        },
      });

      console.log("✅ Stripe checkout session created:", checkoutSession.id);

      revalidatePath("/dashboard/benefits");

      return {
        success: true,
        checkoutUrl: checkoutSession.url || undefined,
        packageId: pkg.id,
      };
    }
  } catch (error) {
    console.error("❌ Error creating package:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to save package";
    return { success: false, error: `Failed to save package: ${errorMessage}` };
  }
}

export async function getAllPackages() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return [];
  }

  try {
    const packages = await prisma.packages.findMany({
      where: {
        userId: session.user.id, // Sadece kullanıcının kendi paketleri
      },
      select: {
        id: true,
        name: true,
        price: true,
        description: true,
        features: true,
        optionalAddons: true,
        maintenanceRequired: true,
        maintenancePrice: true,

        // Site package specific fields
        numberOfPages: true,
        referenceImages: true,
        referenceUrls: true,
        priceRangeMin: true,
        priceRangeMax: true,
        revisionCount: true,
        deliveryTimeInDays: true,
        specialNotes: true,
        isCustomRequest: true,

        userId: true,
        createdAt: true,
        updatedAt: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return packages;
  } catch (error) {
    console.error("Error fetching packages:", error);
    return [];
  }
}

export async function getPackages() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return [];
  }

  try {
    const packages = await prisma.packages.findMany({
      where: {
        userId: session.user.id, // Sadece kullanıcının kendi paketleri
        status: "ACTIVE", // Sadece aktif paketleri göster (PENDING olanları değil)
      },
      select: {
        id: true,
        name: true,
        price: true,
      },
    });
    return packages;
  } catch (error) {
    console.error("Error fetching packages:", error);
    return [];
  }
}

export async function getPackageById(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { redirect: "/login" };
  }

  try {
    const packageData = await prisma.packages.findFirst({
      where: {
        id: id,
        userId: session.user.id, // Sadece kullanıcının kendi package'ı
      },
      select: {
        id: true,
        name: true,
        price: true,
        description: true,
        features: true,
        optionalAddons: true,
        maintenanceRequired: true,
        maintenancePrice: true,
        numberOfPages: true,
        referenceImages: true,
        referenceUrls: true,
        priceRangeMin: true,
        priceRangeMax: true,
        revisionCount: true,
        deliveryTimeInDays: true,
        specialNotes: true,
        isCustomRequest: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!packageData) {
      return { error: "Package not found", package: null };
    }

    return { error: null, package: packageData };
  } catch (error) {
    console.error("Error fetching package:", error);
    return { error: "Failed to fetch package", package: null };
  }
}
