"use server";

import { auth } from "@/lib/auth";
import { z } from "zod";
import { headers } from "next/headers";
import { arcjetSignIn } from "@/lib/arcjet";
import { prisma } from "@/lib/prisma";
// import { trackEvent } from "@/lib/trackEvent"; // Removed - client-side only

// const SignInSchema = z.object({
//   email: z.string().email(),
//   password: z.string().min(6),
// });

// export type SignInInputs = z.infer<typeof SignInSchema>;

// export const signInAction = async (formData: FormData) => {
//   const rawData = {
//     email: formData.get("email") as string,
//     password: formData.get("password") as string,
//   };
//   const { email, password } = SignInSchema.parse(rawData);

//   try {
//     // Mock request object for arcjet
//     const mockRequest = new Request("http://localhost:3000", {
//       method: "POST",
//       headers: await headers(),
//     });

//     // Arcjet protection: Email validation + Rate limiting + Bot detection
//     const decision = await arcjetSignIn.protect(mockRequest, {
//       email,
//       requested: 1,
//     });

//     console.log("Arcjet decision", decision);

//     // Check if request is denied
//     if (decision.isDenied()) {
//       if (decision.reason.isRateLimit()) {
//         return {
//           error: "Çok fazla deneme yaptınız. Lütfen daha sonra tekrar deneyin.",
//         };
//       } else if (decision.reason.isBot()) {
//         return { error: "Bot tespit edildi. Erişim reddedildi." };
//       } else if (decision.reason.isEmail()) {
//         // Detaylı email validasyon mesajları
//         const emailReason = decision.reason;
//         if (emailReason.emailTypes.includes("DISPOSABLE")) {
//           return { error: "Geçici/disposable email adresleri kullanılamaz." };
//         } else if (emailReason.emailTypes.includes("INVALID")) {
//           return { error: "Geçersiz email adresi formatı." };
//         } else if (emailReason.emailTypes.includes("NO_MX_RECORDS")) {
//           return {
//             error:
//               "Email adresi için MX kaydı bulunamadı. Lütfen geçerli bir email kullanın.",
//           };
//         }
//         return { error: "Geçersiz email adresi." };
//       } else {
//         return { error: "Erişim reddedildi." };
//       }
//     }

//     // Sign in the user
//     await auth.api.signInEmail({
//       headers: await headers(),
//       body: {
//         email,
//         password,
//       },
//     });

//     return { error: null };
//   } catch (error) {
//     if (error instanceof Error) {
//       return { error: error.message };
//     }
//     return { error: "An unknown error occurred" };
//   }
// };

export async function signInActionMagic(
  prevState: { success: boolean; message?: string; error?: string } | null,
  formData: FormData
): Promise<{ success: boolean; message?: string; error?: string }> {
  console.log("🟢 [SERVER] signInActionMagic called");
  try {
    const email = formData.get("email") as string;
    console.log("🟢 [SERVER] Email:", email);

    const emailSchema = z.string().email();
    const validatedEmail = emailSchema.parse(email);
    console.log("🟢 [SERVER] Email validated:", validatedEmail);

    const mockRequest = new Request("http://localhost:3000", {
      method: "POST",
      headers: await headers(),
    });

    console.log("🟢 [SERVER] Calling Arcjet...");
    const decision = await arcjetSignIn.protect(mockRequest, {
      email: validatedEmail,
      requested: 1,
    });
    console.log("🟢 [SERVER] Arcjet decision:", decision.conclusion);

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return { success: false, error: "Çok fazla deneme. Biraz bekleyin." };
      } else if (decision.reason.isBot()) {
        return {
          success: false,
          error: "Bot tespit edildi. Erişim reddedildi.",
        };
      } else if (decision.reason.isEmail()) {
        const emailReason = decision.reason;
        if (emailReason.emailTypes.includes("DISPOSABLE")) {
          return { success: false, error: "Disposable email kullanılamaz." };
        } else if (emailReason.emailTypes.includes("INVALID")) {
          return { success: false, error: "Geçersiz email formatı." };
        } else if (emailReason.emailTypes.includes("NO_MX_RECORDS")) {
          return { success: false, error: "Email için MX kaydı yok." };
        }
        return { success: false, error: "Geçersiz email adresi." };
      }
      return { success: false, error: "Erişim reddedildi." };
    }

    // Check if user exists
    console.log("🟢 [SERVER] Checking if user exists...");
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedEmail },
      select: {
        id: true,
        emailVerified: true,
        orders: {
          select: { id: true, status: true },
          take: 1,
        },
      },
    });
    console.log("🟢 [SERVER] User found:", existingUser ? "Yes" : "No");

    if (!existingUser) {
      // User doesn't exist - redirect to signup
      console.log("🟢 [SERVER] User not found, returning error");
      return {
        success: false,
        error:
          "Bu email adresi ile kayıtlı kullanıcı bulunamadı. Lütfen kayıt olun.",
        redirectTo: "/signup",
      };
    }

    // If user exists but email is not verified, send verification email
    if (!existingUser.emailVerified) {
      console.log("🟢 [SERVER] Email not verified, sending verification email");
      await auth.api.sendVerificationEmail({
        body: {
          email: validatedEmail,
          callbackURL: "/onboarding",
        },
        headers: await headers(),
      });

      console.log("🟢 [SERVER] Verification email sent");
      return {
        success: true,
        message: "Email doğrulama linki gönderildi! Email'inizi kontrol edin.",
      };
    }

    // Check if user has any orders (is a customer)
    const hasOrders = existingUser.orders && existingUser.orders.length > 0;
    console.log("🟢 [SERVER] User has orders:", hasOrders);

    // Determine redirect destination based on customer status
    const redirectDestination = hasOrders ? "/dashboard" : "/onboarding";
    console.log("🟢 [SERVER] Redirect destination:", redirectDestination);

    // User exists and email is verified - send magic link for signin
    console.log("🟢 [SERVER] Sending magic link...");
    await auth.api.signInMagicLink({
      body: {
        email: validatedEmail,
        callbackURL: redirectDestination,
      },
      headers: await headers(),
    });

    console.log("🟢 [SERVER] Magic link sent successfully!");
    return {
      success: true,
      message: "Giriş linki gönderildi! Email'inizi kontrol edin.",
    };
  } catch (error) {
    console.error("🔴 [SERVER] Error in signInActionMagic:", error);
    if (error instanceof z.ZodError) {
      console.log("🔴 [SERVER] Zod validation error");
      return { success: false, error: "Geçersiz email adresi." };
    }
    if (error instanceof Error) {
      console.log("🔴 [SERVER] Error message:", error.message);
      return { success: false, error: error.message };
    }
    console.log("🔴 [SERVER] Unknown error");
    return { success: false, error: "Beklenmeyen bir hata oluştu." };
  }
}
