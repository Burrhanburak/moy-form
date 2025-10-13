// app/action/step-action.ts
"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { PACKAGES } from "@/utils/packages";
import { addonOptions } from "@/utils/formSchema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

// User authentication check function with Prisma
async function checkUserAuth() {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session?.user?.id) {
      console.log("❌ No session found, redirecting to login");
      redirect("/login");
    }

    // Check user in database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        emailVerified: true,
        name: true,
      },
    });

    if (!user) {
      console.log("❌ User not found in database, redirecting to login");
      redirect("/login");
    }

    if (!user.emailVerified) {
      console.log("❌ Email not verified, redirecting to verify-email");
      redirect("/verify-email");
    }

    console.log("✅ User authenticated and verified:", user.email);
    return user;
  } catch (error) {
    console.error("Auth check error:", error);
    redirect("/login");
  }
}

const stepOneSchema = z.object({
  companyName: z
    .string()
    .min(2, { message: "Company name must be at least 2 characters" }),
});

export async function submitStepOne(
  state: { success: boolean; message: string; error: string },
  formData: FormData
): Promise<{ success: boolean; message: string; error: string }> {
  // Check user authentication and email verification with Prisma
  await checkUserAuth();

  try {
    // Parse and validate form data
    const data = stepOneSchema.parse({
      companyName: formData.get("companyName"),
    });

    // TODO: Save data to a database or session
    // Example: await db.onboarding.update({ userId, step1: data });

    // Return success; client will navigate to the next step
    return {
      success: true,
      message: "Step 1 completed successfully",
      error: "",
    };
  } catch (error) {
    // Handle validation or other errors
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "",
        error: error.issues[0].message || "Invalid company name",
      };
    }
    return {
      success: false,
      message: "",
      error: "An unexpected error occurred",
    };
  }
}

// Step 2

const stepTwoSchema = z.object({
  businessField: z.array(z.string()).min(1, "Business field is required"),
});
export async function submitStepTwo(
  state: { success: boolean; message: string; error: string },
  formData: FormData
): Promise<{ success: boolean; message: string; error: string }> {
  // Check user authentication and email verification with Prisma
  await checkUserAuth();

  try {
    console.log("StepTwo action called");
    // Veriyi parse et ve doğrula
    const businessFieldData = formData.get("businessField");
    console.log("Business field data from form:", businessFieldData);
    let businessField = [];

    if (businessFieldData) {
      try {
        businessField = JSON.parse(businessFieldData as string);
      } catch (e) {
        // If parsing fails, try to split by comma
        businessField = (businessFieldData as string)
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
      }
    }

    console.log("Parsed business field:", businessField);
    const data = stepTwoSchema.parse({
      businessField,
    });
    console.log("Validation successful:", data);

    // ✅ TODO: DB'ye veya cookie'ye kaydet
    // await saveStepDataToDB(data);

    // Başarılı ise bir sonraki adıma geç
    revalidatePath("/onboarding/step-three");
    console.log("Returning success response");
    return {
      success: true,
      message: "Step 2 completed successfully",
      error: "",
    };
  } catch (error) {
    console.log("StepTwo validation error:", error);
    if (error instanceof z.ZodError) {
      // ✅ Güvenli erişim: error.issues varsa ilk mesajı al
      const firstError = error.issues?.[0]?.message ?? "Invalid form input";
      console.log("Zod error details:", error.issues);
      return {
        success: false,
        message: "",
        error: firstError,
      };
    }

    console.error("StepTwo Error:", error); // Debug amaçlı
    return {
      success: false,
      message: "",
      error: "An unexpected error occurred",
    };
  }
}

// Step 3

const stepThreeSchema = z.object({
  projectDescription: z.string().optional().nullable(),
  specialRequirements: z.string().optional().nullable(),
  exampleSites: z.string().optional().nullable(),
  additionalNotes: z.string().optional().nullable(),
});

export async function submitStepThree(
  state: { success: boolean; message: string; error: string },
  formData: FormData
): Promise<{ success: boolean; message: string; error: string }> {
  // Check user authentication and email verification with Prisma
  await checkUserAuth();

  try {
    const data = stepThreeSchema.parse({
      projectDescription: formData.get("projectDescription") || "",
      specialRequirements: formData.get("specialRequirements") || "",
      exampleSites: formData.get("exampleSites") || "",
      additionalNotes: formData.get("additionalNotes") || "",
    });

    // TODO: Save data to a database or session
    // Example: await db.onboarding.update({ userId, step3: data });

    // Return success response
    revalidatePath("/onboarding/step-four");
    return {
      success: true,
      message: "Step 3 completed successfully",
      error: "",
    };
  } catch (error) {
    console.log("StepThree validation error:", error);
    if (error instanceof z.ZodError) {
      const firstError = error.issues?.[0]?.message ?? "Invalid form data";
      console.log("Zod error details:", error.issues);
      return {
        success: false,
        message: "",
        error: firstError,
      };
    }
    return {
      success: false,
      message: "",
      error: "An unexpected error occurred",
    };
  }
}

// Step 4

const stepFourSchema = z.object({
  projectDescription: z.string().optional().nullable(),
  additionalNotes: z.string().optional().nullable(),
  projectRequirements: z.string().optional().nullable(),
});

