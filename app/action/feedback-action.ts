"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const feedbackSchema = z.object({
  feedback: z.string().min(1, "Feedback cannot be empty"),
});

export async function sendFeedback(prevState: unknown, formData: FormData) {
  // authenticate user
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { redirect: "/login" };
  }

  // validate feedback
  const formDataObject = Object.fromEntries(formData.entries());
  const result = feedbackSchema.safeParse(formDataObject);

  if (!result.success) {
    return { error: result.error.issues[0].message, success: false };
  }

  try {
    // add to db
    await prisma.feedback.create({
      data: {
        feedback: result.data.feedback,
        userId: session.user.id,
      },
    });

    revalidatePath("/dashboard/feedback");
    return { success: true };
  } catch (error) {
    console.error("Error creating feedback:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to save feedback";
    return {
      error: `Failed to save feedback: ${errorMessage}`,
      success: false,
    };
  }
}

export async function getAllFeedbacks() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return [];
  }

  try {
    // Only get feedbacks for the current user
    const feedbacks = await prisma.feedback.findMany({
      where: {
        userId: session.user.id, // Filter by current user
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return feedbacks;
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    return [];
  }
}
