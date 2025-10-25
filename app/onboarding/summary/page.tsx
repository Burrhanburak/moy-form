"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useActionState } from "react";
import { summaryStep } from "@/app/action/step-action";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Logo from "@/components/Logo";
import { packageQuestions } from "@/utils/formSchema";
import { PACKAGES } from "@/utils/packages";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";

// Schema tanımı (değişmedi)
const summarySchema = z.object({
  selectedPackage: z.enum(["Starter", "Business", "Ecommerce"]),
  companyName: z
    .string()
    .min(2, { message: "Company name must be at least 2 characters" }),
  phone: z.string().optional(),
  businessField: z
    .array(z.string())
    .min(1, { message: "At least one business field is required" }),
  packageAnswers: z
    .record(z.string(), z.union([z.string(), z.array(z.string())]))
    .optional(),
  additionalNotes: z.string().optional(),
  projectRequirements: z.string().optional(),
  selectedAddons: z.array(z.string()).optional(),
  maintenanceRequired: z.boolean(),
});

type FormData = z.infer<typeof summarySchema>;

export default function SummaryPage() {
  const [state, formAction, isPending] = useActionState(summaryStep, {
    success: false,
    message: "",
    error: "",
  });

  const [defaultValues, setDefaultValues] = useState<FormData>({
    selectedPackage: "Starter",
    companyName: "",
    phone: "",
    businessField: [],
    packageAnswers: {},
    additionalNotes: "",
    projectRequirements: "",
    selectedAddons: [],
    maintenanceRequired: true,
  });

  // Check if this is a new project from dashboard
  const [isNewProject, setIsNewProject] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setIsNewProject(urlParams.get("new") === "true");
  }, []);

  useEffect(() => {
    const stepOneData = JSON.parse(
      localStorage.getItem("step-one-data") || "{}"
    );
    const stepTwoData = JSON.parse(
      localStorage.getItem("step-two-data") || "{}"
    );
    const stepThreeData = JSON.parse(
      localStorage.getItem("step-three-data") || "{}"
    );
    const stepFourData = JSON.parse(
      localStorage.getItem("step-four-data") || "{}"
    );
    const oldData = JSON.parse(localStorage.getItem("moy-form-data") || "{}");

    const newValues = {
      selectedPackage: oldData.selectedPackage || "Starter",
      companyName: stepOneData.companyName || oldData.companyName || "",
      phone: stepOneData.phone || oldData.phone || "",
      businessField: stepTwoData.businessField || oldData.businessField || [],
      packageAnswers:
        stepThreeData.packageAnswers || oldData.packageAnswers || {},
      additionalNotes:
        stepFourData.additionalNotes || oldData.additionalNotes || "",
      projectRequirements:
        stepFourData.projectRequirements || oldData.projectRequirements || "",
      selectedAddons:
        stepFourData.selectedAddons || oldData.selectedAddons || [],
      maintenanceRequired:
        stepFourData.maintenanceRequired ?? oldData.maintenanceRequired ?? true,
    };

    console.log("Loading data from localStorage:", newValues);
    setDefaultValues(newValues);
  }, []);

  const form = useForm<FormData>({
    resolver: zodResolver(summarySchema),
    defaultValues,
  });

  // Reset form when defaultValues change
  useEffect(() => {
    if (defaultValues.companyName || defaultValues.businessField.length > 0) {
      console.log("Resetting form with:", defaultValues);
      form.reset(defaultValues);
    }
  }, [defaultValues, form]);

  const { watch } = form;
  const watchedValues = watch();
  const packageInfo = PACKAGES[watchedValues.selectedPackage];
  const currentPackageQuestions =
    packageQuestions[
      watchedValues.selectedPackage as keyof typeof packageQuestions
    ];

  const [total, setTotal] = useState(0);
  const [addonTotal, setAddonTotal] = useState(0);

  // Helper function to extract addon price
  const extractAddonPrice = (addon: string): number => {
    const match = addon.match(/\+(\$?\d+)/);
    return match ? parseFloat(match[1].replace("$", "")) : 0;
  };

  // Helper function to extract addon display name
  const extractAddonDisplayName = (addon: string): string => {
    return addon.split("|")[1] || addon;
  };

  useEffect(() => {
    const price = parseFloat(
      (packageInfo.price ?? 0).toString().replace(/[^0-9.-]+/g, "")
    );
    const maintenance = watchedValues.maintenanceRequired
      ? parseFloat(
          (packageInfo.maintenancePrice ?? 49)
            .toString()
            .replace(/[^0-9.-]+/g, "")
        )
      : 0;

    // Calculate addon prices
    const addonPrices = (watchedValues.selectedAddons || []).map((addonId) => {
      const addon = packageInfo.optionalAddons?.find((opt) =>
        opt.startsWith(addonId + "|")
      );
      return addon ? extractAddonPrice(addon) : 0;
    });
    const addonTotal = addonPrices.reduce((sum, price) => sum + price, 0);

    setAddonTotal(addonTotal);
    setTotal(price + maintenance + addonTotal);
  }, [
    packageInfo,
    watchedValues.maintenanceRequired,
    watchedValues.selectedAddons,
  ]);

  // Handle action success
  useEffect(() => {
    if (state.success && state.url) {
      console.log("Action successful, redirecting to:", state.url);
      // Clear localStorage
      localStorage.removeItem("step-one-data");
      localStorage.removeItem("step-two-data");
      localStorage.removeItem("step-three-data");
      localStorage.removeItem("step-four-data");
      localStorage.removeItem("step-one-completed");
      localStorage.removeItem("step-two-completed");
      localStorage.removeItem("step-three-completed");
      localStorage.removeItem("moy-form-data");
      localStorage.removeItem("moy-form-current-step");

      // Redirect to checkout
      window.location.href = state.url;
    } else if (state.error) {
      console.log("Action error:", state.error);
      toast("Error", {
        description: state.error,
      });
    }
  }, [state]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  if (state.error) {
    return (
      <div className="bg-white dark:bg-zinc-950 flex min-h-screen items-center justify-center p-6">
        <div className="flex flex-col items-center mx-auto max-w-[360px] p-6 gap-6 text-center">
          <Logo width={40} height={50} />
          <h1 className="text-2xl font-medium text-black dark:text-white">
            Error
          </h1>
          <p className="text-sm text-black/70 dark:text-white/70">
            {state.error}{" "}
            <a
              href="mailto:info@moydus.com"
              className="underline hover:text-black/70 dark:hover:text-white/70 "
            >
              info@moydus.com
            </a>
          </p>
          <Button
            asChild
            className="mt-4 text-sm inline-flex items-center justify-center rounded-[10px] border border-black/20 px-4 py-2 bg-white dark:bg-zinc-950 hover:bg-white/10 text-black dark:text-white"
          >
            <Link href="/onboarding/summary">Try Again</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-950 flex flex-col min-h-screen">
      {" "}
      {/* 💄 tam yükseklik + sütun */}
      <div className="flex-1 flex items-center justify-center p-4">
        {" "}
        {/* 💄 ortalama */}
        <div className="flex flex-col mx-auto w-full max-w-md p-6 gap-8  rounded-2xl  ">
          {" "}
          {/* 💄 kutu görünümü */}
          {/* Header */}
          <div className="flex flex-col items-center gap-3 text-center">
            <Logo width={40} height={50} />
            <div>
              <h1 className="text-2xl font-semibold text-black dark:text-white">
                {isNewProject
                  ? "Yeni Proje Bilgileri"
                  : "Review Your Information"}
              </h1>
              <p className="text-sm text-black/60 dark:text-white/60">
                {isNewProject
                  ? "Yeni proje detaylarınızı kontrol edin ve ödeme yapın."
                  : "Please review your details before proceeding to payment."}
              </p>
            </div>
          </div>
          {/* Form */}
          <Form {...form}>
            <form action={formAction} className="flex flex-col gap-4">
              <div className="p-4 rounded-xl  border border-[#d1d1d1] dark:border-[#313131] bg-white dark:bg-zinc-950">
                <h4 className="font-semibold mb-3 text-lg text-black dark:text-white flex items-center gap-2">
                  📋 Order Summary
                </h4>

                <div className="space-y-3 text-black dark:text-white text-sm">
                  <div className="flex justify-between">
                    <span>Package:</span>
                    <span className="font-semibold">
                      {watchedValues.selectedPackage} - {packageInfo.name}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Base Price:</span>
                    <span className="font-semibold">${packageInfo.price}</span>
                  </div>

                  {/* 💡 Maintenance alanı */}
                  {watchedValues.maintenanceRequired && (
                    <div className="flex justify-between">
                      <span>Maintenance (monthly):</span>
                      <span className="font-semibold text-green-400">
                        {packageInfo.maintenancePrice ?? 49}
                      </span>
                    </div>
                  )}

                  {/* 💡 Add-ons alanı */}
                  {watchedValues.selectedAddons &&
                    watchedValues.selectedAddons.length > 0 && (
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>Add-ons:</span>
                          <span className="font-semibold text-blue-400">
                            +${addonTotal}
                          </span>
                        </div>
                        {watchedValues.selectedAddons.map((addonId, index) => {
                          const addon = packageInfo.optionalAddons?.find(
                            (opt) => opt.startsWith(addonId + "|")
                          );
                          const addonPrice = addon
                            ? extractAddonPrice(addon)
                            : 0;
                          const addonName = addon
                            ? extractAddonDisplayName(addon)
                            : addonId;
                          return (
                            <div
                              key={index}
                              className="flex justify-between text-xs text-gray-500 dark:text-gray-400 ml-4"
                            >
                              <span>• {addonName}</span>
                              <span>+${addonPrice}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                  {/* <div className="flex justify-between border-t border-[#2a2a2a] pt-2 mt-2">
                    <span>Total:</span>
                    <span className="font-bold text-xl text-white">
                      $
                      {packageInfo.price +
                        (watchedValues.maintenanceRequired
                          ? (packageInfo.maintenancePrice ?? 49)
                          : 0)}
                    </span>
                  </div> */}
                  {isClient && (
                    <div className="flex justify-between border-t border-[#2a2a2a] pt-2 mt-2">
                      <span>Total:</span>
                      <span className="font-bold text-xl text-black dark:text-white">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-between gap-3 mt-4">
                <Button
                  type="button"
                  onClick={() =>
                    (window.location.href = "/onboarding/step-four")
                  }
                  className="w-full border border-black/20 text-black dark:text-white bg-transparent hover:bg-white/10 rounded-[10px]"
                >
                  ← Back
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  onClick={() => {
                    toast("Processing your order...");
                  }}
                  className={cn(
                    "w-full bg-green-600 hover:bg-green-700 text-white rounded-[10px] border border-green-500",
                    isPending && "opacity-70 cursor-not-allowed"
                  )}
                >
                  {isPending ? "Processing..." : "Proceed to Payment"}
                </Button>
              </div>

              {/* Hidden inputs for form data */}
              <input
                type="hidden"
                name="selectedPackage"
                value={watchedValues.selectedPackage || "Starter"}
              />
              <input
                type="hidden"
                name="companyName"
                value={watchedValues.companyName || ""}
              />
              <input
                type="hidden"
                name="phone"
                value={watchedValues.phone || ""}
              />
              <input
                type="hidden"
                name="businessField"
                value={JSON.stringify(watchedValues.businessField || [])}
              />
              <input
                type="hidden"
                name="packageAnswers"
                value={JSON.stringify(watchedValues.packageAnswers || {})}
              />
              <input
                type="hidden"
                name="additionalNotes"
                value={watchedValues.additionalNotes || ""}
              />
              <input
                type="hidden"
                name="projectRequirements"
                value={watchedValues.projectRequirements || ""}
              />
              <input
                type="hidden"
                name="selectedAddons"
                value={JSON.stringify(watchedValues.selectedAddons || [])}
              />
              <input
                type="hidden"
                name="maintenanceRequired"
                value={watchedValues.maintenanceRequired ? "true" : "false"}
              />
              <input
                type="hidden"
                name="name"
                value={watchedValues.companyName || "Company"}
              />
              <input
                type="hidden"
                name="email"
                value={watchedValues.email || ""}
              />
            </form>
          </Form>
          {/* Terms */}
          <div className="text-center text-sm text-black/50 dark:text-white/50">
            By continuing, you agree to our{" "}
            <Link
              href="https://moydus.com/terms-of-service"
              target="_blank"
              className="underline hover:text-black/70 dark:hover:text-white/70 "
            >
              Terms
            </Link>{" "}
            and{" "}
            <Link
              href="https://moydus.com/privacy-policy"
              target="_blank"
              className="underline hover:text-black/70 dark:hover:text-white/70 "
            >
              Privacy Policy
            </Link>
            .
          </div>
          {/* Support */}
          <div className="flex justify-center text-sm text-black/60 dark:text-white/60">
            Need help?{" "}
            <Link
              href="mailto:info@moydus.com"
              className="ml-1 text-[#FF4D00] hover:text-[#FF4D00]"
            >
              Contact support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
