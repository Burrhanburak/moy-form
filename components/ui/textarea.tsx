import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "bg-white dark:bg-[#1c1c1c] border border-[#313131] dark:border-[#414141] transition-all duration-200",
        "focus-within:bg-gray-500/5 focus-within:border-gray-500/10 placeholder:text-[#999999] rounded-[10px]",
        "md:text-sm px-4 py-2",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
