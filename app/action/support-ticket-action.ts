"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const supportTicketSchema = z.object({
  title: z.string().min(1, "Title cannot be empty"),
  content: z.string().min(1, "Content cannot be empty"),
});

export async function sendSupportTicket(
  prevState: unknown,
  formData: FormData
) {
  // authenticate user
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { redirect: "/login" };
  }

  // validate feedback
  const formDataObject = Object.fromEntries(formData.entries());
  const result = supportTicketSchema.safeParse(formDataObject);

  if (!result.success) {
    return { error: result.error.issues[0].message, success: false };
  }

  try {
    // add to db
    await prisma.supportTicket.create({
      data: {
        title: result.data.title,
        content: result.data.content,
        status: "PENDING",
        priority: "MEDIUM",
        userId: session.user.id,
      },
    });

    revalidatePath("/dashboard/tickets");
    return { success: true };
  } catch (error) {
    console.error("Error creating support ticket:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to save support ticket";
    return {
      error: `Failed to save support ticket: ${errorMessage}`,
      success: false,
    };
  }
}

export async function getAllSupportTickets() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return [];
  }

  try {
    // Only get tickets for the current user
    const supportTickets = await prisma.supportTicket.findMany({
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

    return supportTickets;
  } catch (error) {
    console.error("Error fetching support tickets:", error);
    return [];
  }
}
