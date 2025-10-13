// "use client";
// import { useState, useEffect, useTransition } from "react";
// import { motion } from "framer-motion";
// import { PACKAGES } from "@/utils/packages";
// import MoyFormEnglish from "@/components/Form/FormStep";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   saveOnboardingStep,
//   getOnboardingData,
//   clearOnboarding,
// } from "@/app/action/onboardingActions";
// import { BriefcaseBusiness, Building, ShoppingCart } from "lucide-react";
// import {
//   AlertDialog,
//   AlertDialogTrigger,
//   AlertDialogContent,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogCancel,
//   AlertDialogAction,
// } from "@/components/animate-ui/components/radix/alert-dialog";

// export default function Onboarding() {
//   const [isPending, startTransition] = useTransition();
//   const [activeCard, setActiveCard] = useState<string | null>(null);
//   const [showForm, setShowForm] = useState(false);
//   const [selectedPackage, setSelectedPackage] = useState<
//     "Starter" | "Business" | "Ecommerce" | null
//   >(null);
//   const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
//   const [totalPrice, setTotalPrice] = useState(0);

//   // Sayfa yüklenince localStorage'dan durumu al
//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const savedShowForm = localStorage.getItem("moy-form-show-form");
//       const savedPackage = localStorage.getItem("moy-form-selected-package");
//       if (savedShowForm === "true" && savedPackage) {
//         setShowForm(true);
//         setSelectedPackage(savedPackage as any);
//       }
//     }
//   }, []);

//   const handleAddonToggle = (addon: string, price: number) => {
//     setSelectedAddons((prev) => {
//       const isSelected = prev.includes(addon);
//       if (isSelected) {
//         setTotalPrice((prev) => prev - price);
//         return prev.filter((item) => item !== addon);
//       } else {
//         setTotalPrice((prev) => prev + price);
//         return [...prev, addon];
//       }
//     });
//   };

//   const extractAddonPrice = (addon: string): number => {
//     const match = addon.match(/\+\$(\d+)/);
//     return match ? parseInt(match[1]) : 0;
//   };

//   const extractAddonId = (addon: string): string => {
//     const parts = addon.split("|");
//     return parts[0] || "";
//   };

//   const extractAddonDisplayName = (addon: string): string => {
//     const parts = addon.split("|");
//     return parts[1] || addon;
//   };

//   const proceedToForm = async () => {
//     if (!activeCard) return;
//     const packageName = activeCard as "Starter" | "Business" | "Ecommerce";

//     startTransition(async () => {
//       await saveOnboardingStep(2, {
//         selectedPackage: packageName,
//         selectedAddons,
//         totalPrice,
//       });

//       setSelectedPackage(packageName);
//       setShowForm(true);

//       if (typeof window !== "undefined") {
//         localStorage.setItem("moy-form-selected-package", packageName);
//         localStorage.setItem("moy-form-show-form", "true");
//       }
//     });
//   };

//   const handleBackToPackages = async () => {
//     setShowForm(false);
//     setSelectedPackage(null);
//     setActiveCard(null);
//     setSelectedAddons([]);
//     setTotalPrice(0);

//     if (typeof window !== "undefined") {
//       localStorage.removeItem("moy-form-selected-package");
//       localStorage.removeItem("moy-form-show-form");
//       localStorage.removeItem("moy-form-current-step");
//       localStorage.removeItem("moy-form-data");
//     }

//     await clearOnboarding();
//   };

//   const cards = [
//     {
//       id: "Starter",
//       title: "Starter Website",
//       desc: "Corporate showcase website - Professional look and basic functionality",
//       price: "$1,500",
//       icon: <Building />,
//     },
//     {
//       id: "Business",
//       title: "Business Website",
//       desc: "Advanced features and customized design for your business website",
//       price: "$2,500",
//       icon: <BriefcaseBusiness />,
//     },
//     {
//       id: "Ecommerce",
//       title: "E-commerce Website",
//       desc: "Fully-featured e-commerce site - Sales and customer management",
//       price: "$3,500+",
//       icon: <ShoppingCart />,
//     },
//   ];

