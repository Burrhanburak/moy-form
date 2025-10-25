"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CheckIcon, PlusIcon } from "lucide-react";
import { SearchIcon } from "lucide-react";
import { createPackage } from "@/app/action/create-package-action";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { calculatePackagePrice, formatPrice } from "@/utils/pricing-calculator";
import {
  MultiSelector,
  MultiSelectorTrigger,
  MultiSelectorInput,
  MultiSelectorContent,
  MultiSelectorList,
  MultiSelectorItem,
} from "@/components/ui/multi-select";
import UploaderButton from "@/components/uploader-button";

interface Package {
  id: string;
  name: string;
  price: number;
}

interface CreatePackageProps {
  packages: Package[];
}

// Form schema - PRICE REMOVED (auto-calculated)
const packageFormSchema = z.object({
  name: z.string().min(1, "Package name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  businessType: z.string().optional(),
  targetAudience: z.string().optional(),
  numberOfPages: z.coerce
    .number()
    .min(1, "At least 1 page required")
    .optional(),
  deliveryTimeInDays: z.coerce
    .number()
    .min(1, "Delivery time must be at least 1 day")
    .optional(),
  features: z.array(z.string()).min(1, "At least one feature is required"),
  optionalAddons: z.array(z.string()).optional(),
  uploadedImages: z.array(z.string()).optional(),
  advancedSeo: z.boolean().default(false),
  customUiUx: z.boolean().default(false),
  liveChat: z.boolean().default(false),
  referenceUrls: z.string().optional(),
  referenceImages: z.string().optional(),
  maintenanceRequired: z.boolean().default(false),
  specialNotes: z.string().optional(),
  isCustomRequest: z.boolean().default(false),
});

type PackageFormValues = z.infer<typeof packageFormSchema>;

function CreatePackageClient({ packages }: CreatePackageProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);

  const form = useForm<PackageFormValues>({
    // @ts-expect-error - Zod resolver type inference issue with optional fields
    resolver: zodResolver(packageFormSchema),
    defaultValues: {
      name: "",
      description: "",
      businessType: "",
      targetAudience: "",
      features: [],
      optionalAddons: [],
      uploadedImages: [],
      advancedSeo: false,
      customUiUx: false,
      liveChat: false,
      referenceUrls: "",
      referenceImages: "",
      maintenanceRequired: false,
      isCustomRequest: true, // Always true for custom packages
      specialNotes: "",
      numberOfPages: undefined,
      deliveryTimeInDays: undefined,
    },
  });

  const handleCreate = () => {
    setIsSheetOpen(true);
    setError(undefined);
  };

  // ✅ useCallback ile onChange'i memoize et - sonsuz döngüyü önler
  const handleImageChange = useCallback(
    (urls: string[]) => {
      form.setValue("uploadedImages", urls, { shouldValidate: true });
    },
    [form]
  );

  // Real-time price calculation
  useEffect(() => {
    const subscription = form.watch((values) => {
      try {
        const featuresArray = Array.isArray(values.features)
          ? values.features
          : [];

        const optionalAddonsArray = Array.isArray(values.optionalAddons)
          ? values.optionalAddons
          : [];

        const referenceUrlsArray =
          values.referenceUrls
            ?.split("\n")
            .map((f) => f.trim())
            .filter(Boolean) || [];

        const referenceImagesArray =
          values.referenceImages
            ?.split("\n")
            .map((f) => f.trim())
            .filter(Boolean) || [];

        // Combine with uploaded images
        const allReferenceImages = [
          ...referenceImagesArray,
          ...(values.uploadedImages || []),
        ];

        // Add premium features to features array for pricing
        const allFeatures = [...featuresArray];
        if (values.advancedSeo) allFeatures.push("Advanced SEO");
        if (values.customUiUx) allFeatures.push("Custom UI/UX Design");
        if (values.liveChat) allFeatures.push("Live Chat Integration");

        console.log("💰 Pricing calculation input:", {
          numberOfPages: values.numberOfPages,
          deliveryTimeInDays: values.deliveryTimeInDays,
          featuresCount: allFeatures.length,
          features: allFeatures,
          addonsCount: optionalAddonsArray.length,
          maintenanceRequired: values.maintenanceRequired,
        });

        const pricing = calculatePackagePrice({
          numberOfPages: values.numberOfPages,
          deliveryTimeInDays: values.deliveryTimeInDays,
          features: allFeatures.filter(Boolean) as string[],
          // uploadedImages: values.uploadedImages || [],
          optionalAddons: optionalAddonsArray.filter(Boolean) as string[],
          maintenanceRequired: values.maintenanceRequired || false,
          isCustomRequest: true, // Always true
          referenceUrls: referenceUrlsArray,
          referenceImages: allReferenceImages.filter(Boolean) as string[],
        });

        console.log("💰 Calculated price:", {
          totalPrice: pricing.totalPrice,
          breakdown: pricing.breakdown,
          formatted: formatPrice(pricing.totalPrice),
        });

        setEstimatedPrice(pricing.totalPrice);
      } catch (error) {
        console.error("❌ Pricing calculation error:", error);
        setEstimatedPrice(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  const onSubmit = async (data: PackageFormValues) => {
    setIsLoading(true);
    setError(undefined);

    try {
      const result = await createPackage(data);

      if (result.success && result.checkoutUrl) {
        // Redirect to payment
        window.location.href = result.checkoutUrl;
      } else if (result.error) {
        setError(result.error);
        setIsLoading(false);
      }
    } catch {
      setError("An unexpected error occurred");
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex h-full w-full flex-col gap-y-4 p-6">
      <main className="relative flex min-h-0 w-full grow flex-col">
        <div className="flex h-full w-full gap-x-4 md:flex-row-reverse flex-col">
          {/* Ana Detay Paneli */}
          <div className="dark:md:bg-[#171719] dark:border-[#313131] md:shadow-xs relative flex w-full flex-col items-center rounded-3xl border-gray-200 px-6 md:overflow-y-auto md:border md:bg-white md:px-8 mr-4 order-2 md:order-1">
            <div className="flex h-full w-full flex-col">
              <div className="flex w-full flex-col gap-y-4 py-8 md:flex-row md:items-center md:justify-between md:py-8">
                <h4 className="whitespace-nowrap text-2xl font-medium dark:text-white">
                  Create Package
                </h4>
              </div>

              <div
                className="w-full pb-8 flex flex-col gap-8"
                style={{ opacity: 1 }}
              >
                <div className="bg-border shrink-0 h-px w-full dark:bg-[#171719]" />

                <div className="mt-96 flex w-full flex-col items-center justify-center gap-4">
                  <h1 className="text-2xl font-normal">No Package Selected</h1>
                  <p className="dark:text-[#999999] text-gray-500">
                    Select a package to view its details, or create a new one
                  </p>
                  <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                      <button
                        type="button"
                        onClick={handleCreate}
                        className="gap-2 [&_svg]:pointer-events-none [&_svg]:size-4! [&_svg]:shrink-0 hover:bg-primary/90 relative inline-flex dark:bg-[#171719] dark:hover:bg-[#171719] items-center font-medium select-none justify-center ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap bg-[#171719] text-white hover:opacity-90 transition-opacity duration-100 border border-white/10 h-10 px-4 py-2 rounded-xl text-sm"
                      >
                        <div className="flex flex-row items-center">
                          Create Package
                        </div>
                      </button>
                    </SheetTrigger>
                    <SheetContent
                      className="p-0 rounded-3xl mr-2 ml-2 md:mr-4 md:ml-4 sheet-content z-50"
                      style={{
                        height: "calc(100vh - 1rem)",
                        top: "0.5rem",
                        maxHeight: "calc(100vh - 1rem)",
                        width: "calc(100vw - 1rem)",
                        maxWidth: "600px",
                        zIndex: 50,
                      }}
                    >
                      <div className="p-8 h-full flex flex-col">
                        <SheetHeader className="mb-6 flex-shrink-0">
                          <SheetTitle>Create New Package</SheetTitle>
                          <SheetDescription>
                            Create a new package for your users. Fill in the
                            details below to get started.
                          </SheetDescription>
                        </SheetHeader>
                        <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-12rem)] pr-3 flex-1 relative z-10">
                          <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit as any)}>
                              {/* Basic Info */}
                              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                                Temel Bilgiler
                              </h3>
                              <div className="space-y-4">
                                <FormField
                                  control={form.control as any}
                                  name="name"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-sm font-medium">
                                        Paket Adı
                                      </FormLabel>
                                      <FormControl>
                                        <input
                                          {...field}
                                          type="text"
                                          placeholder="Örn: Kurumsal Web Sitesi"
                                          className="w-full p-3 border rounded-xl dark:bg-[#171719] dark:border-white/10"
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control as any}
                                  name="description"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-sm font-medium">
                                        Açıklama
                                      </FormLabel>
                                      <FormControl>
                                        <textarea
                                          {...field}
                                          placeholder="Paket hakkında detaylı açıklama..."
                                          className="w-full p-3 border rounded-xl h-24 dark:bg-[#171719] dark:border-white/10"
                                        />
                                      </FormControl>
                                      <FormDescription className="text-xs text-gray-500">
                                        Fiyat otomatik hesaplanacaktır
                                      </FormDescription>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control as any}
                                  name="businessType"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-sm font-medium">
                                        İşletme Türü
                                      </FormLabel>
                                      <FormControl>
                                        <input
                                          {...field}
                                          type="text"
                                          placeholder="Örn: E-ticaret, Restoran, Hukuk Bürosu"
                                          className="w-full p-3 border rounded-xl dark:bg-[#171719] dark:border-white/10"
                                        />
                                      </FormControl>
                                      <FormDescription className="text-xs text-gray-500">
                                        Hangi sektörde faaliyet gösteriyorsunuz?
                                      </FormDescription>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control as any}
                                  name="targetAudience"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-sm font-medium">
                                        Hedef Kitle
                                      </FormLabel>
                                      <FormControl>
                                        <input
                                          {...field}
                                          type="text"
                                          placeholder="Örn: Gençler, Kurumsal müşteriler, Yerel halk"
                                          className="w-full p-3 border rounded-xl dark:bg-[#171719] dark:border-white/10"
                                        />
                                      </FormControl>
                                      <FormDescription className="text-xs text-gray-500">
                                        Sitenizi kimler kullanacak?
                                      </FormDescription>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>

                              {/* Site Details */}
                              <div className="space-y-4 pt-4 border-t dark:border-white/10">
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                                  Site Detayları
                                </h3>

                                <FormField
                                  control={form.control as any}
                                  name="numberOfPages"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-sm font-medium">
                                        Sayfa Sayısı
                                      </FormLabel>
                                      <FormControl>
                                        <input
                                          {...field}
                                          type="number"
                                          placeholder="Örn: 5"
                                          min="1"
                                          value={field.value ?? ""}
                                          onChange={(e) =>
                                            field.onChange(
                                              e.target.value
                                                ? Number(e.target.value)
                                                : undefined
                                            )
                                          }
                                          className="w-full p-3 border rounded-xl dark:bg-[#171719] dark:border-white/10"
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                {/* <div className="grid grid-cols-2 gap-3">
                                <div className="flex flex-col gap-2">
                                  <label className="text-sm font-medium">
                                    Min. Fiyat (₺)
                                  </label>
                                  <input
                                    name="priceRangeMin"
                                    type="number"
                                    placeholder="5000"
                                    min="0"
                                    className="w-full p-3 border rounded-xl dark:bg-[#171719] dark:border-white/10"
                                  />
                                </div>
                                <div className="flex flex-col gap-2">
                                  <label className="text-sm font-medium">
                                    Max. Fiyat (₺)
                                  </label>
                                  <input
                                    name="priceRangeMax"
                                    type="number"
                                    placeholder="15000"
                                    min="0"
                                    className="w-full p-3 border rounded-xl dark:bg-[#171719] dark:border-white/10"
                                  />
                                </div>
                              </div> */}

                                <FormField
                                  control={form.control as any}
                                  name="deliveryTimeInDays"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-sm font-medium">
                                        Teslim Süresi (Gün)
                                      </FormLabel>
                                      <FormControl>
                                        <input
                                          {...field}
                                          type="number"
                                          placeholder="30"
                                          min="1"
                                          value={field.value ?? ""}
                                          onChange={(e) =>
                                            field.onChange(
                                              e.target.value
                                                ? Number(e.target.value)
                                                : undefined
                                            )
                                          }
                                          className="w-full p-3 border rounded-xl dark:bg-[#171719] dark:border-white/10"
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>

                              {/* Reference Links */}
                              <div className="space-y-4 pt-4 border-t dark:border-white/10">
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                                  Referans ve Görseller
                                </h3>

                                <div className="p-3 border rounded-xl dark:border-white/10 bg-yellow-50 dark:bg-yellow-950/20">
                                  <p className="text-xs text-yellow-800 dark:text-yellow-200">
                                    💡{" "}
                                    <span className="font-semibold">
                                      İpucu:
                                    </span>{" "}
                                    Referans görselleri için aşağıdaki
                                    yükleyiciyi kullanabilir veya URL
                                    verebilirsiniz. Maksimum 5 referans sitesi
                                    ve 10 görsel öneriyoruz.
                                  </p>
                                </div>

                                <div className="space-y-2">
                                  <label className="text-sm font-medium text-gray-900 dark:text-white">
                                    Referans Görselleri Yükle
                                  </label>
                                  <UploaderButton
                                    endpoint="imageUploader"
                                    onChange={handleImageChange}
                                    onClientUploadComplete={(files) => {
                                      const urls = files.map(
                                        (f) => f.ufsUrl || f.url || ""
                                      );
                                      const current =
                                        form.getValues("uploadedImages") || [];
                                      form.setValue("uploadedImages", [
                                        ...current,
                                        ...urls,
                                      ]);
                                    }}
                                  />
                                  {form.watch("uploadedImages")?.length > 0 && (
                                    <p className="text-xs text-green-600 dark:text-green-400">
                                      ✓ {form.watch("uploadedImages")!.length}{" "}
                                      görsel yüklendi
                                    </p>
                                  )}
                                </div>

                                <FormField
                                  control={form.control as any}
                                  name="referenceUrls"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-sm font-medium">
                                        Referans Site URL&apos;leri
                                      </FormLabel>
                                      <FormControl>
                                        <textarea
                                          {...field}
                                          placeholder="Beğendiğiniz sitelerin linklerini her satıra bir tane olacak şekilde yazın:&#10;https://example.com&#10;https://example2.com&#10;https://competitor-site.com"
                                          className="w-full p-3 border rounded-xl h-24 text-sm dark:bg-[#171719] dark:border-white/10"
                                        />
                                      </FormControl>
                                      <FormDescription className="text-xs text-gray-500">
                                        Hangi sitelerin tasarımını veya
                                        özelliklerini beğendiniz?
                                      </FormDescription>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control as any}
                                  name="referenceImages"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-sm font-medium">
                                        Referans Görsel URL&apos;leri
                                      </FormLabel>
                                      <FormControl>
                                        <textarea
                                          {...field}
                                          placeholder="Tasarım referanslarınızın linklerini yazın:&#10;https://uploadthing.com/your-image-1.png&#10;https://imgur.com/abc123.jpg&#10;https://your-site.com/inspiration.png"
                                          className="w-full p-3 border rounded-xl h-24 text-sm dark:bg-[#171719] dark:border-white/10"
                                        />
                                      </FormControl>
                                      <FormDescription className="text-xs text-gray-500">
                                        Logo, renk paleti, layout örnekleri
                                        ekleyebilirsiniz
                                      </FormDescription>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>

                              {/* Features & Maintenance */}
                              <div className="space-y-4 pt-4 border-t dark:border-white/10">
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                                  Özellikler ve Bakım
                                </h3>

                                {/* Premium Features Checkboxes */}
                                <div className="grid grid-cols-1 gap-3">
                                  <FormField
                                    control={form.control as any}
                                    name="advancedSeo"
                                    render={({ field }) => (
                                      <FormItem>
                                        <div className="flex items-center gap-3 p-3 border rounded-xl dark:border-white/10 bg-green-50 dark:bg-green-950/20">
                                          <FormControl>
                                            <input
                                              type="checkbox"
                                              id="advancedSeo"
                                              className="w-4 h-4"
                                              checked={field.value}
                                              onChange={(e) =>
                                                field.onChange(e.target.checked)
                                              }
                                            />
                                          </FormControl>
                                          <label
                                            htmlFor="advancedSeo"
                                            className="text-sm font-medium flex-1 cursor-pointer"
                                          >
                                            <span className="font-semibold">
                                              Advanced SEO
                                            </span>
                                            <span className="text-xs text-gray-500 block">
                                              Schema markup, sitemap, robots.txt
                                              (+$50)
                                            </span>
                                          </label>
                                        </div>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <FormField
                                    control={form.control as any}
                                    name="customUiUx"
                                    render={({ field }) => (
                                      <FormItem>
                                        <div className="flex items-center gap-3 p-3 border rounded-xl dark:border-white/10 bg-purple-50 dark:bg-purple-950/20">
                                          <FormControl>
                                            <input
                                              type="checkbox"
                                              id="customUiUx"
                                              className="w-4 h-4"
                                              checked={field.value}
                                              onChange={(e) =>
                                                field.onChange(e.target.checked)
                                              }
                                            />
                                          </FormControl>
                                          <label
                                            htmlFor="customUiUx"
                                            className="text-sm font-medium flex-1 cursor-pointer"
                                          >
                                            <span className="font-semibold">
                                              Custom UI/UX Design
                                            </span>
                                            <span className="text-xs text-gray-500 block">
                                              Özel tasarım, animasyonlar,
                                              mikrointeraksiyonlar (+$50)
                                            </span>
                                          </label>
                                        </div>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <FormField
                                    control={form.control as any}
                                    name="liveChat"
                                    render={({ field }) => (
                                      <FormItem>
                                        <div className="flex items-center gap-3 p-3 border rounded-xl dark:border-white/10 bg-blue-50 dark:bg-blue-950/20">
                                          <FormControl>
                                            <input
                                              type="checkbox"
                                              id="liveChat"
                                              className="w-4 h-4"
                                              checked={field.value}
                                              onChange={(e) =>
                                                field.onChange(e.target.checked)
                                              }
                                            />
                                          </FormControl>
                                          <label
                                            htmlFor="liveChat"
                                            className="text-sm font-medium flex-1 cursor-pointer"
                                          >
                                            <span className="font-semibold">
                                              Live Chat Integration
                                            </span>
                                            <span className="text-xs text-gray-500 block">
                                              WhatsApp, Intercom veya custom
                                              chat (+$50)
                                            </span>
                                          </label>
                                        </div>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>

                                <FormField
                                  control={form.control as any}
                                  name="features"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-sm font-medium">
                                        Diğer Özellikler
                                      </FormLabel>
                                      <FormControl>
                                        <MultiSelector
                                          values={field.value || []}
                                          onValuesChange={field.onChange}
                                          loop
                                          className="w-full bg-white dark:bg-zinc-950"
                                        >
                                          <MultiSelectorTrigger>
                                            <MultiSelectorInput placeholder="Select features..." />
                                          </MultiSelectorTrigger>
                                          <MultiSelectorContent>
                                            <MultiSelectorList>
                                              <MultiSelectorItem value="Responsive Design">
                                                Responsive Design
                                              </MultiSelectorItem>
                                              <MultiSelectorItem value="Contact Form">
                                                Contact Form
                                              </MultiSelectorItem>
                                              <MultiSelectorItem value="Google Analytics">
                                                Google Analytics
                                              </MultiSelectorItem>
                                              <MultiSelectorItem value="Google Maps">
                                                Google Maps
                                              </MultiSelectorItem>
                                              <MultiSelectorItem value="Gallery/Portfolio">
                                                Gallery/Portfolio
                                              </MultiSelectorItem>
                                              <MultiSelectorItem value="Blog Integration">
                                                Blog Integration
                                              </MultiSelectorItem>
                                              <MultiSelectorItem value="Social Media Integration">
                                                Social Media Integration
                                              </MultiSelectorItem>
                                              <MultiSelectorItem value="Newsletter Subscription">
                                                Newsletter Subscription
                                              </MultiSelectorItem>
                                              <MultiSelectorItem value="Video Background">
                                                Video Background
                                              </MultiSelectorItem>
                                              <MultiSelectorItem value="Animation Effects">
                                                Animation Effects
                                              </MultiSelectorItem>
                                            </MultiSelectorList>
                                          </MultiSelectorContent>
                                        </MultiSelector>
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control as any}
                                  name="optionalAddons"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-sm font-medium">
                                        Opsiyonel Eklentiler
                                      </FormLabel>
                                      <FormControl>
                                        <MultiSelector
                                          values={field.value || []}
                                          onValuesChange={field.onChange}
                                          loop
                                          className="w-full bg-white dark:bg-zinc-950"
                                        >
                                          <MultiSelectorTrigger>
                                            <MultiSelectorInput placeholder="Select add-ons..." />
                                          </MultiSelectorTrigger>
                                          <MultiSelectorContent>
                                            <MultiSelectorList>
                                              <MultiSelectorItem value="E-commerce Module">
                                                E-commerce Module
                                              </MultiSelectorItem>
                                              <MultiSelectorItem value="Blog System">
                                                Blog System
                                              </MultiSelectorItem>
                                              <MultiSelectorItem value="Multi-language Support">
                                                Multi-language Support
                                              </MultiSelectorItem>
                                              <MultiSelectorItem value="Booking/Reservation System">
                                                Booking/Reservation System
                                              </MultiSelectorItem>
                                              <MultiSelectorItem value="Payment Gateway Integration">
                                                Payment Gateway Integration
                                              </MultiSelectorItem>
                                              <MultiSelectorItem value="CRM Integration">
                                                CRM Integration
                                              </MultiSelectorItem>
                                              <MultiSelectorItem value="Membership/Login System">
                                                Membership/Login System
                                              </MultiSelectorItem>
                                              <MultiSelectorItem value="Custom Dashboard">
                                                Custom Dashboard
                                              </MultiSelectorItem>
                                              <MultiSelectorItem value="API Integration">
                                                API Integration
                                              </MultiSelectorItem>
                                              <MultiSelectorItem value="Push Notifications">
                                                Push Notifications
                                              </MultiSelectorItem>
                                            </MultiSelectorList>
                                          </MultiSelectorContent>
                                        </MultiSelector>
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control as any}
                                  name="maintenanceRequired"
                                  render={({ field }) => (
                                    <FormItem>
                                      <div className="flex items-center gap-3 p-3 border rounded-xl dark:border-white/10">
                                        <FormControl>
                                          <input
                                            type="checkbox"
                                            id="maintenance"
                                            className="w-4 h-4"
                                            checked={field.value}
                                            onChange={(e) =>
                                              field.onChange(e.target.checked)
                                            }
                                          />
                                        </FormControl>
                                        <label
                                          htmlFor="maintenance"
                                          className="text-sm font-medium"
                                        >
                                          Aylık bakım gerekli
                                        </label>
                                      </div>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>

                              {/* Special Notes */}
                              <div className="space-y-4 pt-4 border-t dark:border-white/10">
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                                  Özel Notlar
                                </h3>

                                <FormField
                                  control={form.control as any}
                                  name="specialNotes"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-sm font-medium">
                                        Ekstra İstekler ve Notlar
                                      </FormLabel>
                                      <FormControl>
                                        <textarea
                                          {...field}
                                          placeholder="Ekstra istekleriniz veya özel notlarınız varsa buraya yazabilirsiniz..."
                                          className="w-full p-3 border rounded-xl h-24 dark:bg-[#171719] dark:border-white/10"
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                {/* Custom Package Info - No Checkbox */}
                                <div className="flex flex-col gap-3 p-4 border rounded-xl dark:border-white/10 bg-blue-50 dark:bg-blue-950/20">
                                  <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center mt-0.5">
                                      <svg
                                        className="w-3 h-3 text-white"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                        Bu özel bir paket talebidir (+20%
                                        premium)
                                      </p>
                                      {estimatedPrice !== null && (
                                        <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                                          Tahmini Fiyat:{" "}
                                          <span className="font-semibold">
                                            {formatPrice(estimatedPrice)}
                                          </span>
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {error && (
                                <div className="p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
                                  {error}
                                </div>
                              )}

                              <div className="flex gap-3 pt-6 bottom-0 pb-4 flex-shrink-0 sticky bottom-0 bg-white dark:bg-[#17191a] z-20">
                                <button
                                  type="submit"
                                  disabled={isLoading}
                                  className="bg-[#171719] border border-white/10 dark:bg-[#131313] dark:hover:bg-[#171719] text-white px-6 py-3 rounded-xl hover:opacity-90 flex-1 font-medium disabled:opacity-50"
                                >
                                  {isLoading ? "Creating..." : "Create & Pay"}
                                </button>
                                <button
                                  type="button"
                                  className="border border-gray-300 dark:border-white/10 px-6 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-[#171719] flex-1 font-medium"
                                  onClick={() => setIsSheetOpen(false)}
                                >
                                  Cancel
                                </button>
                              </div>
                            </form>
                          </Form>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
            </div>
          </div>

          {/* Sağ Panel: Benefit List / Search */}
          <div className="dark:bg-[#171719] dark:border-[#313131] md:shadow-xs rounded-3xl border border-gray-200 bg-white md:max-w-[320px] w-full lg:max-w-[320px] xl:max-w-[320px] h-full overflow-y-hidden p-2 order-1 md:order-2">
            <div className="dark:divide-[#313131] flex h-full flex-col divide-y divide-gray-200">
              {/* Header */}
              <div className="flex flex-row items-center justify-between gap-6 px-4 py-4">
                <div>Make Package</div>
                <div className="flex flex-row items-center gap-4">
                  <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                      <button
                        className="gap-2 [&_svg]:shrink-0 relative font-medium select-none rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap bg-gray-800 dark:bg-[#171719] text-white dark:text-white hover:opacity-85 transition-opacity duration-100 border border-gray-300 dark:border-white/10 flex items-center justify-center p-2 text-sm h-6 w-6"
                        type="button"
                      >
                        <PlusIcon className="size-4 shrink-0 text-white dark:text-white" />
                      </button>
                    </SheetTrigger>
                  </Sheet>
                </div>
              </div>

              {/* Search */}
              <div className="flex flex-row items-center gap-3 px-4 py-2">
                <div className="dark:bg-[#171719] flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                  <SearchIcon className="size-4 shrink-0 opacity-50 text-black dark:text-white" />
                </div>
                <div className="relative flex flex-1 flex-row rounded-full">
                  <input
                    type="text"
                    placeholder="Search Packages"
                    className="ring-offset-background file:text-foreground flex file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:placeholder:text-polar-500 dark:border-polar-700 shadow-xs h-10 border border-gray-200 text-base text-gray-950 outline-none placeholder:text-gray-400 focus:z-10 focus:border-blue-300 focus:ring-blue-100 focus-visible:ring-blue-100 md:text-sm dark:text-white dark:ring-offset-transparent dark:focus:border-blue-600 dark:focus:ring-blue-700/40 shadow-none! w-full rounded-none border-none bg-transparent p-0 ring-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-transparent"
                  />
                </div>
              </div>

              {/* Package List */}
              <div className="dark:divide-[#313131] flex h-full grow flex-col divide-y divide-gray-200 overflow-y-auto mt-2">
                {packages.map((pkg) => (
                  <Link
                    key={pkg.id}
                    href={`/dashboard/create-package/${pkg.id}`}
                    className="px-4 py-2 text-left hover:bg-gray-100 rounded-xl dark:hover:bg-[#202020] w-full block mb-2 flex flex-row items-center gap-2"
                  >
                    <span className=" flex h-6 w-6 shrink-0 flex-row items-center justify-center rounded-full  dark:bg-[#313131] text-2xl text-black dark:text-white">
                      <CheckIcon className="size-3.5" />
                    </span>
                    <div className="font-medium">{pkg.name}</div>
                    <div className="text-sm text-gray-500">₺{pkg.price}</div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CreatePackageClient;
