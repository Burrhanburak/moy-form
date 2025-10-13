"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { calculateToolsPrice } from "@/utils/pricing-calculator";
import { stripe } from "@/lib/stripe";

const toolsSchema = z.object({
  name: z.string().min(1, "Name cannot be empty"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  features: z.string().min(1, "Features cannot be empty"),
  optionalAddons: z.string().optional(),
  maintenanceRequired: z.boolean(),

  // n8n Automation specific fields
  automationType: z.string().optional(),
  triggerType: z.string().optional(),
  integrations: z.string().optional(),
  complexity: z.string().optional(),
  executionFrequency: z.string().optional(),
  dataVolume: z.string().optional(),
  customRequirements: z.string().optional(),
  apiConnections: z.coerce.number().optional(),
  webhookEndpoints: z.coerce.number().optional(),
  dataTransformations: z.coerce.number().optional(),
  errorHandling: z.boolean().optional().default(false),
  monitoring: z.boolean().optional().default(false),
  backupStrategy: z.string().optional(),
  documentation: z.string().optional(),
  trainingIncluded: z.boolean().optional().default(false),
  supportLevel: z.string().optional(),
  technicalNotes: z.string().optional(),
  testingIncluded: z.boolean().optional().default(false),
  deploymentType: z.string().optional(),
  scalabilityOptions: z.string().optional(),
});

export async function createTools(data: z.infer<typeof toolsSchema>): Promise<{
  success: boolean;
  error?: string;
  checkoutUrl?: string;
  toolId?: string;
}> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  // Validate input
  const result = toolsSchema.safeParse(data);

  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  // Parse textarea fields to arrays
  const featuresArray = result.data.features
    .split("\n")
    .map((f) => f.trim())
    .filter(Boolean);

  const optionalAddonsArray = result.data.optionalAddons
    ? result.data.optionalAddons
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean)
    : [];

  const integrationsArray = result.data.integrations
    ? result.data.integrations
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean)
    : [];

  // 🎯 OTOMATIK FIYAT HESAPLAMA
  const pricing = calculateToolsPrice({
    complexity: result.data.complexity as any,
    automationType: result.data.automationType,
    triggerType: result.data.triggerType,
    executionFrequency: result.data.executionFrequency,
    dataVolume: result.data.dataVolume as any,
    integrations: integrationsArray,
    features: featuresArray,
    optionalAddons: optionalAddonsArray,
    apiConnections: result.data.apiConnections,
    webhookEndpoints: result.data.webhookEndpoints,
    dataTransformations: result.data.dataTransformations,
    errorHandling: result.data.errorHandling || false,
    monitoring: result.data.monitoring || false,
    trainingIncluded: result.data.trainingIncluded || false,
    testingIncluded: result.data.testingIncluded || false,
    maintenanceRequired: result.data.maintenanceRequired,
    supportLevel: result.data.supportLevel as any,
    deploymentType: result.data.deploymentType,
  });

  console.log("💰 Auto-calculated pricing for tool:", pricing);

  try {
    // 1. Create tool in database
    const tool = await prisma.tools.create({
      data: {
        name: result.data.name,
        price: pricing.totalPrice, // Otomatik hesaplanan fiyat
        description: result.data.description,
        features: featuresArray,
        optionalAddons: optionalAddonsArray,
        maintenanceRequired: result.data.maintenanceRequired,
        maintenancePrice: pricing.maintenancePrice.toString(),

        // n8n Automation specific fields
        automationType: result.data.automationType,
        triggerType: result.data.triggerType,
        integrations: integrationsArray,
        complexity: result.data.complexity,
        executionFrequency: result.data.executionFrequency,
        dataVolume: result.data.dataVolume,
        customRequirements: result.data.customRequirements,
        apiConnections: result.data.apiConnections,
        webhookEndpoints: result.data.webhookEndpoints,
        dataTransformations: result.data.dataTransformations,
        errorHandling: result.data.errorHandling || false,
        monitoring: result.data.monitoring || false,
        backupStrategy: result.data.backupStrategy,
        documentation: result.data.documentation,
        trainingIncluded: result.data.trainingIncluded || false,
        supportLevel: result.data.supportLevel,
        technicalNotes: result.data.technicalNotes,
        testingIncluded: result.data.testingIncluded || false,
        deploymentType: result.data.deploymentType,
        scalabilityOptions: result.data.scalabilityOptions,

        // User relation
        userId: session.user.id,
      },
    });

    console.log("✅ Tool created:", tool.id);

    // 2. Create Stripe Checkout Session
    const lineItems: any[] = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Custom Tool: ${tool.name}`,
            description: tool.description,
            metadata: {
              toolId: tool.id,
              type: "custom_tool",
            },
          },
          unit_amount: pricing.totalPrice, // cents
        },
        quantity: 1,
      },
    ];

    // Add subscription line item if maintenance required
    let subscriptionLineItems: any[] = [];
    if (pricing.maintenancePrice > 0) {
      subscriptionLineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: `${tool.name} - Monthly Maintenance`,
            description: "Monthly maintenance and support for automation tool",
          },
          unit_amount: pricing.maintenancePrice,
          recurring: {
            interval: "month",
          },
        },
        quantity: 1,
      });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: subscriptionLineItems.length > 0 ? "subscription" : "payment",
      ...(subscriptionLineItems.length > 0 && {
        subscription_data: {
          items: subscriptionLineItems,
          metadata: {
            toolId: tool.id,
            toolName: tool.name,
            userId: session.user.id,
          },
        },
      }),
      success_url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/cancel`,
      customer_email: session.user.email,
      metadata: {
        toolId: tool.id,
        toolName: tool.name,
        userId: session.user.id,
        email: session.user.email,
        type: "custom_tool",
      },
    });

    console.log("✅ Stripe checkout session created:", checkoutSession.id);

    revalidatePath("/dashboard/benefits");

    return {
      success: true,
      checkoutUrl: checkoutSession.url || undefined,
      toolId: tool.id,
    };
  } catch (error) {
    console.error("❌ Error creating tool:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to save tool";
    return { success: false, error: `Failed to save tool: ${errorMessage}` };
  }
}