//   return (
//     <div className="w-full flex flex-col items-center justify-center min-h-[400px]">
//       {/* Paket Seçim Alanı */}
//       {!showForm && !activeCard && (
//         <div className="flex flex-col gap-4 w-full">
//           <div className="text-center mb-4">
//             <h1 className="text-2xl font-bold text-white mb-2">
//               Choose Your Package
//             </h1>
//             <p className="text-gray-400 text-sm">
//               Select the package that best fits your needs
//             </p>
//           </div>
//           {cards.map((card) => (
//             <button
//               key={card.id}
//               onClick={() => setActiveCard(card.id)}
//               className="w-full max-w-[420px] mx-auto flex items-center justify-between px-8 py-4 rounded-xl border transition-all duration-200 bg-[#1c1c1c] border-[#fafafa0d] hover:bg-[#292929] transform hover:scale-[1.01]"
//             >
//               <div className="flex items-center gap-4">
//                 <div className="h-12 w-12 rounded-full border-2 border-[#FF4D00] bg-[#FF4D00] flex items-center justify-center shadow-lg shadow-[#FF4D00]">
//                   <div className="w-6 h-6 text-white flex items-center justify-center">
//                     {card.icon}
//                   </div>
//                 </div>
//                 <div className="flex flex-col text-left">
//                   <p className="text-white font-semibold text-lg">
//                     {card.title}
//                   </p>
//                   <p className="text-gray-400 text-sm">{card.desc}</p>
//                 </div>
//               </div>
//               <div className="text-right">
//                 <p className="text-white font-bold text-lg">{card.price}</p>
//                 <p className="text-gray-400 text-xs">one-time</p>
//               </div>
//             </button>
//           ))}
//         </div>
//       )}

//       {/* Form alanı */}
//       {showForm && selectedPackage && (
//         <div className="w-full">
//           <MoyFormEnglish
//             selectedPackage={selectedPackage}
//             selectedAddons={selectedAddons}
//             onBack={handleBackToPackages}
//           />
//         </div>
//       )}

//       {/* Paket detayları */}
//       {activeCard &&
//         !showForm &&
//         (() => {
//           const packageData = PACKAGES[activeCard as keyof typeof PACKAGES];
//           const selectedCard = cards.find((card) => card.id === activeCard);

//           return (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.3 }}
//               className="w-full max-w-6xl mx-auto rounded-xl p-4 border bg-[#171717] border-[#fafafa0d]"
//             >
//               <button
//                 onClick={() => setActiveCard(null)}
//                 className="text-gray-400 text-sm mb-4 hover:text-white transition-all duration-200 flex items-center gap-1 hover:gap-2"
//               >
//                 <span>←</span> Go back
//               </button>

//               <div className="text-center">
//                 <h2 className="text-xl font-bold text-white mb-2">
//                   {packageData.name}
//                 </h2>
//                 <div className="text-2xl font-bold text-[#FF4D00] mb-2">
//                   {selectedCard?.price} one-time
//                 </div>
//                 <p className="text-gray-400 text-sm">
//                   {packageData.description}
//                 </p>
//               </div>

//               <div className="bg-[#1a1a1a] p-4 rounded-lg mt-4">
//                 <div className="flex flex-col md:flex-row gap-6">
//                   <div className="flex-1">
//                     <h4 className="font-semibold mb-3 text-white">
//                       Package includes:
//                     </h4>
//                     <ul className="space-y-2 text-sm">
//                       {packageData.features.map((feature, idx) => (
//                         <li
//                           key={idx}
//                           className="text-gray-300 flex items-start gap-2"
//                         >
//                           <span className="text-green-500 mt-0.5">✓</span>
//                           <span>{feature.replace("✔️ ", "")}</span>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>

//                   {/* Add-ons */}
//                   {packageData.optionalAddons && (
//                     <div className="flex-1 pt-4 md:pt-0 md:border-l md:pl-6 border-gray-700">
//                       <h4 className="font-semibold mb-3 text-yellow-400">
//                         Optional Add-ons:
//                       </h4>
//                       <div className="space-y-3 text-sm">
//                         {packageData.optionalAddons.map((addon, idx) => {
//                           const addonPrice = extractAddonPrice(addon);
//                           const addonId = extractAddonId(addon);
//                           const displayName = extractAddonDisplayName(addon);
//                           const isSelected = selectedAddons.includes(addonId);
//                           return (
//                             <div
//                               key={idx}
//                               className="flex items-start gap-3 p-2 rounded hover:bg-gray-800/50 transition-colors"
//                             >
//                               <Checkbox
//                                 id={`addon-${idx}`}
//                                 checked={isSelected}
//                                 onCheckedChange={() =>
//                                   handleAddonToggle(addonId, addonPrice)
//                                 }
//                                 className="mt-0.5"
//                               />
//                               <label
//                                 htmlFor={`addon-${idx}`}
//                                 className={`cursor-pointer flex-1 ${isSelected ? "text-yellow-400" : "text-gray-400"}`}
//                               >
//                                 {displayName}
//                               </label>
//                             </div>
//                           );
//                         })}
//                       </div>

