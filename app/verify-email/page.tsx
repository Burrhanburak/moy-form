import React from "react";
import { VerifyEmailForm } from "@/components/Form/VerifyEmailForm";

export default function VerifyEmailPage() {
  return (
    <div className="flex flex-col justify-center items-center min-h-svh w-full  bg-white dark:bg-zinc-950">
      <div className="w-full max-w-sm">
        <VerifyEmailForm />
      </div>
    </div>
  );
}
