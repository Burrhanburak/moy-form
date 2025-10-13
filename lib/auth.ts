import { APIError, betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { nextCookies } from "better-auth/next-js";
import { createAuthMiddleware, magicLink } from "better-auth/plugins";
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
  sendMagicLinkEmail,
  sendLoginMagicLinkEmail,
} from "./email";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  baseURL:
    process.env.BETTER_AUTH_URL ||
    process.env.NEXTAUTH_URL ||
    "http://localhost:3000",
  trustedOrigins: [
    process.env.BETTER_AUTH_URL ||
      process.env.NEXTAUTH_URL ||
      "http://localhost:3000",
  ],
  socialProviders: {
    ...(process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET && {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
      }),
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    maxPasswordLength: 128,
    resetPasswordTokenExpiresIn: 3600, // 1 hour
    requireEmailVerification: true, // Email verification required
    sendResetPassword: async ({ user, url, token }) => {
      try {
        await sendPasswordResetEmail(user.email, url);
        console.log(
          "Password reset email sent to:",
          user.email,
          "with URL:",
          url,
          "and token:",
          token
        );
      } catch (error) {
        console.error("Error sending password reset email:", error);
      }
    },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== "/signup") {
        return;
      }
      const allowedDomains = [
        "@gmail.com",
        "@outlook.com",
        "@hotmail.com",
        "@yahoo.com",
        "@icloud.com",
        "@proton.me",
        "@example.com",
      ];

      const isAllowedDomain = allowedDomains.some((domain) =>
        ctx.body?.email.endsWith(domain)
      );

      if (!isAllowedDomain) {
        throw new APIError("BAD_REQUEST", {
          message:
            "Please use a valid email address (Gmail, Outlook, Yahoo, etc.)",
        });
      }
    }),
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 3600, // 1 hour expiry
    sendVerificationEmail: async ({ user, url, token }) => {
      try {
        // Create a proper dashboard callback URL by setting callbackURL parameter
        const urlObj = new URL(url);
        urlObj.searchParams.set("callbackURL", "/onboarding");
        const dashboardUrl = urlObj.toString();

        await sendVerificationEmail(user.email, dashboardUrl);
        console.log(
          "Verification email sent to:",
          user.email,
          "with URL:",
          dashboardUrl,
          "and token:",
          token
        );
      } catch (error) {
        console.error("Error sending verification email:", error);
      }
    },
    async afterEmailVerification(user) {
      console.log(`${user.email} has been successfully verified!`);

      // Link existing orders to the verified user
      try {
        const { linkOrderToUser } = await import("@/lib/order-utils");
        await linkOrderToUser(user.id, user.email);
        console.log(`✅ Orders linked to user ${user.email}`);
      } catch (error) {
        console.error("❌ Error linking orders to user:", error);
      }

      // Ensure session is properly established
      console.log(`🔐 User session established for ${user.email}`);

      // Small delay to ensure session is fully established
      await new Promise((resolve) => setTimeout(resolve, 500));
    },
  },
  rateLimit: {
    enabled: true,
    max: 10,
    window: 60 * 1000,
  },
  session: {
    expiresIn: 30 * 24 * 60 * 60,
  },
  plugins: [
    nextCookies(),
    // twoFactor({
    //   issuer: "MoyForm",
    // }),
    // emailOTP({
    //   otpLength: 6, // 6 haneli OTP
    //   expiresIn: 600, // 10 dakika (600 saniye)
    //   sendVerificationOTP: async ({ email, otp, type }) => {
    //     try {
    //       await sendOTPEmail(email, otp, type);
    //       console.log(`OTP sent to ${email} for ${type}`);
    //     } catch (error) {
    //       console.error("Error sending OTP:", error);
    //     }
    //   },
    // }),
    magicLink({
      expiresIn: 3600, // 1 hour (3600 seconds)
      sendMagicLink: async ({ email, token, url }) => {
        try {
          // Check if this is a login or signup flow based on callbackURL
          const urlObj = new URL(url);
          const callbackURL = urlObj.searchParams.get("callbackURL");

          // If callbackURL is /dashboard, it's a login flow
          if (callbackURL === "/dashboard") {
            await sendLoginMagicLinkEmail(email, token, url);
          } else {
            // Otherwise it's a signup flow
            await sendMagicLinkEmail(email, token, url);
          }

          console.log(`Magic link sent to ${email} for ${token} → ${url}`);
        } catch (error) {
          console.error("Error sending magic link:", error);
        }
      },
      // Automatically verify email when magic link is used
      async onLinkVerified({ user }) {
        console.log(`Magic link verified for ${user.email}`);

        // Mark email as verified
        await prisma.user.update({
          where: { id: user.id },
          data: { emailVerified: true },
        });

        // Link existing orders to the verified user
        try {
          const { linkOrderToUser } = await import("@/lib/order-utils");
          await linkOrderToUser(user.id, user.email);
          console.log(`✅ Orders linked to user ${user.email}`);
        } catch (error) {
          console.error("❌ Error linking orders to user:", error);
        }

        console.log(
          `✅ Email verified and session established for ${user.email}`
        );
      },
    }),
  ],
});