//                       {selectedAddons.length > 0 && (
//                         <div className="mt-4 pt-3 border-t border-yellow-400/20 bg-yellow-400/10 rounded p-3">
//                           <p className="text-yellow-400 font-semibold text-sm">
//                             Selected Add-ons: +${totalPrice}
//                           </p>
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Devam Et Butonu */}
//               <AlertDialog>
//                 <AlertDialogTrigger asChild>
//                   <button className="w-full mt-6 rounded-lg py-3 px-6 font-semibold cursor-pointer bg-gradient-to-b from-white/10 to-white/5 border border-black shadow-[inset_0_1px_2px_rgba(255,255,255,0.25)] text-white hover:from-white/15 hover:to-white/10 transition-all duration-200">
//                     Choose {packageData.name}
//                   </button>
//                 </AlertDialogTrigger>
//                 <AlertDialogContent
//                   from="bottom"
//                   className="sm:max-w-[455px] bg-[#171717] border-none"
//                 >
//                   <AlertDialogHeader>
//                     <AlertDialogTitle className="text-white">
//                       Ready to proceed?
//                     </AlertDialogTitle>
//                     <AlertDialogDescription>
//                       {selectedAddons.length > 0 ? (
//                         <>
//                           You have selected {selectedAddons.length} add-on(s)
//                           for an additional ${totalPrice}.<br />
//                           <br />
//                           <strong>
//                             Total:{" "}
//                             {packageData.priceRange || `$${packageData.price}`}{" "}
//                             + ${totalPrice} add-ons
//                           </strong>
//                         </>
//                       ) : (
//                         <>
//                           You haven't selected any add-ons.
//                           <br />
//                           <br />
//                           <strong>
//                             Current total:{" "}
//                             {packageData.priceRange || `$${packageData.price}`}
//                           </strong>
//                         </>
//                       )}
//                     </AlertDialogDescription>
//                   </AlertDialogHeader>
//                   <AlertDialogFooter>
//                     <AlertDialogCancel>Go back</AlertDialogCancel>
//                     <AlertDialogAction
//                       onClick={proceedToForm}
//                       className="text-white bg-gradient-to-b from-white/10 to-white/5 border border-black shadow-[inset_0_1px_2px_0_rgba(255,255,255,0.25)]"
//                     >
//                       Continue
//                     </AlertDialogAction>
//                   </AlertDialogFooter>
//                 </AlertDialogContent>
//               </AlertDialog>
//             </motion.div>
//           );
//         })()}
//     </div>
//   );
// }

// components/Onboarding.tsx
"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for client-side navigation
import { motion } from "framer-motion";
import { PACKAGES } from "@/utils/packages";
import { Checkbox } from "@/components/ui/checkbox";
import {
  saveOnboardingStep,
  clearOnboarding,
} from "@/app/action/onboardingActions";
import { BriefcaseBusiness, Building, ShoppingCart } from "lucide-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/animate-ui/components/radix/alert-dialog";
import { Button } from "./ui/button";

