import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap  text-sm font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 outline-none",
  {
    variants: {
      variant: {
        default:
          "dark:bg-black dark:bg-gradient-to-b dark:from-white/10 dark:to-white/5 border border-black border-solid shadow-[inset_0_1px_2px_0_rgba(255,255,255,0.25)] text-white dark:text-white " +
          "hover:bg-gradient-to-b hover:from-white/15 hover:to-white/10 " +
          "focus:bg-gradient-to-b focus:from-white/15 focus:to-white/10",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-[100%] w-[100%] px-4 py-3",
        sm: "h-8 px-3 py-2",
        lg: "h-10 px-6 py-3",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {props.children}
    </Comp>
  );
}

export { Button, buttonVariants };
