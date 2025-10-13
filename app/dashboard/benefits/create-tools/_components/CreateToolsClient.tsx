"use client";

import React, { useState } from "react";
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
import { createTools } from "@/app/action/create-tools-action";
import { useRouter } from "next/navigation";
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

interface Tools {
  id: string;
  name: string;
  price: number;
}

interface CreateToolsProps {
  tools: Tools[];
}

// Form schema - PRICE REMOVED (auto-calculated)
const toolsFormSchema = z.object({
  name: z.string().min(1, "Tool name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  features: z.string().min(1, "At least one feature is required"),
  optionalAddons: z.string().optional(),
  maintenanceRequired: z.boolean().default(false),
  // n8n specific fields
  automationType: z.string().optional(),
  triggerType: z.string().optional(),
  complexity: z.string().optional(),
  executionFrequency: z.string().optional(),
  dataVolume: z.string().optional(),
  deploymentType: z.string().optional(),
  integrations: z.string().optional(),
  customRequirements: z.string().optional(),
  apiConnections: z.coerce.number().optional(),
  webhookEndpoints: z.coerce.number().optional(),
  dataTransformations: z.coerce.number().optional(),
  errorHandling: z.boolean().default(false),
  monitoring: z.boolean().default(false),
  testingIncluded: z.boolean().default(false),
  trainingIncluded: z.boolean().default(false),
  backupStrategy: z.string().optional(),
  documentation: z.string().optional(),
  supportLevel: z.string().optional(),
  technicalNotes: z.string().optional(),
  scalabilityOptions: z.string().optional(),
});

type ToolsFormValues = z.infer<typeof toolsFormSchema>;

function CreateToolsClient({ tools }: CreateToolsProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const form = useForm<ToolsFormValues>({
    resolver: zodResolver(toolsFormSchema),
    defaultValues: {
      name: "",
      description: "",
      features: "",
      optionalAddons: "",
      maintenanceRequired: false,
      errorHandling: false,
      monitoring: false,
      testingIncluded: false,
      trainingIncluded: false,
      automationType: "",
      triggerType: "",
      complexity: "",
      executionFrequency: "",
      dataVolume: "",
      deploymentType: "",
      integrations: "",
      customRequirements: "",
      apiConnections: undefined,
      webhookEndpoints: undefined,
      dataTransformations: undefined,
      backupStrategy: "",
      documentation: "",
      supportLevel: "",
      technicalNotes: "",
      scalabilityOptions: "",
    },
  });

  const handleCreate = () => {
    setIsSheetOpen(true);
    setError(undefined);
  };

  const onSubmit = async (data: ToolsFormValues) => {
    setIsLoading(true);
    setError(undefined);

    try {
      const result = await createTools(data);

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
                  Create Tools
                </h4>
              </div>

              <div
                className="w-full pb-8 flex flex-col gap-8"
                style={{ opacity: 1 }}
              >
                <div className="bg-border shrink-0 h-px w-full dark:bg-[#171719]" />

                <div className="mt-96 flex w-full flex-col items-center justify-center gap-4">
                  <h1 className="text-2xl font-normal">
                    No Automation Tool Selected
                  </h1>
                  <p className="dark:text-[#999999] text-gray-500">
                    Select an n8n automation tool to view its details, or create
                    a new one
                  </p>
                  <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                      <button
                        type="button"
                        onClick={handleCreate}
                        className="gap-2 [&_svg]:pointer-events-none [&_svg]:size-4! [&_svg]:shrink-0 hover:bg-primary/90 relative inline-flex dark:bg-[#171719] dark:hover:bg-[#171719] items-center font-medium select-none justify-center ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap bg-[#171719] text-white hover:opacity-90 transition-opacity duration-100 border border-white/10 h-10 px-4 py-2 rounded-xl text-sm"
                      >
                        <div className="flex flex-row items-center">
                          Create Automation Tool
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
                          <SheetTitle>
                            Create New n8n Automation Tool
                          </SheetTitle>
                          <SheetDescription>
                            Create a new n8n automation tool for your users.
                            Fill in the details below to get started.
                          </SheetDescription>
                        </SheetHeader>
                        <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-12rem)] pr-3 flex-1 relative z-10">
                          <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                              {/* Basic Info */}
                              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                                Temel Bilgiler
                              </h3>
                              <div className="space-y-4">
                                <FormField
                                  control={form.control}
                                  name="name"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-sm font-medium">
                                        Tool Adı
                                      </FormLabel>
                                      <FormControl>
                                        <input
                                          {...field}
                                          type="text"
                                          placeholder="Örn: E-ticaret Otomasyonu"
                                          className="w-full p-3 border rounded-xl dark:bg-[#171719] dark:border-white/10"
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name="description"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-sm font-medium">
                                        Açıklama
                                      </FormLabel>
                                      <FormControl>
                                        <textarea
                                          {...field}
                                          placeholder="Tool hakkında detaylı açıklama..."
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
                              </div>

                              {/* n8n Automation Details */}
                              <div className="space-y-4 pt-4 border-t dark:border-white/10">
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                                  n8n Otomasyon Detayları
                                </h3>

                                <div className="grid grid-cols-2 gap-3">
                                  <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium">
                                      Otomasyon Türü
                                    </label>
                                    <select
                                      name="automationType"
                                      className="w-full p-3 border rounded-xl dark:bg-[#171719] dark:border-white/10"
                                    >
                                      <option value="">Seçiniz</option>
                                      <option value="workflow">Workflow</option>
                                      <option value="integration">
                                        Integration
                                      </option>
                                      <option value="data-processing">
                                        Data Processing
                                      </option>
                                      <option value="notification">
                                        Notification
                                      </option>
                                      <option value="custom">Custom</option>
                                    </select>
                                  </div>
                                  <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium">
                                      Trigger Türü
                                    </label>
                                    <select
                                      name="triggerType"
                                      className="w-full p-3 border rounded-xl dark:bg-[#171719] dark:border-white/10"
                                    >
                                      <option value="">Seçiniz</option>
                                      <option value="webhook">Webhook</option>
                                      <option value="schedule">Schedule</option>
                                      <option value="manual">Manual</option>
                                      <option value="event-based">
                                        Event-based
                                      </option>
                                    </select>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                  <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium">
                                      Karmaşıklık
                                    </label>
                                    <select
                                      name="complexity"
                                      className="w-full p-3 border rounded-xl dark:bg-[#171719] dark:border-white/10"
                                    >
                                      <option value="">Seçiniz</option>
                                      <option value="simple">Simple</option>
                                      <option value="medium">Medium</option>
                                      <option value="complex">Complex</option>
                                      <option value="enterprise">
                                        Enterprise
                                      </option>
                                    </select>
                                  </div>
                                  <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium">
                                      Çalışma Sıklığı
                                    </label>
                                    <select
                                      name="executionFrequency"
                                      className="w-full p-3 border rounded-xl dark:bg-[#171719] dark:border-white/10"
                                    >
                                      <option value="">Seçiniz</option>
                                      <option value="real-time">
                                        Real-time
                                      </option>
                                      <option value="hourly">Hourly</option>
                                      <option value="daily">Daily</option>
                                      <option value="weekly">Weekly</option>
                                      <option value="on-demand">
                                        On-demand
                                      </option>
                                    </select>
                                  </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                  <label className="text-sm font-medium">
                                    Veri Hacmi
                                  </label>
                                  <select
                                    name="dataVolume"
                                    className="w-full p-3 border rounded-xl dark:bg-[#171719] dark:border-white/10"
                                  >
                                    <option value="">Seçiniz</option>
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                    <option value="enterprise">
                                      Enterprise
                                    </option>
                                  </select>
                                </div>

                                <div className="flex flex-col gap-2">
                                  <label className="text-sm font-medium">
                                    Deployment Türü
                                  </label>
                                  <select
                                    name="deploymentType"
                                    className="w-full p-3 border rounded-xl dark:bg-[#171719] dark:border-white/10"
                                  >
                                    <option value="">Seçiniz</option>
                                    <option value="cloud">Cloud</option>
                                    <option value="on-premise">
                                      On-premise
                                    </option>
                                    <option value="hybrid">Hybrid</option>
                                  </select>
                                </div>
                              </div>

                              {/* Integrations & Technical Details */}
                              <div className="space-y-4 pt-4 border-t dark:border-white/10">
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                                  Entegrasyonlar ve Teknik Detaylar
                                </h3>

                                <div className="flex flex-col gap-2">
                                  <label className="text-sm font-medium">
                                    Entegrasyonlar
                                  </label>
                                  <textarea
                                    name="integrations"
                                    placeholder="Her satıra bir entegrasyon yazın&#10;slack&#10;google-sheets&#10;zapier&#10;api"
                                    className="w-full p-3 border rounded-xl h-20 text-sm dark:bg-[#171719] dark:border-white/10"
                                  />
                                  <p className="text-xs text-gray-500">
                                    Kullanılacak entegrasyonları listeleyin
                                  </p>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                  <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium">
                                      API Bağlantıları
                                    </label>
                                    <input
                                      name="apiConnections"
                                      type="number"
                                      placeholder="5"
                                      min="0"
                                      className="w-full p-3 border rounded-xl dark:bg-[#171719] dark:border-white/10"
                                    />
                                  </div>
                                  <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium">
                                      Webhook Endpoint&apos;leri
                                    </label>
                                    <input
                                      name="webhookEndpoints"
                                      type="number"
                                      placeholder="3"
                                      min="0"
                                      className="w-full p-3 border rounded-xl dark:bg-[#171719] dark:border-white/10"
                                    />
                                  </div>
                                  <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium">
                                      Veri Dönüşümleri
                                    </label>
                                    <input
                                      name="dataTransformations"
                                      type="number"
                                      placeholder="10"
                                      min="0"
                                      className="w-full p-3 border rounded-xl dark:bg-[#171719] dark:border-white/10"
                                    />
                                  </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                  <label className="text-sm font-medium">
                                    Özel Gereksinimler
                                  </label>
                                  <textarea
                                    name="customRequirements"
                                    placeholder="Özel gereksinimlerinizi buraya yazın..."
                                    className="w-full p-3 border rounded-xl h-20 dark:bg-[#171719] dark:border-white/10"
                                  />
                                </div>
                              </div>

                              {/* Features & Services */}
                              <div className="space-y-4 pt-4 border-t dark:border-white/10">
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                                  Özellikler ve Hizmetler
                                </h3>

                                <div className="flex flex-col gap-2">
                                  <label className="text-sm font-medium">
                                    Özellikler
                                  </label>
                                  <textarea
                                    name="features"
                                    placeholder="Her satıra bir özellik yazın&#10;- Otomatik veri senkronizasyonu&#10;- Hata yönetimi&#10;- Monitoring"
                                    className="w-full p-3 border rounded-xl h-24 dark:bg-[#171719] dark:border-white/10"
                                    required
                                  />
                                </div>

                                <div className="flex flex-col gap-2">
                                  <label className="text-sm font-medium">
                                    Opsiyonel Eklentiler
                                  </label>
                                  <textarea
                                    name="optionalAddons"
                                    placeholder="Her satıra bir eklenti yazın&#10;- Gelişmiş monitoring&#10;- Backup sistemi&#10;- Çoklu dil desteği"
                                    className="w-full p-3 border rounded-xl h-24 dark:bg-[#171719] dark:border-white/10"
                                  />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div className="flex items-center gap-3 p-3 border rounded-xl dark:border-white/10">
                                    <input
                                      name="errorHandling"
                                      type="checkbox"
                                      id="errorHandling"
                                      className="w-4 h-4"
                                      value="true"
                                    />
                                    <label
                                      htmlFor="errorHandling"
                                      className="text-sm font-medium"
                                    >
                                      Hata yönetimi
                                    </label>
                                  </div>
                                  <div className="flex items-center gap-3 p-3 border rounded-xl dark:border-white/10">
                                    <input
                                      name="monitoring"
                                      type="checkbox"
                                      id="monitoring"
                                      className="w-4 h-4"
                                      value="true"
                                    />
                                    <label
                                      htmlFor="monitoring"
                                      className="text-sm font-medium"
                                    >
                                      Monitoring
                                    </label>
                                  </div>
                                  <div className="flex items-center gap-3 p-3 border rounded-xl dark:border-white/10">
                                    <input
                                      name="testingIncluded"
                                      type="checkbox"
                                      id="testingIncluded"
                                      className="w-4 h-4"
                                      value="true"
                                    />
                                    <label
                                      htmlFor="testingIncluded"
                                      className="text-sm font-medium"
                                    >
                                      Test dahil
                                    </label>
                                  </div>
                                  <div className="flex items-center gap-3 p-3 border rounded-xl dark:border-white/10">
                                    <input
                                      name="trainingIncluded"
                                      type="checkbox"
                                      id="trainingIncluded"
                                      className="w-4 h-4"
                                      value="true"
                                    />
                                    <label
                                      htmlFor="trainingIncluded"
                                      className="text-sm font-medium"
                                    >
                                      Eğitim dahil
                                    </label>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 border rounded-xl dark:border-white/10">
                                  <input
                                    name="maintenanceRequired"
                                    type="checkbox"
                                    id="maintenance"
                                    className="w-4 h-4"
                                    value="true"
                                  />
                                  <label
                                    htmlFor="maintenance"
                                    className="text-sm font-medium"
                                  >
                                    Aylık bakım gerekli
                                  </label>
                                </div>

                                <div className="flex flex-col gap-2">
                                  <label className="text-sm font-medium">
                                    Aylık Bakım Ücreti (₺)
                                  </label>
                                  <input
                                    name="maintenancePrice"
                                    type="text"
                                    placeholder="Örn: 500"
                                    className="w-full p-3 border rounded-xl dark:bg-[#171719] dark:border-white/10"
                                  />
                                </div>
                              </div>

                              {/* Technical Notes & Support */}
                              <div className="space-y-4 pt-4 border-t dark:border-white/10">
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                                  Teknik Notlar ve Destek
                                </h3>

                                <div className="flex flex-col gap-2">
                                  <label className="text-sm font-medium">
                                    Teknik Notlar
                                  </label>
                                  <textarea
                                    name="technicalNotes"
                                    placeholder="Teknik notlarınızı buraya yazın..."
                                    className="w-full p-3 border rounded-xl h-24 dark:bg-[#171719] dark:border-white/10"
                                  />
                                </div>

                                <div className="flex flex-col gap-2">
                                  <label className="text-sm font-medium">
                                    Backup Stratejisi
                                  </label>
                                  <input
                                    name="backupStrategy"
                                    type="text"
                                    placeholder="Örn: Günlük otomatik backup"
                                    className="w-full p-3 border rounded-xl dark:bg-[#171719] dark:border-white/10"
                                  />
                                </div>

                                <div className="flex flex-col gap-2">
                                  <label className="text-sm font-medium">
                                    Dokümantasyon
                                  </label>
                                  <input
                                    name="documentation"
                                    type="text"
                                    placeholder="Örn: Detaylı kullanım kılavuzu"
                                    className="w-full p-3 border rounded-xl dark:bg-[#171719] dark:border-white/10"
                                  />
                                </div>

                                <div className="flex flex-col gap-2">
                                  <label className="text-sm font-medium">
                                    Destek Seviyesi
                                  </label>
                                  <select
                                    name="supportLevel"
                                    className="w-full p-3 border rounded-xl dark:bg-[#171719] dark:border-white/10"
                                  >
                                    <option value="">Seçiniz</option>
                                    <option value="basic">Basic</option>
                                    <option value="standard">Standard</option>
                                    <option value="premium">Premium</option>
                                    <option value="enterprise">
                                      Enterprise
                                    </option>
                                  </select>
                                </div>

                                <div className="flex flex-col gap-2">
                                  <label className="text-sm font-medium">
                                    Ölçeklenebilirlik Seçenekleri
                                  </label>
                                  <input
                                    name="scalabilityOptions"
                                    type="text"
                                    placeholder="Örn: Horizontal scaling, load balancing"
                                    className="w-full p-3 border rounded-xl dark:bg-[#171719] dark:border-white/10"
                                  />
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
                <div>Make Tools</div>
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
                    placeholder="Search Tools"
                    className="ring-offset-background file:text-foreground flex file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:placeholder:text-polar-500 dark:border-polar-700 shadow-xs h-10 border border-gray-200 text-base text-gray-950 outline-none placeholder:text-gray-400 focus:z-10 focus:border-blue-300 focus:ring-blue-100 focus-visible:ring-blue-100 md:text-sm dark:text-white dark:ring-offset-transparent dark:focus:border-blue-600 dark:focus:ring-blue-700/40 shadow-none! w-full rounded-none border-none bg-transparent p-0 ring-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-transparent"
                  />
                </div>
              </div>

              {/* Package List */}
              <div className="dark:divide-[#313131] flex h-full grow flex-col divide-y divide-gray-200 overflow-y-auto mt-2">
                {tools.map((pkg) => (
                  <Link
                    key={pkg.id}
                    href={`/dashboard/benefits/create-tools/${pkg.id}`}
                    className="px-4 py-2 text-left hover:bg-gray-100 rounded-xl dark:hover:bg-[#313131] w-full block mb-2 flex flex-row items-center gap-2 "
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

export default CreateToolsClient;
