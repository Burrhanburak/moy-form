"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { CustDropzone } from "@/components/cust-dropzone";
// import { zodResolver } from "@hookform/resolvers/zod"; // Disabled - using manual validation
import {
  // formSchema, // Disabled - using manual validation only
  type FormData as FormDataType,
  businessFieldOptions,
  packageQuestions,
  socialMediaOptions,
  addonOptions,
} from "@/utils/formSchema";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/components/ui/multi-select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PACKAGES } from "@/utils/packages";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import {
  Mail,
  User,
  Building,
  Phone,
  Info,
  Globe,
  UndoDot,
  LockKeyhole,
} from "lucide-react";
import { CostumInput } from "../ui/custom-input";
import UploaderButton from "@/components/uploader-button";

interface MoyFormProps {
  selectedPackage: "Starter" | "Business" | "Ecommerce";
  selectedAddons?: string[];
  onBack?: () => void;
}

export default function MoyFormEnglish({
  selectedPackage,
  selectedAddons = [],
  onBack,
}: MoyFormProps) {
  const [currentStep, setCurrentStep] = useState(() => {
    // Page yenilendiğinde step'i localStorage'dan yükle
    if (typeof window !== "undefined") {
      const savedStep = localStorage.getItem("moy-form-current-step");
      return savedStep ? parseInt(savedStep) : 1;
    }
    return 1;
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // LocalStorage'dan form verilerini yükle
  const loadFromStorage = () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("moy-form-data");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Ensure all required fields exist with proper defaults
          return {
            ...parsed,
            selectedPackage,
            selectedAddons: parsed.selectedAddons || selectedAddons,
            maintenanceRequired:
              parsed.maintenanceRequired !== undefined
                ? parsed.maintenanceRequired
                : true,
            packageAnswers: parsed.packageAnswers || {},
            // Remove additionalServices if it exists in old data
            additionalServices: undefined,
          };
        } catch (error) {
          console.error("Form verileri yüklenirken hata:", error);
        }
      }
    }
    return {
      selectedPackage,
      name: "",
      email: "",
      phone: "",
      logo: "",
      brandColors: "",
      contentInfo: "",
      companyName: "",
      businessField: [],
      hasDomain: "no",
      domainName: "",
      packageAnswers: {},
      hasSocialMedia: "no",
      socialMediaAccounts: [],
      selectedAddons: selectedAddons,
      maintenanceRequired: true, // Now required for all packages
      projectDescription: "",
      specialRequirements: "",
      exampleSites: "",
      additionalNotes: "",
    };
  };

  const defaultValues = loadFromStorage();

  // Debug: Console'a default values'ları yazdır
  console.log("Default values:", defaultValues);
  console.log("PackageAnswers in defaultValues:", defaultValues.packageAnswers);

  // Eğer localStorage'da bozuk veri varsa temizle
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("moy-form-data");
        if (saved) {
          const parsed = JSON.parse(saved);
          // Required fields'ları kontrol et
          if (!parsed.selectedPackage || !parsed.packageAnswers) {
            console.log("Invalid localStorage data, clearing...");
            localStorage.removeItem("moy-form-data");
            localStorage.removeItem("moy-form-current-step");
          }
        }
      } catch (error) {
        console.log("localStorage error, clearing...", error);
        localStorage.removeItem("moy-form-data");
        localStorage.removeItem("moy-form-current-step");
      }
    }
  }, []);

  const form = useForm<FormDataType>({
    // resolver: zodResolver(formSchema), // Temporarily disabled to avoid _zod errors
    defaultValues: {
      ...defaultValues,
      packageAnswers: defaultValues.packageAnswers || {},
    },
  });

  const watchedValues = form.watch();

  // Form submission handler - only submit on final step
  const onSubmit = async (data: FormDataType) => {
    console.log("🚨 onSubmit called! Current step:", currentStep);

    // Only submit if we're on the final step
    if (currentStep !== 7) {
      console.log(
        "❌ Form submitted but not on final step, BLOCKING submission"
      );
      return;
    }

    console.log("✅ Final step, proceeding with form submission:", data);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers.get("content-type"));

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log("API Success Response:", result);

      if (result.url) {
        // Form başarıyla gönderildi, localStorage'ı temizle
        localStorage.removeItem("moy-form-data");
        localStorage.removeItem("moy-form-current-step");
        window.location.href = result.url;
      } else {
        console.error("No checkout URL received");
        throw new Error("No checkout URL in response");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert(
        "An error occurred during checkout. Please check the console for details."
      );
      setIsSubmitting(false);
    }
  };

  // Form verilerini localStorage'a kaydet
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const subscription = form.watch((data) => {
        localStorage.setItem("moy-form-data", JSON.stringify(data));
      });
      return () => subscription.unsubscribe();
    }
  }, [form]);

  // Current step'i localStorage'a kaydet
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("moy-form-current-step", currentStep.toString());
    }
  }, [currentStep]);

  const nextStep = async () => {
    try {
      let isValid = false;

      if (currentStep === 1) {
        // Step 1 validation (magic-link collects personal info)
        const values = form.getValues();
        const companyValid =
          values.companyName && values.companyName.trim().length >= 2;

        isValid = !!companyValid;

        if (!isValid) {
          console.log("Step 1 validation failed:", { companyValid });
        }
      } else if (currentStep === 2) {
        // Step 2 manual validation
        const values = form.getValues();
        const businessFieldValid =
          values.businessField && values.businessField.length > 0;
        const domainValid =
          values.hasDomain &&
          (values.hasDomain === "yes" || values.hasDomain === "no");
        const socialMediaValid =
          values.hasSocialMedia &&
          (values.hasSocialMedia === "yes" || values.hasSocialMedia === "no");

        isValid = businessFieldValid && domainValid && socialMediaValid;

        if (!isValid) {
          console.log("Step 2 validation failed:", {
            businessFieldValid,
            domainValid,
            socialMediaValid,
          });
        }
      } else if (currentStep === 3) {
        // Step 3 validation - Logo and brand information (optional, so always valid)
        isValid = true;
      } else if (currentStep === 4) {
        // Step 4 validation - Package specific questions
        try {
          // Ensure packageAnswers is initialized
          const currentAnswers = form.getValues("packageAnswers") || {};
          console.log("Package answers:", currentAnswers);

          // Check if at least some questions are answered
          isValid = Object.keys(currentAnswers).length > 0;

          if (!isValid) {
            console.log("No package questions answered");
          }
        } catch (error) {
          console.error("Error in step 4 validation:", error);
          // Fallback: check if at least some questions are answered
          const currentAnswers = form.getValues("packageAnswers") || {};
          isValid = Object.keys(currentAnswers).length > 0;
        }
      } else if (currentStep === 5) {
        // Step 5 validation - Example sites (optional, so always valid)
        isValid = true;
      } else if (currentStep === 6) {
        // Step 6 validation - Final summary (optional, so always valid)
        isValid = true;
      } else if (currentStep === 7) {
        // Step 7 validation - Final summary (optional, so always valid)
        isValid = true;
      } else {
        // For any other steps, just proceed
        isValid = true;
      }

      if (isValid) {
        setCurrentStep((prev) => Math.min(prev + 1, 7));
      } else {
        // Show validation feedback
        console.log("Validation failed for step", currentStep);
        if (currentStep === 4) {
          console.log("Please answer at least one package question");
          alert("Lütfen en az bir paket sorusunu yanıtlayın");
        }
      }
    } catch (error) {
      console.error("Form validation error:", error);
      // Don't proceed if there's an error
      console.log("Please fix validation errors before proceeding");
    }
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const packageInfo = PACKAGES[selectedPackage];
  const currentPackageQuestions = packageQuestions[selectedPackage];

  return (
    <div className="max-w-2xl mx-auto p-2  rounded-lg w-full">
      <div className="mb-8">
        {/* <div className="flex justify-between items-center mb-4">
          {[1, 2, 3, 4, 5].map((step) => (
            <div
              key={step}
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep >= step ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-600"
              }`}
            >
              {step}
            </div>
          ))}
        </div> */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white">
            Personal & Business Information
          </h1>
          <p className="text-muted-foreground text-sm text-balance">
            Please enter your information below to continue
          </p>
          {onBack && (
            <button
              onClick={onBack}
              className="mt-3 text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-1 mx-auto"
            >
              <UndoDot size={20} />
              Back to packages
            </button>
          )}

          {/* <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {packageInfo.name}
          </h2>
          <div className="text-3xl font-bold text-blue-600 mb-2">
            💰 {packageInfo.priceRange || `$${packageInfo.price}`} one-time
          </div>
          <p className="text-gray-600 mb-4">{packageInfo.description}</p> */}

          {/* Paket özellikleri */}
          {/* <div className="bg-gray-50 p-4 rounded-lg text-left">
            <h4 className="font-semibold mb-2 text-gray-800">Bu pakette neler var:</h4>
            <ul className="space-y-1 text-sm">
              {packageInfo.features.map((feature, idx) => (
                <li key={idx} className="text-gray-700">{feature}</li>
              ))}
            </ul>
            {packageInfo.maintenancePrice && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  👉 {packageInfo.maintenanceRequired ? 'Zorunlu' : 'Opsiyonel'} bakım: {packageInfo.maintenancePrice}
                </p>
              </div>
            )}
          </div> */}
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault(); // Always prevent default form submission
            console.log(
              "🚨 Form onSubmit event triggered! Current step:",
              currentStep
            );
            if (currentStep !== 5) {
              console.log("❌ Preventing form submission - not on final step");
              return;
            }
            console.log("✅ Allowing form submission - on final step");
            form.handleSubmit(onSubmit)(e);
          }}
          className="space-y-6"
        >
          {currentStep === 1 && (
            <div className="space-y-6 flex flex-col mx-auto max-w-[360px] p-5 gap-12 ">
              {/* <h3 className="text-xl font-semibold mb-4">🧑‍💼 Kişisel ve İşletme Bilgileri</h3> */}
              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="text-lg text-white">
                        Company Name
                      </FormLabel>
                      <FormControl>
                        <CostumInput
                          className="w-full"
                          placeholder="ABC Company"
                          icon={<Building size={20} />}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                🎨 Logo and Brand Information
              </h3>

              <FormField
                control={form.control}
                name="logo"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-lg text-white">
                      Logo Upload
                    </FormLabel>
                    <FormControl>
                      <UploaderButton
                        endpoint="imageUploader"
                        onClientUploadComplete={(files) => {
                          // Set the first uploaded file URL to the form field
                          if (files && files.length > 0) {
                            const fileUrl = files[0].ufsUrl || files[0].url;
                            field.onChange(fileUrl);
                          }
                        }}
                      />
                    </FormControl>
                    <p className="text-sm text-muted-foreground">
                      Upload your company logo (PNG, JPG formats supported)
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="brandColors"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg text-white">
                      Brand Colors
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please specify your brand colors (e.g., Primary: #FF5733, Secondary: #3498DB, Accent: #2ECC71)"
                        className="bg-[#1c1c1c] border-[#313131] text-white placeholder:text-[#999999] min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <p className="text-sm text-muted-foreground">
                      Share your brand color palette or preferred colors
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contentInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg text-white">
                      Content and Photos Information
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about your content needs (e.g., product photos, team photos, existing content, content creation requirements)"
                        className="bg-[#1c1c1c] border-[#313131] text-white placeholder:text-[#999999] min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <p className="text-sm text-muted-foreground">
                      Help us understand your content and photography needs
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="businessField"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg text-white">
                      Business Fields and Technical Information
                    </FormLabel>
                    <FormControl>
                      <MultiSelector
                        values={field.value || []}
                        onValuesChange={field.onChange}
                        loop
                        className="w-full"
                      >
                        <MultiSelectorTrigger>
                          <MultiSelectorInput placeholder="İş alanlarınızı seçin" />
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

              <FormField
                control={form.control}
                name="hasDomain"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-lg text-white">
                      Do you have a domain? *
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-col space-y-2"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem
                              className="bg-white text-black"
                              value="yes"
                            />
                          </FormControl>
                          <FormLabel className="font-bold cursor-pointer text-white">
                            Yes, I have a domain
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem
                              className="bg-white text-black"
                              value="no"
                            />
                          </FormControl>
                          <FormLabel className="font-bold cursor-pointer text-white">
                            No, I don&apos;t have a domain
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {watchedValues.hasDomain === "yes" && (
                <FormField
                  control={form.control}
                  name="domainName"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="text-lg text-white">
                        Domain Name
                      </FormLabel>
                      <div className="flex items-center">
                        <span className="bg-[#313131] text-white px-3 py-3 rounded-l-[10px] border border-r-0 border-[#313131] h-[50px] flex items-center text-[16px]">
                          https://
                        </span>
                        <FormControl>
                          <CostumInput
                            className="rounded-l-none border-l-0"
                            placeholder="example.com"
                            icon={<Globe size={20} />}
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="hasSocialMedia"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-lg text-white">
                      Do you have social media accounts? *
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-col space-y-2"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem
                              className="bg-white text-black"
                              value="yes"
                            />
                          </FormControl>
                          <FormLabel className="font-bold cursor-pointer text-white">
                            Yes, I have social media accounts
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem
                              className="bg-white text-black"
                              value="no"
                            />
                          </FormControl>
                          <FormLabel className="font-bold cursor-pointer text-white">
                            No, I don&apos;t have social media accounts
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {watchedValues.hasSocialMedia === "yes" && (
                <FormField
                  control={form.control}
                  name="socialMediaAccounts"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg text-white">
                        Social Media Accounts
                      </FormLabel>
                      <FormControl>
                        <MultiSelector
                          values={field.value || []}
                          onValuesChange={field.onChange}
                          loop
                          className="w-full"
                        >
                          <MultiSelectorTrigger>
                            <MultiSelectorInput placeholder="Select your social media accounts" />
                          </MultiSelectorTrigger>
                          <MultiSelectorContent>
                            <MultiSelectorList>
                              {socialMediaOptions.map((option) => (
                                <MultiSelectorItem key={option} value={option}>
                                  {option}
                                </MultiSelectorItem>
                              ))}
                            </MultiSelectorList>
                          </MultiSelectorContent>
                        </MultiSelector>
                      </FormControl>
                      <p className="text-sm text-muted-foreground">
                        Select all social media platforms you use
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              {/* Pakete göre dinamik sorular */}
              {currentPackageQuestions.questions.map((question, idx) => (
                <div key={question.id} className="space-y-3">
                  <FormLabel className="text-base font-medium text-white">
                    {question.label}
                  </FormLabel>

                  {question.type === "radio" && (
                    <RadioGroup
                      onValueChange={(value) => {
                        const current = watchedValues.packageAnswers || {};
                        form.setValue("packageAnswers", {
                          ...current,
                          [question.id]: value,
                        });
                      }}
                      value={
                        (watchedValues.packageAnswers?.[
                          question.id
                        ] as string) || ""
                      }
                      className="flex flex-col space-y-2 "
                    >
                      {question.options.map((option, optIdx) => (
                        <div
                          key={optIdx}
                          className="flex items-center space-x-3 space-y-0"
                        >
                          <RadioGroupItem
                            className="bg-white text-black"
                            value={option}
                          />
                          <Label className="font-normal cursor-pointer text-sm text-white">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}

                  {question.type === "checkbox" && (
                    <MultiSelector
                      values={
                        Array.isArray(
                          watchedValues.packageAnswers?.[question.id]
                        )
                          ? (watchedValues.packageAnswers[
                              question.id
                            ] as string[])
                          : []
                      }
                      onValuesChange={(values) => {
                        const current = watchedValues.packageAnswers || {};
                        form.setValue("packageAnswers", {
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
                            <MultiSelectorItem key={optIdx} value={option}>
                              {option}
                            </MultiSelectorItem>
                          ))}
                        </MultiSelectorList>
                      </MultiSelectorContent>
                    </MultiSelector>
                  )}
                </div>
              ))}
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                💡 Example Sites and Your Notes
              </h3>

              <FormField
                control={form.control}
                name="exampleSites"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg text-white">
                      Example Sites
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="You can share the links of the sites you like (e.g: https://example.com, https://another-site.com)"
                        className="bg-[#1c1c1c] border-[#313131] text-white placeholder:text-[#999999] min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="additionalNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg text-white">
                      Additional Notes and Requests
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="You can write your special requests, important points to consider, color preferences, etc. here..."
                        className="bg-[#1c1c1c] border-[#313131] text-white placeholder:text-[#999999] min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {currentStep === 6 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                📝 Additional Information
              </h3>

              <FormField
                control={form.control}
                name="projectDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg text-white">
                      Project Description (optional)
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        rows={4}
                        placeholder="You can provide more information about your project..."
                        className="resize-none bg-[#1c1c1c] border-[#313131] text-white placeholder:text-[#999999] min-h-[120px]"
                        value={field?.value || ""}
                        onChange={field?.onChange}
                        onBlur={field?.onBlur}
                        name={field?.name}
                        ref={field?.ref}
                      />
                    </FormControl>
                    <p className="text-sm text-muted-foreground">
                      You can provide more information about your project...
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="specialRequirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg text-white">
                      Special Requirements (optional)
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        rows={4}
                        placeholder="You can provide more information about your project..."
                        className="resize-none bg-[#1c1c1c] border-[#313131] text-white placeholder:text-[#999999] min-h-[120px]"
                        value={field?.value || ""}
                        onChange={field?.onChange}
                        onBlur={field?.onBlur}
                        name={field?.name}
                        ref={field?.ref}
                      />
                    </FormControl>
                    <p className="text-sm text-muted-foreground">
                      You can provide more information about your project...
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {currentStep === 7 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                ✨ Final Summary
              </h3>

              <div className="p-6 rounded-lg border border-[#313131]">
                <h4 className="font-semibold mb-4 text-lg text-white flex items-center">
                  📋 Order Summary
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-white">Package:</span>
                    <span className="font-semibold text-white">
                      {selectedPackage} - {packageInfo.name}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-white">
                      Package Price:
                    </span>
                    <span className="font-bold text-xl text-white">
                      ${packageInfo.price}
                    </span>
                  </div>

                  {watchedValues.selectedAddons &&
                    watchedValues.selectedAddons.length > 0 && (
                      <div className="space-y-1">
                        {watchedValues.selectedAddons.map((addonId, idx) => {
                          const addon = addonOptions.find(
                            (opt) => opt.id === addonId
                          );
                          return addon ? (
                            <div
                              key={idx}
                              className="flex justify-between items-center text-sm"
                            >
                              <span className="text-white">{addon.name}:</span>
                              <span className="text-white">{addon.price}</span>
                            </div>
                          ) : null;
                        })}
                        <div className="border-t pt-2 flex justify-between items-center">
                          <span className="font-medium text-white">
                            Total Package + Add-ons:
                          </span>
                          <span className="font-bold text-2xl text-white">
                            $
                            {packageInfo.price +
                              (watchedValues.selectedAddons?.reduce(
                                (total, addonId) => {
                                  const addon = addonOptions.find(
                                    (opt) => opt.id === addonId
                                  );
                                  return (
                                    total +
                                    (addon
                                      ? parseFloat(
                                          addon.price.replace(/[^0-9.-]+/g, "")
                                        )
                                      : 0)
                                  );
                                },
                                0
                              ) || 0)}
                          </span>
                        </div>
                      </div>
                    )}

                  {(!watchedValues.selectedAddons ||
                    watchedValues.selectedAddons.length === 0) && (
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-white">
                        Total Price:
                      </span>
                      <span className="font-bold text-2xl text-white">
                        ${packageInfo.price}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-white">
                      Business Fields:
                    </span>
                    <div className="text-right">
                      {watchedValues.businessField &&
                      watchedValues.businessField.length > 0 ? (
                        <div className="flex flex-wrap gap-1 justify-end">
                          {watchedValues.businessField.map((field, idx) => (
                            <span
                              key={idx}
                              className="inline-block bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs"
                            >
                              {field}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-white">Not Specified</span>
                      )}
                    </div>
                  </div>

                  {/* Pakete özel cevapları göster */}
                  {watchedValues.packageAnswers &&
                    Object.keys(watchedValues.packageAnswers).length > 0 && (
                      <div className="border-t pt-3">
                        <span className="font-medium text-white block mb-2">
                          Selected Features:
                        </span>
                        <div className="space-y-2">
                          {Object.entries(watchedValues.packageAnswers).map(
                            ([questionId, answer]) => {
                              const question =
                                currentPackageQuestions.questions.find(
                                  (q) => q.id === questionId
                                );
                              if (!question || !answer) return null;

                              return (
                                <div key={questionId} className="text-sm pb-2">
                                  <span className="font-medium text-white">
                                    {question.label}
                                  </span>
                                  <div className="ml-4 text-white">
                                    {Array.isArray(answer) ? (
                                      answer.map((item, idx) => (
                                        <span
                                          key={idx}
                                          className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs mr-1 mb-1"
                                        >
                                          {item}
                                        </span>
                                      ))
                                    ) : (
                                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                                        {String(answer)}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    )}

                  {/* Domain Information */}
                  {(watchedValues.hasDomain || watchedValues.domainName) && (
                    <div className="border-t pt-3">
                      <span className="font-medium text-white block mb-2">
                        Domain Information:
                      </span>
                      <div className="text-sm space-y-1">
                        <div className="text-white">
                          <span className="font-medium">Has Domain:</span>{" "}
                          {watchedValues.hasDomain === "yes" ? "Yes" : "No"}
                        </div>
                        {watchedValues.domainName && (
                          <div className="text-white">
                            <span className="font-medium">Domain:</span>{" "}
                            {watchedValues.domainName}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Social Media Information */}
                  {(watchedValues.hasSocialMedia ||
                    (watchedValues.socialMediaAccounts &&
                      watchedValues.socialMediaAccounts.length > 0)) && (
                    <div className="border-t pt-3">
                      <span className="font-medium text-white block mb-2">
                        Social Media Information:
                      </span>
                      <div className="text-sm space-y-1">
                        <div className="text-white">
                          <span className="font-medium">Has Social Media:</span>{" "}
                          {watchedValues.hasSocialMedia === "yes"
                            ? "Yes"
                            : "No"}
                        </div>
                        {watchedValues.socialMediaAccounts &&
                          watchedValues.socialMediaAccounts.length > 0 && (
                            <div className="text-white">
                              <span className="font-medium">Accounts:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {watchedValues.socialMediaAccounts.map(
                                  (account, idx) => (
                                    <span
                                      key={idx}
                                      className="inline-block bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs"
                                    >
                                      {account}
                                    </span>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                      </div>
                    </div>
                  )}

                  {/* Selected Add-ons */}
                  {watchedValues.selectedAddons &&
                    watchedValues.selectedAddons.length > 0 && (
                      <div className="border-t pt-3">
                        <span className="font-medium text-white block mb-2">
                          Selected Add-ons:
                        </span>
                        <div className="space-y-2">
                          {watchedValues.selectedAddons.map((addonId, idx) => {
                            // Find addon details from addonOptions
                            const addon = addonOptions.find(
                              (opt) => opt.id === addonId
                            );
                            return addon ? (
                              <div key={idx} className="text-sm">
                                <span className="inline-block bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                                  + {addon.name} ({addon.price})
                                </span>
                              </div>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}

                  {/* Project Details */}
                  {(watchedValues.projectDescription ||
                    watchedValues.specialRequirements ||
                    watchedValues.exampleSites ||
                    watchedValues.additionalNotes) && (
                    <div className="border-t pt-3">
                      <span className="font-medium text-white block mb-2">
                        Project Details:
                      </span>
                      <div className="text-sm space-y-2">
                        {watchedValues.projectDescription && (
                          <div className="text-white">
                            <span className="font-medium">
                              Project Description:
                            </span>
                            <p className="ml-4 mt-1 text-gray-300 text-xs">
                              {watchedValues.projectDescription}
                            </p>
                          </div>
                        )}
                        {watchedValues.specialRequirements && (
                          <div className="text-white">
                            <span className="font-medium">
                              Special Requirements:
                            </span>
                            <p className="ml-4 mt-1 text-gray-300 text-xs">
                              {watchedValues.specialRequirements}
                            </p>
                          </div>
                        )}
                        {watchedValues.exampleSites && (
                          <div className="text-white">
                            <span className="font-medium">Example Sites:</span>
                            <p className="ml-4 mt-1 text-gray-300 text-xs">
                              {watchedValues.exampleSites}
                            </p>
                          </div>
                        )}
                        {watchedValues.additionalNotes && (
                          <div className="text-white">
                            <span className="font-medium">
                              Additional Notes:
                            </span>
                            <p className="ml-4 mt-1 text-gray-300 text-xs">
                              {watchedValues.additionalNotes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {packageInfo.maintenanceRequired && (
                    <div className="border-t pt-3 bg-green-50 -m-2 p-3 rounded-md">
                      <p className="text-sm text-green-800">
                        ✅ <strong>Monthly maintenance included:</strong>{" "}
                        {packageInfo.maintenancePrice}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-between mt-8 w-full gap-4">
            {/* Left/back button */}
            {currentStep > 1 ? (
              <Button
                type="button"
                onClick={prevStep}
                variant="outline"
                className="px-6 py-2 text-lg w-full max-w-[150px]"
              >
                ← Geri
              </Button>
            ) : onBack ? (
              <Button
                type="button"
                onClick={onBack}
                variant="outline"
                className="px-6 py-2 text-lg w-full max-w-[150px]"
              >
                ← Geri
              </Button>
            ) : (
              <span />
            )}

            {/* Right/next or submit */}
            {currentStep < 7 ? (
              <Button
                type="button"
                onClick={nextStep}
                className="px-6 py-2 text-lg w-full max-w-[150px]"
              >
                İleri →
              </Button>
            ) : (
              <Button
                type="button"
                disabled={isSubmitting}
                className="max-w-[200px]"
                onClick={() => {
                  console.log("💳 Payment button clicked!");
                  form.handleSubmit(onSubmit)();
                }}
              >
                {isSubmitting ? "İşleniyor..." : "💳 Ödemeye Geç"}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
