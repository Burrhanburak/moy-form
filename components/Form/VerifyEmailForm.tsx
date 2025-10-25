"use client";

import React, { useEffect, useState, useActionState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card-custom";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyEmailAction } from "@/app/action/verify-email-action";

export function VerifyEmailForm() {
  const [state, formAction] = useActionState(verifyEmailAction, null);
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [waitingForEmail, setWaitingForEmail] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const emailParam = searchParams.get("email"); // Email parametresi eklendi
  const errorParam = searchParams.get("error"); // Error parametresi eklendi (expired token için)

  // Initialize waiting screen or verify with token
  useEffect(() => {
    if (!token) {
      if (emailParam) {
        setWaitingForEmail(true);
        setVerifying(false);
        if (errorParam === "expired") {
          setError(
            "Doğrulama linki süresi dolmuş. Yeni link göndermek için aşağıdaki butonu kullanın."
          );
          toast.error("Doğrulama linki süresi dolmuş.");
        } else {
          setError(null);
        }
      } else {
        router.push("/login");
      }
      return;
    }

    const formData = new FormData();
    formData.append("token", token);
    formAction(formData);
  }, [token, emailParam, errorParam, formAction, router]);

  // Handle verification result
  useEffect(() => {
    if (state?.error) {
      setError(state.error);
      setVerifying(false);
      toast.error("Doğrulama başarısız");
    } else if (state?.success) {
      setVerifying(false);
      toast.success("Email başarıyla doğrulandı!");

      // Clear any existing onboarding data to start fresh
      if (typeof window !== "undefined") {
        localStorage.removeItem("moy-form-show-form");
        localStorage.removeItem("moy-form-selected-package");
        localStorage.removeItem("moy-form-current-step");
        localStorage.removeItem("moy-form-data");
        localStorage.removeItem("step-one-data");
        localStorage.removeItem("step-two-data");
        localStorage.removeItem("step-three-data");
        localStorage.removeItem("step-four-data");
        localStorage.removeItem("step-one-completed");
        localStorage.removeItem("step-two-completed");
        localStorage.removeItem("step-three-completed");
        localStorage.removeItem("step-four-completed");

        // Set flag to indicate this is a new session after email verification
        localStorage.setItem("moy-form-new-session", "true");
      }

      // Redirect to onboarding after 2 seconds
      // Better-auth autoSignInAfterVerification=true olduğu için otomatik giriş yapılır
      setTimeout(() => {
        window.location.href = "/onboarding"; // Hard redirect to ensure proper session
      }, 2000);
    }
  }, [state, router]);

  // Resend kaldırıldı

  return (
    <div className="bg-white dark:bg-zinc-950 flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md bg-white dark:bg-zinc-950 border-none shadow-none">
        {/* <Logo width={40} height={50} className="self-center" /> */}
        <CardHeader>
          <CardDescription className="text-black dark:text-white">
            {error && (
              <span className="text-red-500 text-sm font-medium dark:text-red-500">
                Doğrulama başarısız
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {verifying && (
              <div className="flex justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-black dark:border-white border-t-transparent"></div>
              </div>
            )}

            {waitingForEmail && emailParam && (
              <div className="flex flex-col mx-auto max-w-[360px] p-5 gap-12">
                <div className="relative flex p-3 text-[#FF4D00] border-2 border-[#FF4D00] w-fit rounded-2xl">
                  <div className="absolute border-2 border-[#FF4D00]/20 inset-[-6px] rounded-[20px]"></div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-mail-check"
                  >
                    <path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8"></path>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                    <path d="m16 19 2 2 4-4"></path>
                  </svg>
                </div>
                <div className="flex flex-col gap-4">
                  <h1 className="text-xl font-medium leading-8 text-black dark:text-white/90">
                    Let&apos;s verify your email
                  </h1>
                  <p className="text-sm text-black dark:text-white/70">
                    Check <span className="font-semibold">{emailParam}</span> to
                    verify your account and get started.
                  </p>
                </div>
                <div className="flex gap-1">
                  <p className="text-sm text-black dark:text-white/50">
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
              </div>
            )}

            {error && !waitingForEmail && (
              <div className="text-center space-y-4">
                <p className="text-red-500 font-medium">Doğrulama Başarısız</p>
                <p className="text-sm text-gray-400">{error}</p>
                <div className="flex gap-1 justify-center">
                  <p className="text-sm text-zinc-900/50 dark:text-white/50">
                    Need help?
                  </p>
                  <Link
                    target="_self"
                    className="flex"
                    tabIndex={-1}
                    href="mailto:info@moydus.com"
                  >
                    <button className="inline-flex items-center justify-center outline-none disabled:pointer-events-none gap-1 font-medium disabled:text-zinc-950/10 dark:disabled:text-white/20 text-green-600 hover:text-green-800 dark:hover:text-green-400 text-xs">
                      <p>Contact support</p>
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
