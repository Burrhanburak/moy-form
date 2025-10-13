// Onboarding form (multi-step)
import React from "react";
import Onboarding from "@/components/Onboarding";

function OnboardingPage() {
  return (
    <div className="flex flex-col justify-center items-center min-h-svh w-full  bg-white dark:bg-zinc-950">
      <Onboarding />
    </div>
  );
}

export default OnboardingPage;

// <input
//   type="text"
//   id="company-name"
//   class="w-full text-sm leading-5 bg-transparent rounded-[10px] border border-zinc-950/10 dark:border-white/10 px-3 py-2 text-zinc-950 dark:text-white/90 placeholder:text-zinc-950/50 dark:placeholder:text-white/30 focus:border-zinc-950 dark:focus:border-white/60 focus:ring-2 focus:ring-zinc-950/10 dark:focus:ring-white/10 dark:ring-offset-zinc-950 focus:bg-white dark:focus:bg-zinc-950 pl-9"
//   placeholder="ACME"
//   name="company-name"
//   value=""
// ></input>;
