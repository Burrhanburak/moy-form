"use server";

import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function saveOnboardingStep(
  step: number,
  data?: Record<string, unknown>
) {
  const cookieStore = await cookies();
  const currentData = JSON.parse(
    cookieStore.get("onboarding-data")?.value || "{}"
  );

  cookieStore.set(
    "onboarding-data",
    JSON.stringify({
      ...currentData,
      step,
      ...data,
    }),
    { path: "/", httpOnly: false }
  );
}

export async function getOnboardingData() {
  const cookieStore = await cookies();
  const data = cookieStore.get("onboarding-data");
  return data ? JSON.parse(data.value) : { step: 1 };
}

export async function clearOnboarding() {
  const cookieStore = await cookies();
  cookieStore.delete("onboarding-data");
}

// export async function saveOnboardingStep(step: number, data: any) {
//   try {
//     const session = await getSession(); // Get user session
//     const userId = session?.user?.id;

//     if (!userId) {
//       throw new Error("User not authenticated");
//     }

//     // Save data to database (example with Prisma)
//     await db.onboarding.upsert({
//       where: { userId },
//       update: { step, data: { ...data } },
//       create: { userId, step, data },
//     });

//     return { success: true };
//   } catch (error) {
//     console.error("Error saving onboarding step:", error);
//     return { success: false, error: "Failed to save onboarding step" };
//   }
// }

// export async function getOnboardingData() {
//   try {
//     const session = await getSession();
//     const userId = session?.user?.id;

//     if (!userId) {
//       throw new Error("User not authenticated");
//     }

//     const onboarding = await db.onboarding.findUnique({
//       where: { userId },
//     });

//     return onboarding ? onboarding.data : null;
//   } catch (error) {
//     console.error("Error fetching onboarding data:", error);
//     return null;
//   }
// }

// export async function clearOnboarding() {
//   try {
//     const session = await getSession();
//     const userId = session?.user?.id;

//     if (!userId) {
//       throw new Error("User not authenticated");
//     }

//     await prisma.onboarding.deleteMany({
//       where: { userId },
//     });

//     return { success: true };
//   } catch (error) {
//     console.error("Error clearing onboarding data:", error);
//     return { success: false, error: "Failed to clear onboarding data" };
//   }
// }
