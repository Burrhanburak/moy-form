"use client";

import { useSearchParams } from "next/navigation";
import MoyFormEnglish from "@/components/Form/FormStep";

export default function PackageParams() {
  const searchParams = useSearchParams();
  const selectedPackage = searchParams.get("package") as "Starter" | "Business" | "Ecommerce" || "Starter"; 

  return (
    <main className="flexitems-center justify-center ">
      <div className="w-full max-w-2xl">
        <MoyFormEnglish selectedPackage={selectedPackage} />
      </div>
    </main>
  );
}
