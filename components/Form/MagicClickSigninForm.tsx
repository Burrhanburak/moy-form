"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signInActionMagic } from "@/app/action/signIn-action";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card-custom";
import { CostumInput } from "@/components/ui/custom-input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import React, { useState } from "react";
import Logo from "../Logo";
import { Loader, Mail, TrendingUp } from "lucide-react";
import Link from "next/link";
import GoogleButton from "../ui/google-button";
import { trackEvent } from "@/lib/trackEvent";

// 🔐 Form validation schema
const formSchema = z.object({
  email: z.string().email({
    message: "Lütfen geçerli bir email adresi girin.",
  }),
});

export function MagicClickSigninForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = useState(false);

  // 🎯 React Hook Form setup
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  // 📤 Submit handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("🔵 Form submitted with:", values);
    setIsLoading(true);

    // Analytics
    trackEvent("Started Signin", {
      method: "magic_link",
      source: "signin_form",
    });

    // Server action'ı çağır
    const formData = new FormData();
    formData.append("email", values.email);

    console.log("🔵 Calling signInActionMagic...");

    // Wrap in Promise to ensure we handle the result properly
    const result = await signInActionMagic(null, formData).catch((err) => {
      console.error("❌ Server action error:", err);
      return {
        success: false,
        error: "Bir hata oluştu. Lütfen tekrar deneyin.",
      };
    });

    console.log("🔵 Result from signInActionMagic:", result);

    if (result.error) {
      console.log("❌ Error received:", result.error);
      toast.error(result.error);

      // If user doesn't exist, redirect to signup
      if ((result as any).redirectTo === "/signup") {
        setTimeout(() => {
          window.location.href = `/signup?email=${encodeURIComponent(values.email)}`;
        }, 1500);
      } else {
        setIsLoading(false);
      }
      return;
    }

    if (result.success) {
      console.log("✅ Success! Redirecting to /verify-email");
      toast.success(
        result.message || "Giriş linki gönderildi! Email'inizi kontrol edin."
      );
      // Redirect to verify page with email parameter
      console.log("🔵 Executing redirect...");
      window.location.href = `/verify-email?email=${encodeURIComponent(values.email)}`;
      return; // Prevent any further execution
    } else {
      console.log("⚠️ No success or error in result:", result);
      setIsLoading(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-white dark:bg-zinc-950 border-none shadow-none">
        <Logo width={40} height={50} className="self-center  mb-4" />
        <CardHeader>
          <CardTitle className="text-black dark:text-white">
            Sign in to Moy
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Enter your email and we&apos;ll send you a secure sign-in link to
            get started
            <TrendingUp className="inline-block w-4 h-4  align-middle ml-1" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              console.log("🔵 Form onSubmit triggered");
              form.handleSubmit(onSubmit)(e);
            }}
            className="flex flex-col gap-4"
          >
            <CostumInput
              type="email"
              className="border-[#313131]"
              icon={<Mail size={20} />}
              placeholder="Enter your email"
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-500">
                {form.formState.errors.email.message}
              </p>
            )}
            <Button
              type="submit"
              className="w-full bg-black text-white dark:text-white rounded-[10px]"
              disabled={isLoading}
            >
              {isLoading ? "Continue..." : "Continue"}{" "}
              {isLoading && <Loader className="w-4 h-4 animate-spin" />}
            </Button>
            <div className="h-3 justify-center items-center gap-2.5 inline-flex">
              <div className="grow h-px bg-[#999999]/10 dark:bg-white/10"></div>
              <div className="text-center text-[#999999] dark:text-white/30 text-[11px]">
                OR
              </div>
              <div className="grow h-px bg-[#999999]/10 dark:bg-white/10"></div>
            </div>
            <GoogleButton redirectTo="/dashboard" mode="login">
              <span className="text-black dark:text-black text-sm">
                Continue with Google
              </span>
            </GoogleButton>
          </form>

          <div className="mt-4 text-center text-black dark:text-white flex items-center justify-center gap-2 text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="underline underline-offset-4 text-black dark:text-white"
            >
              Get Started
            </Link>
          </div>

          <div className="text-sm text-[#999999] mt-15 dark:text-white/50">
            By signing in, you agree to the{" "}
            <Link
              href="https://moydus.com/terms-of-service"
              className="text-[#999999] underline underline-offset-2 hover:dark:text-white/70 hover:text-white/70"
              target="_blank"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="https://moydus.com/privacy-policy"
              className="text-[#999999] underline underline-offset-2 hover:dark:text-white/70 hover:text-white/70"
              target="_blank"
            >
              Privacy Policy
            </Link>
            .
          </div>
          <div className="flex gap-1 mt-6">
            <p className="text-sm text-[#999999] dark:text-white/50">
              Need help?
            </p>
            <Link
              target="_self"
              className="flex"
              tabIndex={-1}
              href="mailto:info@moydus.com"
            >
              <button className="inline-flex items-center justify-center outline-none disabled:pointer-events-none gap-1 font-medium disabled:text-zinc-950/10 dark:disabled:text-white/20 text-[#FF4D00] hover:text-[#FF4D00] dark:hover:text-[#FF4D00] text-xs">
                <p>Contact support</p>
              </button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
