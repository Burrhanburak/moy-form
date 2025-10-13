"use server"

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { headers } from "next/headers";
import { arcjetAPI } from "@/lib/arcjet";

const ResetPasswordSchema = z.object({
  newPassword: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
  token: z.string().min(1, "Token gereklidir"),
});

export type ResetPasswordInputs = z.infer<typeof ResetPasswordSchema>;

export const resetPasswordAction = async (prevState: unknown, formData: FormData) => {
  const rawData = {
    token: formData.get("token") as string,
    newPassword: formData.get("newPassword") as string,
  };

  // Validate input
  const validation = ResetPasswordSchema.safeParse(rawData);
  if (!validation.success) {
    return { 
      error: validation.error.issues[0]?.message || "Geçersiz veri" 
    };
  }

  const { newPassword, token } = validation.data;

  try {
    // Mock request object for arcjet - Rate limiting only
    const mockRequest = new Request('http://localhost:3000', {
      method: 'POST',
      headers: await headers(),
    });
    
    // Arcjet protection: Rate limiting + Bot detection
    const decision = await arcjetAPI.protect(mockRequest, { 
      requested: 1 
    });

    console.log("Arcjet decision", decision);

    // Check if request is denied
    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return { error: "Çok fazla deneme yaptınız. Lütfen daha sonra tekrar deneyin." };
      } else if (decision.reason.isBot()) {
        return { error: "Bot tespit edildi. Erişim reddedildi." };
      } else {
        return { error: "Erişim reddedildi." };
      }
    }

    // ÖNCE verification kaydını al (resetPassword token'ı siler!)
    let verification = await prisma.verification.findFirst({
      where: {
        value: token,
      },
    });

    console.log("Verification found:", verification);

    // Reset password using correct API method
    await auth.api.resetPassword({
      body: {
        newPassword,
        token,
      },
    });

    // If token was valid, mark email as verified
    // User who successfully reset password has proven email ownership
    if (verification) {
      // identifier could be email or "forget-password:email" format
      let userEmail = verification.identifier;
      
      // Check if identifier has a prefix pattern
      if (userEmail.includes(":")) {
        userEmail = userEmail.split(":")[1]; // Extract email from "forget-password:email"
      }
      
      console.log(`🔍 Extracted email: ${userEmail}`);
      
      // Check if email is valid
      if (userEmail.includes("@")) {
        try {
          await prisma.user.update({
            where: { email: userEmail },
            data: { emailVerified: true },
          });
          console.log(`✅ Email verified for user: ${userEmail} after password reset`);
        } catch (updateError) {
          console.error("❌ Error updating user:", updateError);
        }
      }
    } else {
      console.warn("⚠️ No verification record found, email not auto-verified");
    }

    return { success: true, error: null };
  } catch (error) {
    console.error("Reset password error:", error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Şifre sıfırlama başarısız oldu. Link süresi dolmuş olabilir." };
  }
};