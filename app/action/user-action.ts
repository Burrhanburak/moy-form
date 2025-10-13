"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const userProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  website: z.string().url().optional().or(z.literal("")),
  socialMedia: z.string().optional().or(z.literal("")),
});

export async function getUserProfile() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      website: true,
      socialMedia: true,
      emailVerified: true,
      twoFactorEnabled: true,
      createdAt: true,
    },
  });
  return user;
}

export async function updateUserProfile(
  prevState: unknown,
  formData: FormData
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { redirect: "/login" };

  const formDataObject = {
    name: formData.get("name"),
    email: formData.get("email"),
    website: formData.get("website") || "",
    socialMedia: formData.get("socialMedia") || "",
  };

  const result = userProfileSchema.safeParse(formDataObject);
  if (!result.success)
    return { error: result.error.issues[0].message, success: false };

  // Parse social media if it's a JSON string
  let socialMediaData = null;
  if (result.data.socialMedia) {
    try {
      const parsed = JSON.parse(result.data.socialMedia);
      socialMediaData =
        Array.isArray(parsed) && parsed.length > 0
          ? result.data.socialMedia
          : null;
    } catch {
      socialMediaData = result.data.socialMedia;
    }
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: result.data.name,
      email: result.data.email,
      website: result.data.website || null,
      socialMedia: socialMediaData,
    },
  });

  revalidatePath("/dashboard/settings");
  return { success: true, message: "Profile updated successfully" };
}

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(6),
    newPassword: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export async function changePassword(prevState: unknown, formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { redirect: "/login" };

  const formDataObject = {
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const result = changePasswordSchema.safeParse(formDataObject);
  if (!result.success)
    return { error: result.error.issues[0].message, success: false };

  try {
    await auth.api.changePassword({
      body: {
        currentPassword: result.data.currentPassword,
        newPassword: result.data.newPassword,
        revokeOtherSessions: true, // Güvenlik için diğer oturumları kapat
      },
      headers: await headers(),
    });

    revalidatePath("/dashboard/settings");
    return {
      success: true,
      message:
        "Şifre başarıyla değiştirildi. Diğer oturumlarınız güvenlik nedeniyle kapatıldı.",
    };
  } catch (error) {
    console.error("Change password error:", error);
    if (error instanceof Error) {
      return { error: error.message, success: false };
    }
    return {
      error: "Şifre değiştirme başarısız oldu. Mevcut şifrenizi kontrol edin.",
      success: false,
    };
  }
}

export async function DeleteUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { redirect: "/login" };

  await prisma.user.delete({
    where: { id: session.user.id },
  });

  revalidatePath("/dashboard/settings");
  return { success: true, message: "Kullanıcı başarıyla silindi" };
}
