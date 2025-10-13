"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useActionState, useEffect, useState } from "react";
import { Building, Phone } from "lucide-react";
import { submitStepOne } from "@/app/action/step-action";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { CostumInput } from "@/components/ui/custom-input";
import { PhoneInput } from "@/components/ui/phone-input"; // Varsayıyorum ki bu bileşen mevcut
import { cn } from "@/lib/utils";
import Link from "next/link";
import Logo from "@/components/Logo";

// Define the form schema for client-side validation
const stepOneSchema = z.object({
  companyName: z
    .string()
    .min(2, { message: "Company name must be at least 2 characters" }),
  phone: z
    .string()
    .optional() // Telefon numarası isteğe bağlı
    .refine((val) => !val || /^\+?[1-9]\d{1,14}$/.test(val), {
      message: "Invalid phone number format",
    }),
});

type FormData = z.infer<typeof stepOneSchema>;

export default function StepOnePage() {
  const [isNewProject, setIsNewProject] = useState(false);

  const [state, formAction, isPending] = useActionState(submitStepOne, {
    success: false,
    message: "",
    error: "",
  });

  // Check if this is a new project from dashboard
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setIsNewProject(urlParams.get("new") === "true");
  }, []);

  useEffect(() => {
    if (state?.success) {
      localStorage.setItem("step-one-completed", "true");

      window.location.href = "/onboarding/step-two";
    }
  }, [state]);

  const form = useForm<FormData>({
    resolver: zodResolver(stepOneSchema),
    defaultValues: {
      companyName: "",
      phone: "",
    },
  });

  // Load saved data on mount
  useEffect(() => {
    const savedData = localStorage.getItem("step-one-data");
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        form.reset(data);
      } catch (e) {
        console.log("Error loading step-one data:", e);
      }
    }
  }, [form]);

  // Save data on form change
  useEffect(() => {
    const subscription = form.watch((data) => {
      localStorage.setItem("step-one-data", JSON.stringify(data));
    });
    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <div className="bg-white dark:bg-zinc-950 flex min-h-screen">
      <div className="flex-1 h-screen flex items-center">
        <div className="flex flex-col mx-auto max-w-[360px] p-5 gap-12">
          {/* Logo and Header */}
          <div className=" flex-col gap-4 items-start justify-center flex">
            <Logo
              width={40}
              height={50}
              className="items-center justify-center"
            />
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-medium leading-8 text-black dark:text-white">
                {isNewProject
                  ? "Yeni Proje Oluşturun"
                  : "Get Started with add on your website"}
              </h1>
              {isNewProject && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Mevcut müşterimiz olarak yeni bir proje başlatıyorsunuz
                </p>
              )}
            </div>
          </div>

          {/* Form */}
          <div className="flex flex-col gap-4">
            <Form {...form}>
              <form action={formAction} className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-2">
                      <FormLabel className="block text-sm font-medium leading-5 tracking-tight text-black dark:text-white">
                        Company name
                      </FormLabel>
                      <FormControl>
                        <div className="relative bg-white dark:bg-zinc-950 rounded-[10px] dark:bg-zinc-950 hover:bg-zinc-950/5 dark:hover:bg-white/5">
                          <CostumInput
                            className="w-full"
                            placeholder="ABC Company"
                            autoComplete="off" // veya "off" da olur ama bu daha etkili
                            autoCorrect="off"
                            spellCheck="false"
                            icon={
                              <Building
                                className="border-none ring-0"
                                size={20}
                              />
                            }
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-sm font-medium text-destructive" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-2">
                      <FormLabel className="block text-sm font-medium leading-5 tracking-tight text-white">
                        Phone Number (Optional)
                      </FormLabel>
                      <FormControl>
                        <div className="relative bg-zinc-950 rounded-[10px] dark:bg-zinc-950 hover:bg-zinc-950/5 dark:hover:bg-white/5">
                          <PhoneInput
                            className="w-full"
                            placeholder="+1 (123) 456-7890"
                            autoComplete="off" // veya "off" da olur ama bu daha etkili
                            autoCorrect="off"
                            spellCheck="false"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-sm font-medium text-destructive" />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={isPending || !form.formState.isValid}
                  className={cn(
                    "w-full bg-black text-white dark:text-white rounded-[10px]",
                    (isPending || !form.formState.isValid) &&
                      "text-white dark:text-white/20"
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
              By signing up, you agree to the{" "}
              <Link
                href="https://mintlify.com/legal/terms"
                className="underline hover:text-black/70 dark:hover:text-white/70 "
                target="_blank"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="https://mintlify.com/legal/privacy"
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
              href="mailto:support@mintlify.com"
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
