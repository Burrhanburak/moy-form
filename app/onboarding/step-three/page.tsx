"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { submitStepThree } from "@/app/action/step-action";
import {
  MultiSelector,
  MultiSelectorTrigger,
  MultiSelectorInput,
  MultiSelectorContent,
  MultiSelectorList,
  MultiSelectorItem,
} from "@/components/ui/multi-select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Logo from "@/components/Logo";
import { packageQuestions } from "@/utils/formSchema";

// Define the form schema for client-side validation
const stepThreeSchema = z.object({
  packageAnswers: z
    .record(z.string(), z.union([z.string(), z.array(z.string())]))
    .optional(),
});

type FormData = z.infer<typeof stepThreeSchema>;

export default function StepThreePage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(submitStepThree, {
    success: false,
    message: "",
    error: "",
  });

  // Check if user has completed step-two
  useEffect(() => {
    const stepTwoCompleted = localStorage.getItem("step-two-completed");
    if (!stepTwoCompleted) {
      router.push("/onboarding/step-two");
    }
  }, [router]);

  useEffect(() => {
    if (state?.success) {
      localStorage.setItem("step-three-completed", "true");
      window.location.href = "/onboarding/step-four";
    }
  }, [state]);

  // Get selected package from localStorage or context
  const selectedPackage =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("moy-form-data") || "{}")
          .selectedPackage || "Starter"
      : "Starter";

  const currentPackageQuestions =
    packageQuestions[selectedPackage as keyof typeof packageQuestions];

  const form = useForm<FormData>({
    resolver: zodResolver(stepThreeSchema),
    defaultValues: {
      packageAnswers: {},
    },
  });

  // Load saved data on mount
  useEffect(() => {
    const savedData = localStorage.getItem("step-three-data");
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        form.reset(data);
      } catch (e) {
        console.log("Error loading step-three data:", e);
      }
    }
  }, [form]);

  // Save data on form change
  useEffect(() => {
    const subscription = form.watch((data) => {
      localStorage.setItem("step-three-data", JSON.stringify(data));
    });
    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <div className="bg-white dark:bg-zinc-950 flex min-h-screen">
      <div className="flex-1 h-screen flex items-center">
        <div className="flex flex-col mx-auto max-w-[360px]  gap-6">
          {/* Logo and Header */}
          <div className=" flex-col gap-4 items-start justify-center flex">
            <Logo width={40} height={50} />
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-medium leading-8 text-black dark:text-white">
                Customize Your Website
              </h1>
              <p className="text-sm text-muted-foreground">
                Answer the following questions to tailor your {selectedPackage}{" "}
                package.
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
                  const formData = new FormData(e.currentTarget);
                  const packageAnswers = form.getValues("packageAnswers");
                  Object.entries(packageAnswers || {}).forEach(
                    ([key, value]) => {
                      if (Array.isArray(value)) {
                        formData.set(key, JSON.stringify(value));
                      } else {
                        formData.set(key, value as string);
                      }
                    }
                  );
                }}
              >
                {currentPackageQuestions.questions.map((question) => (
                  <FormField
                    key={question.id}
                    control={form.control}
                    name="packageAnswers"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-lg text-dark:text-white">
                          {question.label}
                        </FormLabel>
                        <FormControl>
                          {question.type === "radio" ? (
                            <RadioGroup
                              onValueChange={(value) => {
                                const current = field.value || {};
                                field.onChange({
                                  ...current,
                                  [question.id]: value,
                                });
                              }}
                              value={
                                (field.value?.[question.id] as string) || ""
                              }
                              className="flex flex-col space-y-2"
                            >
                              {question.options.map((option, optIdx) => (
                                <div
                                  key={optIdx}
                                  className="flex items-center space-x-3 space-y-0"
                                >
                                  <RadioGroupItem
                                    className="bg-dark:text-white dark:bg-black text-black"
                                    value={option}
                                  />
                                  <Label className="font-normal cursor-pointer text-sm text-black dark:text-white">
                                    {option}
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          ) : (
                            <MultiSelector
                              values={
                                Array.isArray(field.value?.[question.id])
                                  ? (field.value[question.id] as string[])
                                  : []
                              }
                              onValuesChange={(values) => {
                                const current = field.value || {};
                                field.onChange({
                                  ...current,
                                  [question.id]: values,
                                });
                              }}
                              loop
                              className="w-full"
                            >
                              <MultiSelectorTrigger>
                                <MultiSelectorInput placeholder="Select options" />
                              </MultiSelectorTrigger>
                              <MultiSelectorContent>
                                <MultiSelectorList>
                                  {question.options.map((option, optIdx) => (
                                    <MultiSelectorItem
                                      key={optIdx}
                                      value={option}
                                    >
                                      {option}
                                    </MultiSelectorItem>
                                  ))}
                                </MultiSelectorList>
                              </MultiSelectorContent>
                            </MultiSelector>
                          )}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                <Button
                  type="submit"
                  disabled={isPending}
                  className={cn(
                    "text-sm gap-0.5 inline-flex items-center justify-center bg-black dark:bg-white rounded-[10px] disabled:pointer-events-none select-none border px-2 min-w-[36px] h-9 border-transparent text-white dark:text-white dark:bg-[#171717]/5 dark:hover:bg-white/5 hover:opacity-80 dark:hover:opacity-80",
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
            <div className="text-sm dark:text-white/50 text-black/50 decoration-white/30 underline-offset-[3px]">
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
            <p className="text-sm dark:text-white/50 text-black/50">
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
