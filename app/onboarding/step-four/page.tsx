"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useActionState, useEffect } from "react";
import { submitStepFour } from "@/app/action/step-action";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Logo from "@/components/Logo";

// Define the form schema for client-side validation
const stepFourSchema = z.object({
  additionalNotes: z.string().optional(),
  projectRequirements: z.string().optional(),
});

type FormData = z.infer<typeof stepFourSchema>;

export default function StepFourPage() {
  const [state, formAction, isPending] = useActionState(submitStepFour, {
    success: false,
    message: "",
    error: "",
  });

  useEffect(() => {
    if (state?.success) {
      window.location.href = "/onboarding/summary";
    }
  }, [state]);

  const form = useForm<FormData>({
    resolver: zodResolver(stepFourSchema),
    defaultValues: {
      additionalNotes: "",
      projectRequirements: "",
    },
  });

  // Load saved data on mount
  useEffect(() => {
    const savedData = localStorage.getItem("step-four-data");
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        form.reset(data);
      } catch (e) {
        console.log("Error loading step-four data:", e);
      }
    }
  }, [form]);

  // Save data on form change
  useEffect(() => {
    const subscription = form.watch((data) => {
      localStorage.setItem("step-four-data", JSON.stringify(data));
    });
    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <div className="bg-white dark:bg-zinc-950 flex min-h-screen">
      <div className="flex-1 h-screen flex items-center">
        <div className="flex flex-col mx-auto max-w-[360px] p-5 gap-12">
          {/* Logo and Header */}
          <div className=" flex-col gap-4 items-start justify-center flex">
            <Logo width={40} height={50} />
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-medium leading-8 text-black dark:text-white">
                Additional Information
              </h1>
              <p className="text-sm text-muted-foreground">
                Provide any additional details to help us understand your
                vision.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="flex flex-col gap-4">
            <Form {...form}>
              <form
                action={formAction}
                className="flex flex-col gap-4"
                onSubmit={(e) => {
                  console.log("Step-four form submitted!");
                  const formData = new FormData(e.currentTarget);
                  const allData = form.getValues();
                  Object.entries(allData).forEach(([key, value]) => {
                    if (Array.isArray(value)) {
                      formData.set(key, JSON.stringify(value));
                    } else if (typeof value === "object" && value !== null) {
                      formData.set(key, JSON.stringify(value));
                    } else {
                      formData.set(key, value as string);
                    }
                  });
                  console.log(
                    "Step-four form data prepared:",
                    Object.fromEntries(formData)
                  );
                }}
              >
                <FormField
                  control={form.control}
                  name="additionalNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg text-black dark:text-white">
                        Additional Notes and Example Sites
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Share example sites you like or any additional notes, special requests, color preferences, etc."
                          className="border-[#313131] text-black dark:text-white placeholder:text-[#999999] dark:placeholder:text-[#999999] min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <p className="text-sm text-muted-foreground">
                        Provide any additional details or example site links.
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="projectRequirements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg text-white">
                        Project Requirements
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your project requirements or any special considerations."
                          className="border-[#313131] text-black dark:text-white placeholder:text-[#999999] dark:placeholder:text-[#999999] min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <p className="text-sm text-muted-foreground">
                        Share specific requirements or details about your
                        project.
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={isPending}
                  className={cn(
                    "text-sm gap-0.5 inline-flex items-center justify-center rounded-[10px] disabled:pointer-events-none select-none border px-2 min-w-[36px] h-9 bg-black  hover:bg-black dark:hover:bg-white border-transparent text-white dark:text-white",
                    isPending && "text-white dark:text-white/20"
                  )}
                >
                  <div className="px-1">
                    {isPending ? "Submitting..." : "Continue"}
                  </div>
                </Button>
              </form>
            </Form>
            {/* Terms and Privacy Links */}
            <div className="text-sm text-black/50 dark:text-white/50 decoration-white/30 underline-offset-[3px]">
              By continuing, you agree to the{" "}
              <Link
                href="https://moydus.com/legal/terms-of-service"
                className="underline hover:text-black/70 dark:hover:text-white/70 "
                target="_blank"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="https://moydus.com/legal/privacy-policy"
                className="underline hover:text-black/70 dark:hover:text-white/70 "
                target="_blank"
              >
                Privacy Policy
              </Link>
              .
            </div>
          </div>

          {/* Contact Support */}
          <div className="flex gap-1">
            <p className="text-sm text-black/50 dark:text-white/50">
              Need help?
            </p>
            <Link
              target="_self"
              className="flex"
              tabIndex={-1}
              href="mailto:support@moydus.com"
            >
              <button className="inline-flex items-center justify-center outline-none disabled:pointer-events-none gap-1 font-medium disabled:text-zinc-950/10 dark:disabled:text-white/20 text-[#FF4D00] hover:text-[#FF4D00] dark:hover:text-[#FF4D00] text-xs">
                <p>Contact support</p>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