export async function getAllTools() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return [];
  }

  try {
    const tools = await prisma.tools.findMany({
      where: {
        userId: session.user.id, // Sadece kullanıcının kendi toolsleri
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

        // n8n Automation specific fields
        automationType: true,
        triggerType: true,
        integrations: true,
        complexity: true,
        executionFrequency: true,
        dataVolume: true,
        customRequirements: true,
        apiConnections: true,
        webhookEndpoints: true,
        dataTransformations: true,
        errorHandling: true,
        monitoring: true,
        backupStrategy: true,
        documentation: true,
        trainingIncluded: true,
        supportLevel: true,
        technicalNotes: true,
        testingIncluded: true,
        deploymentType: true,
        scalabilityOptions: true,

        userId: true,
        createdAt: true,
        updatedAt: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return tools;
  } catch (error) {
    console.error("Error fetching tools:", error);
    return [];
  }
}

export async function getTools() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return [];
  }

  try {
    const tools = await prisma.tools.findMany({
      where: {
        userId: session.user.id, // Sadece kullanıcının kendi toolsleri
      },
      select: {
        id: true,
        name: true,
        price: true,
      },
    });
    return tools;
  } catch (error) {
    console.error("Error fetching tools:", error);
    return [];
  }
}

export async function getToolById(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { redirect: "/login" };
  }

  try {
    const tool = await prisma.tools.findFirst({
      where: {
        id: id,
        userId: session.user.id, // Sadece kullanıcının kendi tool'u
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
        automationType: true,
        triggerType: true,
        integrations: true,
        complexity: true,
        executionFrequency: true,
        dataVolume: true,
        customRequirements: true,
        apiConnections: true,
        webhookEndpoints: true,
        dataTransformations: true,
        errorHandling: true,
        monitoring: true,
        backupStrategy: true,
        documentation: true,
        trainingIncluded: true,
        supportLevel: true,
        technicalNotes: true,
        testingIncluded: true,
        deploymentType: true,
        scalabilityOptions: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!tool) {
      return { error: "Tool not found", tool: null };
    }

    return { error: null, tool };
  } catch (error) {
    console.error("Error fetching tool:", error);
    return { error: "Failed to fetch tool", tool: null };
  }
}
