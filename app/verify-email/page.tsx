"use client";
import React, { Suspense, useEffect } from "react";
import { VerifyEmailForm } from "@/components/Form/VerifyEmailForm";
import { useSegment } from "@/hooks/useSegment";

export default function VerifyEmailPage() {
  const { track } = useSegment();

  useEffect(() => {
    track("Verify Page Viewed", {
      email: "pending",
      token_status: "pending",
    });
  }, []);

  return (
    <div className="flex flex-col justify-center items-center min-h-svh w-full  bg-white dark:bg-zinc-950">
      <div className="w-full max-w-sm">
        <Suspense fallback={<div>Loading...</div>}>
          <VerifyEmailForm />
        </Suspense>
      </div>
    </div>
  );
}
