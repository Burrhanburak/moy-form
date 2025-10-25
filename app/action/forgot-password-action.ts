"use server";

import { auth } from "@/lib/auth";
import { z } from "zod";
import { headers } from "next/headers";
import { arcjetSignIn } from "@/lib/arcjet";
import { prisma } from "@/lib/prisma";

const ForgotPasswordSchema = z.object({
  email: z.string().email("Geçerli bir email adresi girin"),
});

const ResetPasswordOTPSchema = z.object({
  email: z.string().email("Geçerli bir email adresi girin"),
  otp: z.string().length(6, "OTP 6 haneli olmalıdır"),
  newPassword: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
});

export type ForgotPasswordInputs = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordOTPInputs = z.infer<typeof ResetPasswordOTPSchema>;

export const forgotPasswordAction = async (
  prevState: unknown,
  formData: FormData
) => {
  const rawData = {
    email: formData.get("email") as string,
  };

  // Validate input
  const validation = ForgotPasswordSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      error: validation.error.issues[0]?.message || "Geçersiz email",
    };
  }

  const { email } = validation.data;

  try {
    // Check if user exists in database
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true },
    });

    if (!user) {
      return {
        error:
          "Bu email adresi sistemde kayıtlı değil. Lütfen sistemde kayıtlı email adresinizi giriniz.",
      };
    }

    // Mock request object for arcjet - Rate limiting
    const mockRequest = new Request("http://localhost:3000", {
      method: "POST",
      headers: await headers(),
    });

    // Arcjet protection: Rate limiting + Bot detection
    const decision = await arcjetSignIn.protect(mockRequest, {
      email,
      requested: 1,
    });

    console.log("Arcjet decision", decision);

    // Check if request is denied
    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return {
          error: "Çok fazla deneme yaptınız. Lütfen daha sonra tekrar deneyin.",
        };
      } else if (decision.reason.isBot()) {
        return { error: "Bot tespit edildi. Erişim reddedildi." };
      } else if (decision.reason.isEmail()) {
        const emailReason = decision.reason;
        if (emailReason.emailTypes.includes("DISPOSABLE")) {
          return { error: "Geçici/disposable email adresleri kullanılamaz." };
        } else if (emailReason.emailTypes.includes("INVALID")) {
          return { error: "Geçersiz email adresi formatı." };
        } else if (emailReason.emailTypes.includes("NO_MX_RECORDS")) {
          return { error: "Email adresi için MX kaydı bulunamadı." };
        }
        return { error: "Geçersiz email adresi." };
      } else {
        return { error: "Erişim reddedildi." };
      }
    }

    // Send password reset email
    await auth.api.forgetPassword({
      body: {
        email,
        redirectTo: "/auth/reset-password",
      },
    });

    return { success: true, error: null, email };
  } catch (error) {
    console.error("Forgot password error:", error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Email gönderme başarısız oldu. Lütfen tekrar deneyin." };
  }
};

// Send OTP for password reset
export const sendPasswordResetOTPAction = async (
  prevState: unknown,
  formData: FormData
) => {
  const rawData = {
    email: formData.get("email") as string,
  };

  // Validate input
  const validation = ForgotPasswordSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      error: validation.error.issues[0]?.message || "Geçersiz email",
    };
  }

  const { email } = validation.data;

  try {
    // Check if user exists in database
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true },
    });

    if (!user) {
      return { error: "Bu email adresi sistemde kayıtlı değil." };
    }

    // Arcjet email validation + Rate limiting + Bot detection
    const mockRequest = new Request("http://localhost:3000", {
      method: "POST",
      headers: await headers(),
    });

    const decision = await arcjetSignIn.protect(mockRequest, {
      email,
      requested: 1,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return {
          error: "Çok fazla deneme yaptınız. Lütfen daha sonra tekrar deneyin.",
        };
      } else if (decision.reason.isBot()) {
        return { error: "Bot tespit edildi. Erişim reddedildi." };
      } else if (decision.reason.isEmail()) {
        const emailReason = decision.reason;
        if (emailReason.emailTypes.includes("DISPOSABLE")) {
          return { error: "Geçici/disposable email adresleri kullanılamaz." };
        } else if (emailReason.emailTypes.includes("INVALID")) {
          return { error: "Geçersiz email adresi formatı." };
        } else if (emailReason.emailTypes.includes("NO_MX_RECORDS")) {
          return { error: "Email adresi için MX kaydı bulunamadı." };
        }
        return { error: "Geçersiz email adresi." };
      } else {
        return { error: "Erişim reddedildi." };
      }
    }

    // Send OTP for password reset
    await auth.api.forgetPassword({
      body: {
        email,
      },
      headers: await headers(),
    });

    return { success: true, error: null, email };
  } catch (error) {
    console.error("Send password reset OTP error:", error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "OTP gönderme başarısız oldu. Lütfen tekrar deneyin." };
  }
};

// Reset password with OTP
export const resetPasswordWithOTPAction = async (
  prevState: unknown,
  formData: FormData
) => {
  const rawData = {
    email: formData.get("email") as string,
    otp: formData.get("otp") as string,
    newPassword: formData.get("newPassword") as string,
  };

  // Validate input
  const validation = ResetPasswordOTPSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      error: validation.error.issues[0]?.message || "Geçersiz veri",
    };
  }

  const { email, otp, newPassword } = validation.data;

  try {
    // Verify OTP and reset password
    await auth.api.verifyEmail({
      query: {
        token: otp,
        callbackURL: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/reset-password`,
      },
    });

    // OTP verified, now reset password
    await auth.api.resetPassword({
      body: {
        newPassword,
        token: otp, // Using OTP as token
      },
      headers: await headers(),
    });

    return { success: true, error: null };
  } catch (error) {
    console.error("Reset password with OTP error:", error);

    // Better error messages for different scenarios
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();

      if (
        errorMessage.includes("invalid") ||
        errorMessage.includes("incorrect")
      ) {
        return {
          error:
            "Girdiğiniz kod hatalı. Lütfen email'inizdeki 6 haneli kodu kontrol edin.",
        };
      }

      if (errorMessage.includes("expired") || errorMessage.includes("expire")) {
        return {
          error:
            "Kodun süresi doldu. Lütfen yeni bir şifre sıfırlama kodu isteyin.",
        };
      }

      if (errorMessage.includes("not found")) {
        return {
          error:
            "Kod bulunamadı. Lütfen yeni bir şifre sıfırlama kodu isteyin.",
        };
      }

      return { error: error.message };
    }

    return {
      error:
        "Şifre sıfırlama başarısız. Kod hatalı veya süresi dolmuş olabilir.",
    };
  }
};
