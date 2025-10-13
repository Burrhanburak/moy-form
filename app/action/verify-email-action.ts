"use server";

import { auth } from "@/lib/auth";
import { z } from "zod";
import { headers } from "next/headers";
import { arcjetSignIn } from "@/lib/arcjet";
import { prisma } from "@/lib/prisma";
// import { trackEvent } from "@/lib/trackEvent"; // Removed - client-side only

const VerifyEmailSchema = z.object({
  token: z.string().min(1, "Token gereklidir"),
});

const VerifyEmailOTPSchema = z.object({
  email: z.string().email("Geçerli bir email adresi girin"),
  otp: z.string().length(6, "OTP 6 haneli olmalıdır"),
});

const SendOTPSchema = z.object({
  email: z.string().email("Geçerli bir email adresi girin"),
});

export type VerifyEmailInputs = z.infer<typeof VerifyEmailSchema>;
export type VerifyEmailOTPInputs = z.infer<typeof VerifyEmailOTPSchema>;

// Token-based email verification (no email input, just token validation)
export const verifyEmailAction = async (
  prevState: unknown,
  formData: FormData
) => {
  const rawData = {
    token: formData.get("token") as string,
  };

  const emailValue = formData.get("email") as string;
  // trackEvent("Email Verified", {
  //   email: emailValue,
  //   source: "verify_email_page",
  // }); // Removed - client-side only
  // Validate input
  const validation = VerifyEmailSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      error: validation.error.issues[0]?.message || "Geçersiz token",
    };
  }

  const { token } = validation.data;

  try {
    // Verify email with token
    await auth.api.verifyEmail({
      query: {
        token,
      },
      headers: await headers(),
    });

    return { success: true, error: null };
  } catch (error) {
    console.error("Verify email error:", error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Email doğrulama başarısız. Link süresi dolmuş olabilir." };
  }
};

// OTP-based email verification
export const verifyEmailWithOTPAction = async (
  prevState: unknown,
  formData: FormData
) => {
  const rawData = {
    email: formData.get("email") as string,
    otp: formData.get("otp") as string,
  };

  // Validate input
  const validation = VerifyEmailOTPSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      error: validation.error.issues[0]?.message || "Geçersiz veri",
    };
  }

  const { email, otp } = validation.data;

  try {
    // Arcjet email validation + Rate limiting
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
      }
      return { error: "Erişim reddedildi." };
    }

    // Verify email with OTP
    await auth.api.checkVerificationOTP({
      body: {
        email,
        otp,
        type: "email-verification",
      },
      headers: await headers(),
    });

    return { success: true, error: null };
  } catch (error) {
    console.error("Verify email OTP error:", error);

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
          error: "Kodun süresi doldu. Lütfen yeni bir doğrulama kodu isteyin.",
        };
      }

      if (errorMessage.includes("not found")) {
        return {
          error: "Doğrulama kodu bulunamadı. Lütfen yeni bir kod isteyin.",
        };
      }

      return { error: error.message };
    }

    return {
      error: "Kod doğrulama başarısız. Kod hatalı veya süresi dolmuş olabilir.",
    };
  }
};

// Send verification OTP
export const sendVerificationOTPAction = async (
  prevState: unknown,
  formData: FormData
) => {
  const rawData = {
    email: formData.get("email") as string,
  };

  // Validate input
  const validation = SendOTPSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      error: validation.error.issues[0]?.message || "Geçersiz email",
    };
  }

  const { email } = validation.data;

  try {
    // Arcjet email validation + Rate limiting
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
      }
      return { error: "Erişim reddedildi." };
    }

    // Send verification OTP
    await auth.api.sendVerificationOTP({
      body: {
        email,
        type: "email-verification",
      },
      headers: await headers(),
    });

    return { success: true, error: null };
  } catch (error) {
    console.error("Send verification OTP error:", error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "OTP gönderme başarısız oldu" };
  }
};

// Resend verification email (link-based)
export const resendVerificationEmailAction = async (
  prevState: unknown,
  formData: FormData
) => {
  const emailValue = formData.get("email");

  // Check if email exists and is not null
  if (!emailValue || emailValue === null || emailValue === "") {
    return {
      error: "Email adresi gereklidir",
    };
  }

  const rawData = {
    email: emailValue as string,
  };

  // Validate input
  const validation = SendOTPSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      error: validation.error.issues[0]?.message || "Geçersiz email",
    };
  }

  const { email } = validation.data;

  try {
    // First check if user exists and their verification status
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user && user.emailVerified) {
      return {
        error: "Bu email adresi zaten doğrulanmış. Giriş yapmayı deneyin.",
      };
    }
    // Arcjet email validation + Rate limiting
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
      }
      return { error: "Erişim reddedildi." };
    }

    await auth.api.sendVerificationEmail({
      body: {
        email,
        callbackURL: "/onboarding",
      },
      headers: await headers(),
    });

    return { success: true, error: null };
  } catch (error) {
    console.error("Resend verification email error:", error);
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();

      // Better-auth specific error messages
      if (errorMessage.includes("unverified email")) {
        return {
          error:
            "Bu email adresi zaten doğrulanmış. Dashboard'a giriş yapabilirsiniz.",
        };
      }

      if (errorMessage.includes("rate limit")) {
        return {
          error: "Çok fazla email gönderme denemesi. Lütfen biraz bekleyin.",
        };
      }

      return { error: "Email gönderme başarısız. Lütfen tekrar deneyin." };
    }
    return { error: "Email gönderme başarısız oldu" };
  }
};
