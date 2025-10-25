"use client";

import React, { useState } from "react";
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

interface PackageDetailClientProps {
  package: {
    id: string;
    name: string;
    price: number;
    description: string;
    features: string[];
    optionalAddons: string[];
    maintenanceRequired: boolean;
    maintenancePrice: string | null;
    numberOfPages: number | null;
    referenceImages: string[];
    referenceUrls: string[];
    priceRangeMin: number | null;
    priceRangeMax: number | null;
    revisionCount: number | null;
    deliveryTimeInDays: number | null;
    specialNotes: string | null;
    isCustomRequest: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
}

export default function PackageDetailClient({
  package: packageData,
}: PackageDetailClientProps) {
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "TRY",
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));
  };

  // Filter valid image URLs
  const validImageUrls = packageData.referenceImages.filter((url) => {
    try {
      new URL(url);
      return url.startsWith("http://") || url.startsWith("https://");
    } catch {
      return false;
    }
  });

  return (
    <div className="flex h-full w-full flex-row gap-x-2 p-4">
      <div className="flex w-full flex-col items-center rounded-2xl border border-gray-200 bg-white px-4 md:overflow-y-auto md:border md:bg-white md:px-8 dark:border-[#313131] dark:bg-[#171719]">
        <div className="flex h-full w-full flex-col max-w-7xl">
          <div className="flex w-full flex-col gap-y-4 py-8 md:flex-row md:items-center md:justify-between">
            <h4 className="text-2xl font-medium text-gray-900 dark:text-white">
              <div className="flex flex-col gap-4">
                <div className="flex flex-row items-center gap-4">
                  <h2 className="text-lg font-medium">Package</h2>
                  <Badge
                    variant="outline"
                    className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  >
                    Active
                  </Badge>
                </div>
              </div>
            </h4>
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard/create-package"
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Packages
              </Link>

              {/* <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
                <SheetTrigger asChild>
                  <button className="flex items-center justify-center rounded-xl border border-white/10 bg-[#171719] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 focus:outline-none focus:ring-0 focus:ring-offset-0">
                    <div className="flex flex-row items-center">
                      Edit Package
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
                      <SheetTitle>Edit Package</SheetTitle>
                    </SheetHeader>
                    <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-12rem)] pr-3 flex-1 relative z-10">
                      <form>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                          Temel Bilgiler
                        </h3>
                        <div className="space-y-4">
                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">
                              Package Adı
                            </label>
                            <input
                              name="name"
                              type="text"
                              defaultValue={packageData.name}
                              placeholder="Örn: Kurumsal Web Sitesi"
                              className="w-full p-3 border rounded-xl dark:bg-[#171719] dark:border-white/10"
                              required
                            />
                          </div>

                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">
                              Açıklama
                            </label>
                            <textarea
                              name="description"
                              defaultValue={packageData.description}
                              placeholder="Package hakkında detaylı açıklama..."
                              className="w-full p-3 border rounded-xl h-24 dark:bg-[#171719] dark:border-white/10"
                              required
                            />
                          </div>

                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">
                              Fiyat (₺)
                            </label>
                            <input
                              name="price"
                              type="number"
                              defaultValue={packageData.price}
                              placeholder="Örn: 10000"
                              min="1"
                              className="w-full p-3 border rounded-xl dark:bg-[#171719] dark:border-white/10"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t dark:border-white/10">
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                            Site Detayları
                          </h3>

                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">
                              Sayfa Sayısı
                            </label>
                            <input
                              name="numberOfPages"
                              type="number"
                              defaultValue={packageData.numberOfPages || ""}
                              placeholder="Örn: 5"
                              min="1"
                              className="w-full p-3 border rounded-xl dark:bg-[#171719] dark:border-white/10"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-2">
                              <label className="text-sm font-medium">
                                Min. Fiyat (₺)
                              </label>
                              <input
                                name="priceRangeMin"
                                type="number"
                                defaultValue={packageData.priceRangeMin || ""}
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
                                defaultValue={packageData.priceRangeMax || ""}
                                placeholder="15000"
                                min="0"
                                className="w-full p-3 border rounded-xl dark:bg-[#171719] dark:border-white/10"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-2">
                              <label className="text-sm font-medium">
                                Revizyon Hakkı
                              </label>
                              <input
                                name="revisionCount"
                                type="number"
                                defaultValue={packageData.revisionCount || ""}
                                placeholder="3"
                                min="0"
                                className="w-full p-3 border rounded-xl dark:bg-[#171719] dark:border-white/10"
                              />
                            </div>
                            <div className="flex flex-col gap-2">
                              <label className="text-sm font-medium">
                                Teslim Süresi (Gün)
                              </label>
                              <input
                                name="deliveryTimeInDays"
                                type="number"
                                defaultValue={
                                  packageData.deliveryTimeInDays || ""
                                }
                                placeholder="30"
                                min="1"
                                className="w-full p-3 border rounded-xl dark:bg-[#171719] dark:border-white/10"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t dark:border-white/10">
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                            Referans ve Görseller
                          </h3>

                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">
                              Referans Site URL&apos;leri
                            </label>
                            <textarea
                              name="referenceUrls"
                              defaultValue={packageData.referenceUrls.join(
                                "\n"
                              )}
                              placeholder="Her satıra bir URL yazın&#10;https://example.com&#10;https://example2.com"
                              className="w-full p-3 border rounded-xl h-20 text-sm dark:bg-[#171719] dark:border-white/10"
                            />
                            <p className="text-xs text-gray-500">
                              Beğendiğiniz site örneklerinin linklerini ekleyin
                            </p>
                          </div>

                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">
                              Görsel URL&apos;leri
                            </label>
                            <textarea
                              name="referenceImages"
                              defaultValue={packageData.referenceImages.join(
                                "\n"
                              )}
                              placeholder="Her satıra bir görsel URL'si yazın"
                              className="w-full p-3 border rounded-xl h-20 text-sm dark:bg-[#171719] dark:border-white/10"
                            />
                            <p className="text-xs text-gray-500">
                              Referans tasarım görsellerinin linklerini ekleyin
                            </p>
                          </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t dark:border-white/10">
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                            Özellikler ve Bakım
                          </h3>

                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">
                              Özellikler
                            </label>
                            <textarea
                              name="features"
                              defaultValue={packageData.features.join("\n")}
                              placeholder="Her satıra bir özellik yazın&#10;- Responsive tasarım&#10;- SEO optimizasyonu&#10;- İletişim formu"
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
                              defaultValue={packageData.optionalAddons.join(
                                "\n"
                              )}
                              placeholder="Her satıra bir eklenti yazın&#10;- E-ticaret modülü&#10;- Blog sistemi&#10;- Çoklu dil desteği"
                              className="w-full p-3 border rounded-xl h-24 dark:bg-[#171719] dark:border-white/10"
                            />
                          </div>

                          <div className="flex items-center gap-3 p-3 border rounded-xl dark:border-white/10">
                            <input
                              name="maintenanceRequired"
                              type="checkbox"
                              id="maintenance"
                              defaultChecked={packageData.maintenanceRequired}
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
                              defaultValue={packageData.maintenancePrice || ""}
                              placeholder="Örn: 500"
                              className="w-full p-3 border rounded-xl dark:bg-[#171719] dark:border-white/10"
                            />
                          </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t dark:border-white/10">
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                            Özel Notlar
                          </h3>

                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">
                              Ekstra İstekler ve Notlar
                            </label>
                            <textarea
                              name="specialNotes"
                              defaultValue={packageData.specialNotes || ""}
                              placeholder="Ekstra istekleriniz veya özel notlarınız varsa buraya yazabilirsiniz..."
                              className="w-full p-3 border rounded-xl h-24 dark:bg-[#171719] dark:border-white/10"
                            />
                          </div>

                          <div className="flex items-center gap-3 p-3 border rounded-xl dark:border-white/10 bg-blue-50 dark:bg-blue-950/20">
                            <input
                              name="isCustomRequest"
                              type="checkbox"
                              id="customRequest"
                              defaultChecked={packageData.isCustomRequest}
                              className="w-4 h-4"
                              value="true"
                            />
                            <label
                              htmlFor="customRequest"
                              className="text-sm font-medium"
                            >
                              Bu özel bir paket talebidir
                            </label>
                          </div>
                        </div>

                        <div className="flex gap-3 pt-6 bottom-0 pb-4 flex-shrink-0 sticky bottom-0 bg-white  dark:bg-[#17191a] z-20">
                          <Button
                            type="submit"
                            className="bg-[#171719] border border-white/10 dark:bg-[#131313] dark:hover:bg-[#171719] text-white px-6 py-3 rounded-xl hover:opacity-90 flex-1 font-medium"
                          >
                            Update Package
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsEditSheetOpen(false)}
                            className="border border-gray-300 dark:border-white/10 px-6 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-[#171719] flex-1 font-medium"
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </div>
                  </div>
                </SheetContent>
              </Sheet> */}
            </div>
          </div>

          <div className="flex w-full flex-col gap-y-4 pb-8">
            <div className="flex w-full flex-col divide-y divide-gray-200 rounded-xl border border-gray-200 bg-transparent p-0 dark:divide-gray-700 dark:border-[#313131] dark:bg-[#171719] md:rounded-3xl lg:rounded-4xl">
              <div className="flex flex-col gap-6 p-4 md:p-8">
                <div className="flex flex-col gap-4 md:gap-1">
                  <h3 className="text-md">Package Information</h3>
                  <div className="flex flex-col gap-4">
                    <div>
                      <h4 className="text-sm font-medium">
                        {packageData.name}
                      </h4>
                      <p className="text-sm text-green-600">
                        {formatPrice(packageData.price)}
                      </p>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium mb-2">Description</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {packageData.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex w-full flex-col divide-y divide-gray-200 rounded-xl border border-gray-200 bg-transparent p-0 dark:divide-gray-700 dark:border-[#313131] dark:bg-[#171719] md:rounded-3xl lg:rounded-4xl">
              <div className="flex flex-col gap-6 p-4 md:p-8">
                <div className="flex flex-col gap-4 md:gap-1">
                  <h3 className="text-md">Site Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium mb-1">
                        Number of Pages
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {packageData.numberOfPages || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Price Range</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {packageData.priceRangeMin && packageData.priceRangeMax
                          ? `${formatPrice(packageData.priceRangeMin)} - ${formatPrice(packageData.priceRangeMax)}`
                          : "Not specified"}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">
                        Revision Count
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {packageData.revisionCount || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">
                        Delivery Time
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {packageData.deliveryTimeInDays
                          ? `${packageData.deliveryTimeInDays} days`
                          : "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex w-full flex-col divide-y divide-gray-200 rounded-xl border border-gray-200 bg-transparent p-0 dark:divide-gray-700 dark:border-[#313131] dark:bg-[#171719] md:rounded-3xl lg:rounded-4xl">
              <div className="flex flex-col gap-6 p-4 md:p-8">
                <div className="flex flex-col gap-4 md:gap-1">
                  <h3 className="text-md">Features & Services</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Features</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {packageData.features.map((feature, index) => (
                          <li
                            key={index}
                            className="text-sm text-gray-600 dark:text-gray-400"
                          >
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {packageData.optionalAddons.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">
                          Optional Addons
                        </h4>
                        <ul className="list-disc list-inside space-y-1">
                          {packageData.optionalAddons.map((addon, index) => (
                            <li
                              key={index}
                              className="text-sm text-gray-600 dark:text-gray-400"
                            >
                              {addon}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-medium mb-1">
                        Maintenance Required
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {packageData.maintenanceRequired ? "Yes" : "No"}
                        {packageData.maintenanceRequired &&
                          packageData.maintenancePrice && (
                            <span className="ml-2">
                              -{" "}
                              {formatPrice(
                                parseFloat(packageData.maintenancePrice) / 100
                              )}
                              /month
                            </span>
                          )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {(packageData.referenceUrls.length > 0 ||
              packageData.referenceImages.length > 0) && (
              <div className="flex w-full flex-col divide-y divide-gray-200 rounded-xl border border-gray-200 bg-transparent p-0 dark:divide-gray-700 dark:border-[#313131] dark:bg-[#171719] md:rounded-3xl lg:rounded-4xl">
                <div className="flex flex-col gap-6 p-4 md:p-8">
                  <div className="flex flex-col gap-4 md:gap-1">
                    <h3 className="text-md">Reference Links</h3>
                    <div className="space-y-4">
                      {packageData.referenceUrls.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">
                            Reference URLs
                          </h4>
                          <ul className="space-y-1">
                            {packageData.referenceUrls.map((url, index) => (
                              <li key={index}>
                                <Link
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gray-800 hover:text-gray-600 dark:text-white/80 dark:hover:text-white"
                                >
                                  {url}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {validImageUrls.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-4">
                            Reference Images
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {validImageUrls.map((image, index) => (
                              <div
                                key={index}
                                className="group relative aspect-video overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                              >
                                <Image
                                  src={image}
                                  alt={`Reference ${index + 1}`}
                                  fill
                                  className="object-cover transition-transform group-hover:scale-105"
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                                <Link
                                  href={image}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/60 transition-colors group"
                                >
                                  <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium">
                                    View Full Size
                                  </span>
                                </Link>
                              </div>
                            ))}
                          </div>
                          {/* Image URLs Below */}
                          <div className="mt-4 space-y-1">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                              Image URLs:
                            </p>
                            {validImageUrls.map((image, index) => (
                              <p
                                key={index}
                                className="text-xs text-gray-600 dark:text-gray-400 truncate"
                              >
                                {index + 1}. {image}
                              </p>
                            ))}
                          </div>
                          {/* Show invalid URLs only in development mode */}
                          {process.env.NODE_ENV === "development" &&
                            packageData.referenceImages.length !==
                              validImageUrls.length && (
                              <div className="mt-4 p-2 bg-gray-100 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                                <details className="text-xs">
                                  <summary className="cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                                    ℹ️{" "}
                                    {packageData.referenceImages.length -
                                      validImageUrls.length}{" "}
                                    invalid URL(s) excluded
                                  </summary>
                                  <div className="mt-2 space-y-1 pl-4">
                                    {packageData.referenceImages
                                      .filter(
                                        (url) => !validImageUrls.includes(url)
                                      )
                                      .map((url, index) => (
                                        <p
                                          key={index}
                                          className="text-xs text-gray-600 dark:text-gray-400 truncate"
                                        >
                                          • {url}
                                        </p>
                                      ))}
                                  </div>
                                </details>
                              </div>
                            )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {packageData.specialNotes && (
              <div className="flex w-full flex-col divide-y divide-gray-200 rounded-xl border border-gray-200 bg-transparent p-0 dark:divide-gray-700 dark:border-[#313131] dark:bg-[#171719] md:rounded-3xl lg:rounded-4xl">
                <div className="flex flex-col gap-6 p-4 md:p-8">
                  <div className="flex flex-col gap-4 md:gap-1">
                    <h3 className="text-md">Special Notes</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-1">Notes</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {packageData.specialNotes}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-1">
                          Custom Request
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {packageData.isCustomRequest ? "Yes" : "No"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="hidden w-full max-w-[320px] overflow-y-auto rounded-none border-none bg-transparent md:block xl:max-w-[440px] dark:bg-transparent">
        <div className="flex h-full flex-col gap-2 overflow-y-auto">
          <div className="w-full rounded-xl border border-gray-200 bg-white p-6 dark:border-[#313131] dark:bg-[#171719] lg:rounded-2xl">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h3 className="text-md">Package Summary</h3>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Base Price
                    </span>
                    <span className="text-sm font-medium">
                      {formatPrice(packageData.price)}
                    </span>
                  </div>
                  {packageData.maintenanceRequired &&
                    packageData.maintenancePrice && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Monthly Maintenance
                        </span>
                        <span className="text-sm font-medium">
                          {formatPrice(
                            parseFloat(packageData.maintenancePrice) / 100
                          )}
                        </span>
                      </div>
                    )}
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-semibold">
                      <span className="text-sm">Total</span>
                      <span className="text-sm">
                        {formatPrice(packageData.price)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full rounded-xl border border-gray-200 bg-white p-6 dark:border-[#313131] dark:bg-[#171719] lg:rounded-2xl">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h3 className="text-md">Package Information</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Created
                    </span>
                    <p className="text-sm font-medium">
                      {formatDate(packageData.createdAt)}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Last Updated
                    </span>
                    <p className="text-sm font-medium">
                      {formatDate(packageData.updatedAt)}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Package ID
                    </span>
                    <p className="text-sm font-medium font-mono">
                      {packageData.id}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <div className="w-full rounded-xl border border-gray-200 bg-white p-6 dark:border-[#313131] dark:bg-[#171719] lg:rounded-2xl">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h3 className="text-md">Actions</h3>
                <div className="flex flex-col gap-3">
                  <button className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 dark:border-[#313131] dark:bg-[#171719] dark:text-white dark:hover:bg-gray-700">
                    Duplicate Package
                  </button>
                  <button className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 dark:border-[#313131] dark:bg-[#171719] dark:text-white dark:hover:bg-gray-700">
                    Export Configuration
                  </button>
                  <button className="w-full rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30">
                    Delete Package
                  </button>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