export async function submitStepFour(
  state: { success: boolean; message: string; error: string },
  formData: FormData
): Promise<{ success: boolean; message: string; error: string }> {
  // Check user authentication and email verification with Prisma
  await checkUserAuth();

  try {
    const data = stepFourSchema.parse({
      projectDescription: formData.get("projectDescription") || "",
      additionalNotes: formData.get("additionalNotes") || "",
      projectRequirements: formData.get("projectRequirements") || "",
    });

    // TODO: Save data to a database or session
    // Example: await db.onboarding.update({ userId, step4: data });

    // Return success response
    revalidatePath("/onboarding/summary");
    return {
      success: true,
      message: "Step 4 completed successfully",
      error: "",
    };
  } catch (error) {
    console.log("StepFour validation error:", error);
    if (error instanceof z.ZodError) {
      const firstError = error.issues?.[0]?.message ?? "Invalid form data";
      console.log("Zod error details:", error.issues);
      return {
        success: false,
        message: "",
        error: firstError,
      };
    }
    return {
      success: false,
      message: "",
      error: "An unexpected error occurred",
    };
  }
}

// summary step

const summarySchema = z.object({
  selectedPackage: z.string().optional(),
  companyName: z.string().optional(),
  phone: z.string().optional(),
  businessField: z.string().optional(),
  packageAnswers: z.string().optional(),
  additionalNotes: z.string().optional(),
  projectRequirements: z.string().optional(),
  selectedAddons: z.string().optional(),
  maintenanceRequired: z.string().optional(),
  name: z.string().optional(),
});

export async function summaryStep(
  state: { success: boolean; message: string; error: string; url?: string },
  formData: FormData
): Promise<{ success: boolean; message: string; error: string; url?: string }> {
  // Check user authentication and email verification with Prisma
  const user = await checkUserAuth();

  try {
    console.log(
      "SummaryStep called with formData:",
      Object.fromEntries(formData)
    );

    // Parse form data
    const data = summarySchema.parse({
      selectedPackage: formData.get("selectedPackage"),
      companyName: formData.get("companyName"),
      phone: formData.get("phone"),
      businessField: formData.get("businessField"),
      packageAnswers: formData.get("packageAnswers"),
      additionalNotes: formData.get("additionalNotes"),
      projectRequirements: formData.get("projectRequirements"),
      selectedAddons: formData.get("selectedAddons"),
      maintenanceRequired: formData.get("maintenanceRequired"),
      name: formData.get("name"),
    });

    console.log("SummaryStep parsed data:", data);

    // TODO: Save data to a database or session
    // Example: await db.onboarding.update({ userId, step5: data });

    // Call checkout API
    try {
      const data = Object.fromEntries(formData);
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
      const response = await fetch(`${baseUrl}/api/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name || data.companyName || "Company",
          email: user.email, // Get email from authenticated user session
          selectedPackage: data.selectedPackage,
          companyName: data.companyName,
          phone: data.phone || null,
          businessField: JSON.parse(data.businessField as string),
          packageAnswers: JSON.parse(data.packageAnswers as string),
          additionalNotes: data.additionalNotes || null,
          projectRequirements: data.projectRequirements || null,
          selectedAddons: JSON.parse(data.selectedAddons as string),
          maintenanceRequired: data.maintenanceRequired === "true",
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return {
          success: false,
          message: "",
          error: `API Error: ${response.status} - ${errorText}`,
        };
      }

      const result = await response.json();
      if (result.url && result.sessionId) {
        // Redirect to SuccessPage with sessionId
        redirect(`/onboarding/success?session_id=${result.sessionId}`);
      }
      if (result.url) {
        return {
          success: true,
          message: "Order submitted successfully",
          error: "",
          url: result.url,
        };
      }

      if (result.url) {
        revalidatePath("/onboarding/summary");
        return {
          success: true,
          message: "Summary completed successfully",
          error: "",
          url: result.url,
        };
      }

      return {
        success: false,
        message: "",
        error: "No checkout URL in response",
      };
    } catch (apiError) {
      console.error("Checkout API error:", apiError);
      return {
        success: false,
        message: "",
        error: `Checkout error: ${apiError instanceof Error ? apiError.message : "Unknown error"}`,
      };
    }
  } catch (error) {
    console.log("SummaryStep error:", error);
    if (error instanceof z.ZodError) {
      const firstError = error.issues?.[0]?.message ?? "Invalid summary";
      console.log("Zod error details:", error.issues);
      return {
        success: false,
        message: "",
        error: firstError,
      };
    }
    return {
      success: false,
      message: "",
      error: "An unexpected error occurred",
    };
  }
}
function calculateTotalAmount(data: any): number {
  const packageInfo = PACKAGES[data.selectedPackage as keyof typeof PACKAGES];
  let total = packageInfo.price;
  if (data.selectedAddons) {
    const addons = JSON.parse(data.selectedAddons as string) as string[];
    total += addons.reduce((sum: number, addonId: string) => {
      const addon = addonOptions.find((opt) => opt.id === addonId);
      return (
        sum + (addon ? parseFloat(addon.price.replace(/[^0-9.-]+/g, "")) : 0)
      );
    }, 0);
  }
  return total;
}
