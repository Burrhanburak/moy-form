"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { submitStepTwo } from "@/app/action/step-action";
import {
  MultiSelector,
  MultiSelectorTrigger,
  MultiSelectorInput,
  MultiSelectorContent,
  MultiSelectorList,
  MultiSelectorItem,
} from "@/components/ui/multi-select";
import { businessFieldOptions } from "@/utils/formSchema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Logo from "@/components/Logo";

// Define the form schema for client-side validation
const stepTwoSchema = z.object({
  businessField: z
    .array(z.string())
    .min(1, { message: "Business field is required" }),
});

type FormData = z.infer<typeof stepTwoSchema>;

export default function StepTwoPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(submitStepTwo, {
    success: false,
    message: "",
    error: "",
  });

  // Check if user has completed step-one
  useEffect(() => {
    const stepOneCompleted = localStorage.getItem("step-one-completed");
    if (!stepOneCompleted) {
      router.push("/onboarding/step-one");
    }
  }, [router]);

  // Handle step-two success
  useEffect(() => {
    console.log("Step-two state:", state);
    if (state?.success) {
      localStorage.setItem("step-two-completed", "true");
      window.location.href = "/onboarding/step-three";
    }
  }, [state]);

  const form = useForm<FormData>({
    resolver: zodResolver(stepTwoSchema),
    defaultValues: {
      businessField: [],
    },
  });

  // Load saved data on mount
  useEffect(() => {
    const savedData = localStorage.getItem("step-two-data");
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        form.reset(data);
      } catch (e) {
        console.log("Error loading step-two data:", e);
      }
    }
  }, [form]);

  // Save data on form change
  useEffect(() => {
    const subscription = form.watch((data) => {
      localStorage.setItem("step-two-data", JSON.stringify(data));
    });
    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <div className="bg-white dark:bg-zinc-950 flex min-h-screen">
      <div className="flex-1 h-screen flex items-center">
        <div className="flex flex-col mx-auto p-5 gap-12 max-w-[360px]">
          {/* Logo and Header */}
          <div className=" flex-col gap-4 items-start justify-center flex">
            {" "}
            <Logo width={40} height={50} />
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-medium leading-8 text-black dark:text-white">
                Complete your website setup
              </h1>
            </div>
          </div>

          {/* Form */}
          <div className="flex flex-col gap-4">
            <Form {...form}>
              <form action={formAction} className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="businessField"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg text-black dark:text-white">
                        Business Fields
                      </FormLabel>
                      <FormControl>
                        <MultiSelector
                          values={field.value || []}
                          onValuesChange={field.onChange}
                          loop
                          className="w-full bg-white dark:bg-zinc-950"
                        >
                          <MultiSelectorTrigger>
                            <MultiSelectorInput placeholder="Select your business fields" />
                          </MultiSelectorTrigger>
                          <MultiSelectorContent>
                            <MultiSelectorList>
                              {businessFieldOptions.map((option) => (
                                <MultiSelectorItem key={option} value={option}>
                                  {option}
                                </MultiSelectorItem>
                              ))}
                            </MultiSelectorList>
                          </MultiSelectorContent>
                        </MultiSelector>
                      </FormControl>
                      <p className="text-sm text-muted-foreground">
                        You can select multiple business fields (e.g: Health +
                        E-commerce)
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Hidden input for businessField */}
                <input
                  type="hidden"
                  name="businessField"
                  value={JSON.stringify(form.watch("businessField") || [])}
                />

                <Button
                  type="submit"
                  disabled={isPending || !form.formState.isValid}
                  onClick={() => {
                    console.log("Button clicked!");
                    const businessField = form.getValues("businessField");
                    console.log(
                      "Business field on button click:",
                      businessField
                    );

                    if (!businessField || businessField.length === 0) {
                      console.log("No business field selected!");
                      toast("Please select at least one business field", {
                        description:
                          "You need to select at least one business field to continue.",
                      });
                      return;
                    }

                    console.log("Submitting form...");
                  }}
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
