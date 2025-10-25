"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { arcjetSignUp } from "@/lib/arcjet";
import { z } from "zod";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
// import { linkOrderToUser } from "@/lib/order-utils";
// const SignUpSchema = z.object({
//   email: z.string().email(),
//   password: z.string().min(6),
//   name: z.string().min(2),
// });

// export type Inputs = z.infer<typeof SignUpSchema>;

// export const signUpAction = async (formData: FormData) => {
//   const rawData = {
//     email: formData.get("email") as string,
//     password: formData.get("password") as string,
//     name: formData.get("name") as string,
//   };

//   // Session ID'yi al (varsa)
//   const sessionId = formData.get("session_id") as string | null;

//   const { email, password, name } = SignUpSchema.parse(rawData);

//   try {
//     // Mock request object for arcjet
//     const mockRequest = new Request("http://localhost:3000", {
//       method: "POST",
//       headers: await headers(),
//     });

//     // Arcjet protection: Email validation + Rate limiting + Bot detection + Signup protection
//     const decision = await arcjetSignUp.protect(mockRequest, {
//       email,
//     });

//     console.log("Arcjet decision", decision);

//     // Check if request is denied
//     if (decision.isDenied()) {
//       if (decision.reason.isRateLimit()) {
//         return {
//           error:
//             "Çok fazla kayıt denemesi yaptınız. Lütfen daha sonra tekrar deneyin.",
//         };
//       } else if (decision.reason.isBot()) {
//         return { error: "Bot tespit edildi. Erişim reddedildi." };
//       } else if (decision.reason.isEmail()) {
//         // Detaylı email validasyon mesajları
//         const emailReason = decision.reason;
//         if (emailReason.emailTypes.includes("DISPOSABLE")) {
//           return {
//             error:
//               "Geçici/disposable email adresleri kullanılamaz. Lütfen kalıcı bir email adresi kullanın.",
//           };
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
//         return { error: "Güvenlik kontrolü tarafından erişim reddedildi." };
//       }
//     }

//     // **ÖNEMLİ**: Önce placeholder user'ları kontrol et ve temizle
//     const existingUser = await prisma.user.findUnique({
//       where: { email },
//       include: {
//         orders: true,
//         subscriptions: true,
//       },
//     });

//     // Eğer gerçek bir user varsa (placeholder değil), hata dön
//     if (existingUser && !existingUser.id.startsWith("temp_")) {
//       console.log(`❌ Real user already exists with email: ${email}`);
//       return { error: "User already exists. Use another email." };
//     }

//     // Eğer placeholder user varsa, önce onu temizle
//     if (existingUser && existingUser.id.startsWith("temp_")) {
//       console.log(
//         `🧹 Found placeholder user, cleaning up before signup: ${existingUser.id}`
//       );

//       // Placeholder user'ı sil
//       await prisma.user.delete({
//         where: { id: existingUser.id },
//       });

//       console.log(`🗑️ Deleted placeholder user: ${existingUser.id}`);
//     }

//     await auth.api.signUpEmail({
//       body: {
//         email,
//         password,
//         name,
//       },
//     });

//     // **ÖNEMLİ**: Signup başarılıysa, order'ları bağla
//     try {
//       // Yeni oluşturulan user'ı bul
//       const newUser = await prisma.user.findUnique({
//         where: { email },
//       });

//       if (newUser) {
//         console.log(
//           `🔍 Looking for orders to link. Session ID: ${sessionId || "none"}, Email: ${email}`
//         );

//         // 1. Email ile eşleşen order'ları bul ve bağla
//         const linkedCount = await linkOrderToUser(newUser.id, email);
//         console.log(`🔗 Linked ${linkedCount} orders by email`);

//         // 2. Session ID ile order'ları bul (ekstra güvenlik)
//         if (sessionId) {
//           const ordersBySessionId = await prisma.order.updateMany({
//             where: {
//               stripeSessionId: sessionId,
//               userId: null,
//             },
//             data: { userId: newUser.id },
//           });

//           if (ordersBySessionId.count > 0) {
//             console.log(
//               `📦 Linked ${ordersBySessionId.count} additional orders by session_id`
//             );
//           }
//         }

//         // 3. Order'lardan Stripe Customer ID'yi al ve user'a ekle
//         const orderWithStripeCustomer = await prisma.order.findFirst({
//           where: {
//             userId: newUser.id,
//             stripeSessionId: { not: null },
//           },
//           orderBy: { createdAt: "desc" },
//         });

//         if (orderWithStripeCustomer?.stripeSessionId) {
//           try {
//             // Stripe session'dan customer ID'yi al
//             const { stripe } = await import("@/lib/stripe");
//             const checkoutSession = await stripe.checkout.sessions.retrieve(
//               orderWithStripeCustomer.stripeSessionId
//             );