export default function Onboarding() {
  const [isPending, startTransition] = useTransition();
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isNewProject, setIsNewProject] = useState(false);
  const router = useRouter(); // Initialize useRouter

  // Check if this is a new project from dashboard (for display purposes only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      setIsNewProject(urlParams.get("new") === "true");
    }
  }, []);

  // Load initial state from localStorage - disabled to always show package selection
  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const savedShowForm = localStorage.getItem("moy-form-show-form");
  //     const savedPackage = localStorage.getItem("moy-form-selected-package");
  //     const isNewSession = localStorage.getItem("moy-form-new-session");

  //     // Only redirect if form was started AND it's not a new session (after email verification)
  //     if (savedShowForm === "true" && savedPackage && !isNewSession) {
  //       // If form was previously started, redirect to the first step
  //       router.push("/onboarding/step-one");
  //     } else if (isNewSession) {
  //       // Clear the new session flag after first load
  //       localStorage.removeItem("moy-form-new-session");
  //     }
  //   }
  // }, [router]);

  const handleAddonToggle = (addon: string, price: number) => {
    setSelectedAddons((prev) => {
      const isSelected = prev.includes(addon);
      if (isSelected) {
        setTotalPrice((prev) => prev - price);
        return prev.filter((item) => item !== addon);
      } else {
        setTotalPrice((prev) => prev + price);
        return [...prev, addon];
      }
    });
  };

  const extractAddonPrice = (addon: string): number => {
    const match = addon.match(/\+\$(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  const extractAddonId = (addon: string): string => {
    const parts = addon.split("|");
    return parts[0] || "";
  };

  const extractAddonDisplayName = (addon: string): string => {
    const parts = addon.split("|");
    return parts[1] || addon;
  };

  const proceedToForm = () => {
    if (!activeCard) return;
    const packageName = activeCard as "Starter" | "Business" | "Ecommerce";

    startTransition(async () => {
      // Save package selection and add-ons to the server
      await saveOnboardingStep(1, {
        selectedPackage: packageName,
        selectedAddons,
        totalPrice,
      });

      // Save to localStorage for persistence
      if (typeof window !== "undefined") {
        localStorage.setItem("moy-form-selected-package", packageName);
        localStorage.setItem("moy-form-show-form", "true");

        // Save addons to localStorage
        const formData = {
          selectedPackage: packageName,
          selectedAddons: selectedAddons,
          ...JSON.parse(localStorage.getItem("moy-form-data") || "{}"),
        };
        localStorage.setItem("moy-form-data", JSON.stringify(formData));
      }

      // Redirect to the first step (preserve new=true parameter if present)
      const redirectUrl = isNewProject
        ? "/onboarding/step-one?new=true"
        : "/onboarding/step-one";
      router.push(redirectUrl);
    });
  };

  const handleBackToPackages = async () => {
    setActiveCard(null);
    setSelectedAddons([]);
    setTotalPrice(0);

    if (typeof window !== "undefined") {
      localStorage.removeItem("moy-form-selected-package");
      localStorage.removeItem("moy-form-show-form");
      localStorage.removeItem("moy-form-current-step");
      localStorage.removeItem("moy-form-data");
    }

    await clearOnboarding();
  };

  const cards = [
    {
      id: "Starter",
      title: "Starter Website",
      desc: "Corporate showcase website - Professional look and basic functionality",
      price: "$1,500",
      icon: <Building />,
    },
    {
      id: "Business",
      title: "Business Website",
      desc: "Advanced features and customized design for your business website",
      price: "$2,500",
      icon: <BriefcaseBusiness />,
    },
    {
      id: "Ecommerce",
      title: "E-commerce Website",
      desc: "Fully-featured e-commerce site - Sales and customer management",
      price: "$3,500+",
      icon: <ShoppingCart />,
    },
  ];

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[400px] p-2 ">
      {/* Package Selection */}
      {!activeCard && (
        <div className="flex flex-col gap-4 w-full">
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold text-black dark:text-white mb-2">
              {isNewProject
                ? "Yeni Proje İçin Paket Seçin"
                : "Choose Your Package"}
            </h1>
            <p className="text-gray-400 dark:text-white/50 text-sm">
              {isNewProject
                ? "Mevcut müşterimiz olarak yeni bir proje başlatıyorsunuz"
                : "Select the package that best fits your needs"}
            </p>
          </div>
          {cards.map((card) => (
            <button
              key={card.id}
              onClick={() => setActiveCard(card.id)}
              className="w-full max-w-[420px] mx-auto flex items-center justify-between px-8 py-4 rounded-xl border transition-all duration-200 dark:bg-zinc-950 dark:border-white/10 opacity-100 dark:opacity-100 transform hover:scale-[1.01]"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full border-2 border-[#FF4D00] bg-[#FF4D00] flex items-center justify-center shadow-lg shadow-[#FF4D00]">
                  <div className="w-6 h-6 text-white dark:text-white flex items-center justify-center">
                    {card.icon}
                  </div>
                </div>
                <div className="flex flex-col text-left">
                  <p className="text-black dark:text-white font-semibold text-lg">
                    {card.title}
                  </p>
                  <p className="text-gray-400 text-sm">{card.desc}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-black dark:text-white font-bold text-lg">
                  {card.price}
                </p>
                <p className="text-gray-400 text-xs">one-time</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Package Details and Add-ons */}
      {activeCard && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-6xl mx-auto rounded-xl p-4  bg-white dark:bg-zinc-950  "
        >
          <button
            onClick={() => setActiveCard(null)}
            className="text-gray-400 text-sm mb-4 hover:text-white transition-all duration-200 flex items-center gap-1 hover:gap-2"
          >
            <span>←</span> Go back
          </button>

          <div className="text-center">
            <h2 className="text-xl font-bold text-black dark:text-white mb-2">
              {PACKAGES[activeCard as keyof typeof PACKAGES].name}
            </h2>
            <div className="text-2xl font-bold text-[#FF4D00] mb-2">
              {cards.find((card) => card.id === activeCard)?.price} one-time
            </div>
            <p className="text-gray-400 text-sm">
              {PACKAGES[activeCard as keyof typeof PACKAGES].description}
            </p>
          </div>

          <div className="dark:bg-zinc-950 bg-white border p-4 rounded-lg mt-4">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <h4 className="font-semibold mb-3 text-black dark:text-white">
                  Package includes:
                </h4>
                <ul className="space-y-2 text-sm">
                  {PACKAGES[activeCard as keyof typeof PACKAGES].features.map(
                    (feature, idx) => (
                      <li
                        key={idx}
                        className="text-gray-500 dark:text-white/50 flex items-start gap-2"
                      >
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span>{feature.replace("✔️ ", "")}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>

              {/* Add-ons */}
              {PACKAGES[activeCard as keyof typeof PACKAGES].optionalAddons && (
                <div className="flex-1 pt-4 md:pt-0 md:border-l md:pl-6 border-gray-700">
                  <h4 className="font-semibold mb-3 text-[#FF4D00] dark:text-[#FF4D00]">
                    Optional Add-ons:
                  </h4>
                  <div className="space-y-1 text-sm">
                    {PACKAGES[
                      activeCard as keyof typeof PACKAGES
                    ].optionalAddons!.map((addon, idx) => {
                      const addonPrice = extractAddonPrice(addon);
                      const addonId = extractAddonId(addon);
                      const displayName = extractAddonDisplayName(addon);
                      const isSelected = selectedAddons.includes(addonId);
                      return (
                        <div
                          key={idx}
                          className="flex items-start gap-3 p-2 rounded hover:bg-opacity-50 dark:hover:bg-opacity-50 transition-colors"
                        >
                          <Checkbox
                            id={`addon-${idx}`}
                            checked={isSelected}
                            onCheckedChange={() =>
                              handleAddonToggle(addonId, addonPrice)
                            }
                            className="mt-0.5"
                          />
                          <label
                            htmlFor={`addon-${idx}`}
                            className={`cursor-pointer flex-1 ${isSelected ? "text-[#FF4D00]" : "text-gray-400"} rounded-[10px]`}
                          >
                            {displayName}
                          </label>
                        </div>
                      );
                    })}
                  </div>

                  {selectedAddons.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-[#FF4D00]/20 bg-[#FF4D00]/10 rounded-[10px] p-3">
                      <p className="text-[#FF4D00] font-semibold text-sm">
                        Selected Add-ons: +${totalPrice}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Continue Button */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="w-full mt-6 text-white dark:text-white bg-zinc-950  rounded-lg py-3 px-6 font-semibold cursor-pointer border transition-all duration-200">
                Choose {PACKAGES[activeCard as keyof typeof PACKAGES].name}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent
              from="bottom"
              className="sm:max-w-[455px] bg-white dark:bg-zinc-950 border-none"
            >
              <AlertDialogHeader>
                <AlertDialogTitle className="text-black dark:text-white">
                  Ready to proceed?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {selectedAddons.length > 0 ? (
                    <>
                      You have selected {selectedAddons.length} add-on(s) for an
                      additional ${totalPrice}.<br />
                      <br />
                      <strong>
                        Total:{" "}
                        {PACKAGES[activeCard as keyof typeof PACKAGES]
                          .priceRange ||
                          `$${PACKAGES[activeCard as keyof typeof PACKAGES].price}`}
                        {" + "}${totalPrice} add-ons
                      </strong>
                    </>
                  ) : (
                    <>
                      You haven't selected any add-ons.
                      <br />
                      <br />
                      <strong>
                        Current total:{" "}
                        {PACKAGES[activeCard as keyof typeof PACKAGES]
                          .priceRange ||
                          `$${PACKAGES[activeCard as keyof typeof PACKAGES].price}`}
                      </strong>
                    </>
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Go back</AlertDialogCancel>
                <AlertDialogAction
                  onClick={proceedToForm}
                  className="text-white bg-zinc-950 dark:bg-zinc-950 border border-black shadow-[inset_0_1px_2px_0_rgba(255,255,255,0.25)]"
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </motion.div>
      )}
    </div>
  );
}
