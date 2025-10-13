import { MagicClickSigninForm } from "@/components/Form/MagicClickSigninForm";
import React from "react";
export default function SignupMagic() {
  return (
    <div className="flex min-h-svh w-full bg-white dark:bg-zinc-950 items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <MagicClickSigninForm />
      </div>
    </div>
  );
}