//             if (checkoutSession.customer) {
//               await prisma.user.update({
//                 where: { id: newUser.id },
//                 data: { stripeCustomerId: checkoutSession.customer as string },
//               });
//               console.log(
//                 `✅ Added Stripe Customer ID to user: ${checkoutSession.customer}`
//               );
//             }
//           } catch (error) {
//             console.error("Error fetching stripe customer:", error);
//           }
//         }

//         // 4. Subscription oluştur (eğer order'da stripeSubscriptionId varsa)
//         const ordersWithSubscription = await prisma.order.findMany({
//           where: {
//             userId: newUser.id,
//             stripeSubscriptionId: { not: null },
//             subscriptionId: null, // henüz subscription oluşturulmamış
//           },
//         });

//         for (const order of ordersWithSubscription) {
//           if (order.stripeSubscriptionId) {
//             console.log(
//               `📋 Creating subscription for order ${order.orderNumber}: ${order.stripeSubscriptionId}`
//             );

//             try {
//               // Get fresh user data with stripeCustomerId
//               const userWithStripe = await prisma.user.findUnique({
//                 where: { id: newUser.id },
//                 select: { stripeCustomerId: true },
//               });

//               const subscription = await prisma.subscription.create({
//                 data: {
//                   userId: newUser.id,
//                   stripeSubscriptionId: order.stripeSubscriptionId,
//                   stripeCustomerId: userWithStripe?.stripeCustomerId || "",
//                   stripePriceId: "maintenance",
//                   stripeProductId: "maintenance-service",
//                   status: "ACTIVE",
//                   currentPeriodStart: new Date(),
//                   currentPeriodEnd: new Date(
//                     Date.now() + 30 * 24 * 60 * 60 * 1000
//                   ),
//                   packageName: order.packageName,
//                   businessField: order.businessField || [],
//                   socialMediaAccounts: order.socialMediaAccounts || [],
//                   packageAnswers: order.packageAnswers || {},
//                 },
//               });

//               // Order'a subscription'ı bağla
//               await prisma.order.update({
//                 where: { id: order.id },
//                 data: { subscriptionId: subscription.id },
//               });

//               console.log(
//                 `✅ Subscription ${subscription.id} created and linked to order ${order.orderNumber}`
//               );
//             } catch (subError) {
//               console.error(
//                 `❌ Error creating subscription for order ${order.orderNumber}:`,
//                 subError
//               );
//             }
//           }
//         }

//         // 5. Placeholder user'ları temizle
//         const placeholderUsers = await prisma.user.findMany({
//           where: {
//             AND: [{ id: { startsWith: "temp_" } }, { email }],
//           },
//           include: {
//             orders: true,
//             subscriptions: true,
//           },
//         });

//         for (const placeholderUser of placeholderUsers) {
//           console.log(`🧹 Cleaning up placeholder user: ${placeholderUser.id}`);

//           // Transfer any remaining orders
//           if (placeholderUser.orders.length > 0) {
//             await prisma.order.updateMany({
//               where: { userId: placeholderUser.id },
//               data: { userId: newUser.id },
//             });
//             console.log(
//               `📦 Transferred ${placeholderUser.orders.length} orders from placeholder`
//             );
//           }

//           // Transfer any subscriptions
//           if (placeholderUser.subscriptions.length > 0) {
//             await prisma.subscription.updateMany({
//               where: { userId: placeholderUser.id },
//               data: { userId: newUser.id },
//             });
//             console.log(
//               `📋 Transferred ${placeholderUser.subscriptions.length} subscriptions from placeholder`
//             );
//           }

//           // Delete placeholder user
//           await prisma.user.delete({
//             where: { id: placeholderUser.id },
//           });

//           console.log(`🗑️ Deleted placeholder user: ${placeholderUser.id}`);
//         }
//       }
//     } catch (transferError) {
//       // Order transfer hatası signup'ı etkilemez
//       console.error("⚠️ Error linking orders:", transferError);
//     }

//     return {
//       success: true,
//       message: "Kayıt başarılı! Email doğrulama linki gönderildi.",
//       emailSent: true,
//     };
//   } catch (error) {
//     if (error instanceof Error) {
//       return { error: error.message };
//     }
//     return { error: "An unknown error occurred" };
//   }
// };

