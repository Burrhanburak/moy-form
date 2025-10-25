"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function CancelContent() {
  const searchParams = useSearchParams();
  const source = searchParams.get("source");
  const packageId = searchParams.get("packageId");

  const [returnUrl, setReturnUrl] = useState("/dashboard");
  const [returnText, setReturnText] = useState("Dashboard'a Dön");
  const [deletingPackage, setDeletingPackage] = useState(false);

  useEffect(() => {
    // Determine return URL based on source
    if (source === "custom_package") {
      setReturnUrl("/dashboard/benefits/create-package");
      setReturnText("Paket Oluşturmaya Dön");
    } else if (source === "custom_tools") {
      setReturnUrl("/dashboard/benefits/create-tools");
      setReturnText("Araç Oluşturmaya Dön");
    } else if (source === "onboarding") {
      setReturnUrl("/onboarding");
      setReturnText("Forma Geri Dön");
    }

    // Delete PENDING package if exists
    if (packageId && source === "custom_package") {
      setDeletingPackage(true);
      fetch(`/api/packages/${packageId}`, {
        method: "DELETE",
      })
        .then(() => {
          console.log("✅ PENDING package deleted:", packageId);
        })
        .catch((error) => {
          console.error("❌ Error deleting package:", error);
        })
        .finally(() => {
          setDeletingPackage(false);
        });
    }
  }, [source, packageId]);

  return (
    <main className="flex min-h-screen items-center justify-center p-6 bg-white dark:bg-zinc-950 to-orange-50">
      <div className="max-w-lg w-full bg-white dark:bg-zinc-950 p-8 text-center space-y-6">
        {/* Cancel Header */}
        <div className="space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <span className="text-2xl">❌</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Ödeme İptal Edildi
          </h1>
          <p className="text-lg text-gray-600 dark:text-white">
            Ödeme işleminiz iptal edildi. Herhangi bir ücret tahsil
            edilmemiştir.
          </p>
          {deletingPackage && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Taslak paket temizleniyor...
            </p>
          )}
        </div>

        {/* Info Section */}
        <div className="bg-yellow-50 dark:bg-zinc-950 p-6 rounded-xl dark:border dark:border-white/10">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
            💡 Sorun mu yaşadınız?
          </h3>
          <p className="text-sm text-gray-600 dark:text-white mb-4">
            Ödeme sırasında teknik bir sorun yaşadıysanız bize ulaşın. Size
            yardımcı olmaktan mutluluk duyarız.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="mailto:info@moydus.com"
              className="text-blue-600 hover:underline text-sm flex items-center justify-center dark:text-white dark:hover:text-white"
            >
              <span className="mr-2">✉️</span>info@moydus.com
            </a>
            <a
              href="tel:+905555555555"
              className="text-blue-600 hover:underline text-sm flex items-center justify-center dark:text-white dark:hover:text-white"
            >
              <span className="mr-2">📱</span>0555 555 55 55
            </a>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button
            asChild
            className="w-full bg-black dark:bg-white text-white dark:text-black rounded-md"
          >
            <Link href={returnUrl}>{returnText}</Link>
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-white">
              veya ana sayfamıza göz atın
            </p>
            <Link
              href="https://moydus.com"
              className="text-blue-600 hover:underline text-sm dark:text-white dark:hover:text-white"
              target="_blank"
            >
              moydus.com
            </Link>
          </div>
        </div>

        {/* Support Info */}
        <div className="bg-gray-50 dark:bg-zinc-950 p-4 rounded-xl">
          <p className="text-xs text-gray-500">
            Sorularınız için bize ulaşabilirsiniz. Size en iyi hizmeti sunmak
            için buradayız.
          </p>
        </div>
      </div>
    </main>
  );
}

export default function CancelPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CancelContent />
    </Suspense>
  );
}
