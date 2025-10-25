"use client";

import React, { useState } from "react";
import { Button } from "./button";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { signInwithGoogle } from "@/app/action/signIn-action";
import { signUpWithGoogle } from "@/app/action/signUp-action";

interface GoogleButtonProps {
  mode?: "login" | "signup";
  redirectTo?: string;
  className?: string;
  children?: React.ReactNode;
}

export default function GoogleButton({
  mode = "login",
  redirectTo,
  className = "",
  children = "Continue with Google",
}: GoogleButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("provider", "google");

      const action = mode === "signup" ? signUpWithGoogle : signInwithGoogle;

      const res = await action(null, formData);

      if (res.success) {
        toast.success(res.message || "Başarılı!");
        // Google auth URL varsa oraya, yoksa default redirect
        if (res.redirectpath) {
          window.location.href = res.redirectpath;
        } else {
          window.location.href = redirectTo || "/dashboard";
        }
      } else {
        toast.error(res.error || "Bir hata oluştu.");
        if (res.redirectpath) {
          window.location.href = res.redirectpath;
        }
      }
    } catch (err: any) {
      console.error("🔴 Google action error:", err);
      toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      onClick={handleClick}
      disabled={loading}
      type="button"
      className={`bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 rounded-md font-medium text-sm h-10 px-4 py-2 w-full ${className}`}
      style={{ minWidth: "200px" }}
    >
      <div className="flex items-center justify-center gap-2">
        {loading ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        )}
        {children}
      </div>
    </Button>
  );
}