export async function signUpActionMagic(
  prevState: { success: boolean; message?: string; error?: string } | null,
  formData: FormData
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const email = formData.get("email") as string;

    // Email validasyonu
    const emailSchema = z.string().email();
    const validatedEmail = emailSchema.parse(email);

    // Mock request object for arcjet
    const mockRequest = new Request("http://localhost:3000", {
      method: "POST",
      headers: await headers(),
    });

    // Arcjet email kontrolü
    const decision = await arcjetSignUp.protect(mockRequest, {
      email: validatedEmail,
    });

    console.log("Arcjet Magic Link decision", decision);

    // Arcjet reddetti mi kontrol et
    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return {
          success: false,
          error:
            "Çok fazla magic link talebi yaptınız. Lütfen daha sonra tekrar deneyin.",
        };
      } else if (decision.reason.isBot()) {
        return {
          success: false,
          error: "Bot tespit edildi. Erişim reddedildi.",
        };
      } else if (decision.reason.isEmail()) {
        const emailReason = decision.reason;
        if (emailReason.emailTypes.includes("DISPOSABLE")) {
          return {
            success: false,
            error:
              "Geçici/disposable email adresleri kullanılamaz. Lütfen kalıcı bir email adresi kullanın.",
          };
        } else if (emailReason.emailTypes.includes("INVALID")) {
          return { success: false, error: "Geçersiz email adresi formatı." };
        } else if (emailReason.emailTypes.includes("NO_MX_RECORDS")) {
          return {
            success: false,
            error:
              "Email adresi için MX kaydı bulunamadı. Lütfen geçerli bir email kullanın.",
          };
        }
        return { success: false, error: "Geçersiz email adresi." };
      } else {
        return {
          success: false,
          error: "Güvenlik kontrolü tarafından erişim reddedildi.",
        };
      }
    }

    // User kontrolü - zaten kayıtlı mı?
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

    // Eğer gerçek user varsa ve email verified ise, login'e yönlendir
    if (existingUser && !existingUser.id.startsWith("temp_")) {
      if (existingUser.emailVerified) {
        return {
          success: false,
          error: "Bu email adresi zaten kayıtlı. Lütfen giriş yapın.",
        };
      }
      // Email verified değilse, yeni magic link gönder
      console.log(`User exists but email not verified: ${validatedEmail}`);
    } else if (!existingUser) {
      // Yeni kullanıcı oluştur (magic link için gerekli)
      // Generate a unique ID using better-auth's method
      const userId = crypto.randomUUID(); // Use crypto.randomUUID for unique ID

      console.log(`Creating new user with email: ${validatedEmail}`);
      const newUser = await prisma.user.create({
        data: {
          id: userId,
          email: validatedEmail,
          name: validatedEmail.split("@")[0], // Email'den isim oluştur
          emailVerified: false, // Magic link doğruladıktan sonra true olacak
        },
      });
      console.log(`✅ User created: ${validatedEmail} with ID: ${newUser.id}`);
    }

    // Better-auth magic link API kullan (artık kullanıcı var)
    await auth.api.signInMagicLink({
      body: {
        email: validatedEmail,
        callbackURL: "/onboarding", // Magic link başarılı olunca nereye gidecek
      },
      headers: await headers(),
    });

    return {
      success: true,
      message:
        "Magic link gönderildi! Email'inizi kontrol edin ve linke tıklayın.",
    };
  } catch (error) {
    console.error("Magic Link Error:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: "Geçersiz email adresi." };
    }
    return {
      success: false,
      error: "Magic link gönderilemedi. Lütfen tekrar deneyin.",
    };
  }
}

export async function signUpWithGoogle(
  prevState: { success: boolean; message?: string; error?: string } | null,
  formData: FormData
): Promise<{
  success: boolean;
  message?: string;
  error?: string;
  redirectpath?: string;
}> {
  console.log("🟢 [SERVER] signUpWithGoogle called");

  try {
    const provider = formData.get("provider");
    if (provider !== "google") {
      return { success: false, error: "Invalid provider" };
    }
    if (!provider) {
      return { success: false, error: "Provider not found." };
    }

    // Google social auth - email kontrolü Google callback'te yapılır

    // Google signup işlemi - bu Google auth URL'i döner
    const response = await auth.api.signInSocial({
      body: {
        provider: "google",
        callbackURL: "/onboarding", // kayıt sonrası yönlendirme
      },
      headers: await headers(),
    });

    // Redirect URL döndüyse, client'a gönder
    if (response && response.url) {
      console.log("🔗 [SERVER] Google auth URL generated:", response.url);
      return { 
        success: true, 
        message: "Google'a yönlendiriliyor...",
        redirectpath: response.url 
      };
    }

    // Bu satıra gelmemeli
    console.log("❌ [SERVER] No redirect URL received");
    return { success: false, error: "Google auth URL alınamadı." };
  } catch (error) {
    console.error("🔴 [SERVER] Error in signUpWithGoogle:", error);
    return {
      success: false,
      error: "Google ile kayıt yapılırken bir hata oluştu.",
    };
  }
}
