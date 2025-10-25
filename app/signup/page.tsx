"use client";
import { MagicClickSignupForm } from "@/components/Form/MagicClickSignupForm";
import { useSegment } from "@/hooks/useSegment";
import React, { useEffect } from "react";

export default function SignUp() {
  const { track } = useSegment();

  useEffect(() => {
    track("Signup Started", {
      method: "email",
      source: "landing",
    });
  }, []);

  return (
    <div className="flex min-h-svh w-full bg-white dark:bg-zinc-950 items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        {/* <SignUpForm /> */}
        <MagicClickSignupForm />
      </div>
    </div>
  );
}
