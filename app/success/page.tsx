"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Logo from "@/components/Logo";
import { addonOptions, packageQuestions } from "@/utils/formSchema";
import { PACKAGES } from "@/utils/packages";

interface CustomerData {
  name?: string;
  email?: string;
  company?: string;
  phone?: string;
  businessField?: string[];
  packageAnswers?: Record<string, string | string[]>;
  additionalNotes?: string;
  projectRequirements?: string;
  selectedAddons?: string[];
}

interface SessionData {
  id: string;
  package: "Starter" | "Business" | "Ecommerce";
  amount: number;
  currency: string;
  status: string;
  customerData: CustomerData;
  created: number;
}

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sessionId) {
      console.log("🔍 Fetching session data for:", sessionId);
      fetch(`/api/session/${sessionId}`)
        .then((res) => {
          console.log("📡 Session API response status:", res.status);
          if (!res.ok) throw new Error(`API error: ${res.status}`);
          return res.json();
        })
        .then((data) => {
          console.log("📄 Session data received:", data);
          console.log("👤 CustomerData from API:", data.customerData);
          setSessionData(data);
          setError(null);
        })
        .catch((err) => {
          console.error("❌ Error fetching session:", err);
          setError("Failed to load order details. Please contact support.");
        });
    } else {
      console.log("❌ No session ID found in URL");
      setError("Invalid session. Please contact support.");
    }
  }, [sessionId]);

  const packageInfo = sessionData ? PACKAGES[sessionData.package] : null;
  const currentPackageQuestions = sessionData
    ? packageQuestions[sessionData.package as keyof typeof packageQuestions]
    : { questions: [] };

  if (error) {
    return (
      <div className="bg-white dark:bg-zinc-950 flex min-h-screen items-center justify-center p-6">
        <div className="flex flex-col mx-auto max-w-[360px] p-5 gap-12">
          <Logo width={40} height={50} />
          <div className="text-center">
            <h1 className="text-2xl font-medium text-black dark:text-white">
              Error
            </h1>
            <p className="text-sm text-muted-foreground">
              {error}{" "}
              <a href="mailto:support@moydus.com" className="underline">
                support@moydus.com
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-white dark:bg-zinc-950 items-center min-h-screen justify-center p-6">
      <div className="flex flex-col mx-auto max-w-[660px] p-5 gap-12">
        {/* Logo and Header */}
        <div className="flex flex-col gap-6 items-center justify-center">
          <Logo width={40} height={50} />
          <div className="flex flex-col gap-1 text-center">
            <h1 className="text-2xl font-medium leading-8 text-black dark:text-white">
              Congratulations! Your Order is Confirmed 🎉
            </h1>
            <p className="text-sm text-muted-foreground">
              Your payment was successful. Our team is preparing your website
              {sessionData?.customerData.company &&
                ` for ${sessionData.customerData.company}`}
              !
            </p>
          </div>
        </div>

        {/* Order Details */}
        {sessionData && (
          <div className="rounded-xl  border border-[#d1d1d1] dark:border-[#313131] bg-white dark:bg-zinc-950 p-6 space-y-3">
            <h3 className="font-semibold text-lg text-black dark:text-white mb-4 flex items-center">
              📋 Order Details
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="font-medium text-black dark:text-white">
                  Package:
                </span>
                <span className="text-black dark:text-white">
                  {sessionData.package} - {packageInfo?.name}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-black dark:text-white">
                  Amount:
                </span>
                <span className="font-bold text-black dark:text-white">
                  ${sessionData.amount}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-black dark:text-white">
                  Order ID:
                </span>
                <span className="text-white">{sessionId?.slice(0, 16)}...</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-black dark:text-white">
                  Date:
                </span>
                <span className="text-black dark:text-white">
                  {new Date(sessionData.created * 1000).toLocaleDateString(
                    "en-US"
                  )}
                </span>
              </div>

              {/* Company Information */}
              {(sessionData.customerData.company ||
                sessionData.customerData.phone) && (
                <div className="border-t pt-3">
                  <span className="font-medium text-black dark:text-white block mb-2">
                    Company Information:
                  </span>
                  <div className="text-sm space-y-1">
                    {sessionData.customerData.company && (
                      <div className="text-black dark:text-white">
                        <span className="font-medium">Company Name:</span>{" "}
                        {sessionData.customerData.company}
                      </div>
                    )}
                    {sessionData.customerData.phone && (
                      <div className="text-black dark:text-white">
                        <span className="font-medium dark:text-white">
                          Phone Number:
                        </span>{" "}
                        {sessionData.customerData.phone}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Business Fields */}
              {sessionData.customerData.businessField &&
                sessionData.customerData.businessField.length > 0 && (
                  <div className="border-t pt-3">
                    <span className="font-medium text-black dark:text-white block mb-2">
                      Business Fields:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {sessionData.customerData.businessField.map(
                        (field, idx) => (
                          <span
                            key={idx}
                            className="inline-block bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs"
                          >
                            {field}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* Package Answers */}
              {sessionData.customerData.packageAnswers &&
                Object.keys(sessionData.customerData.packageAnswers).length >
                  0 && (
                  <div className="border-t pt-3">
                    <span className="font-medium text-white block mb-2">
                      Selected Features:
                    </span>
                    <div className="space-y-2">
                      {Object.entries(
                        sessionData.customerData.packageAnswers
                      ).map(([questionId, answer]) => {
                        const question = currentPackageQuestions.questions.find(
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
                      })}
                    </div>
                  </div>
                )}

              {/* Additional Information */}
              {(sessionData.customerData.additionalNotes ||
                sessionData.customerData.projectRequirements) && (
                <div className="border-t pt-3">
                  <span className="font-medium text-white block mb-2">
                    Additional Information:
                  </span>
                  <div className="text-sm space-y-2">
                    {sessionData.customerData.additionalNotes && (
                      <div className="text-white">
                        <span className="font-medium">Additional Notes:</span>
                        <p className="ml-4 mt-1 text-gray-300 text-xs">
                          {sessionData.customerData.additionalNotes}
                        </p>
                      </div>
                    )}
                    {sessionData.customerData.projectRequirements && (
                      <div className="text-white">
                        <span className="font-medium">
                          Project Requirements:
                        </span>
                        <p className="ml-4 mt-1 text-gray-300 text-xs">
                          {sessionData.customerData.projectRequirements}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Add-ons */}
              {sessionData.customerData.selectedAddons &&
                sessionData.customerData.selectedAddons.length > 0 && (
                  <div className="border-t pt-3">
                    <span className="font-medium text-white block mb-2">
                      Selected Add-ons:
                    </span>
                    <div className="space-y-2">
                      {sessionData.customerData.selectedAddons.map(
                        (addonId, idx) => {
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
                        }
                      )}
                    </div>
                  </div>
                )}

              {/* Maintenance */}
              {packageInfo?.maintenanceRequired && (
                <div className="border-t pt-3 bg-green-50 -m-2 p-3 rounded-md">
                  <p className="text-sm text-green-800">
                    ✅ <strong>Monthly maintenance included:</strong>{" "}
                    {packageInfo.maintenancePrice}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Next Steps */}
        {/* <div className="rounded-xl border border-[#d1d1d1] dark:border-[#313131] bg-white dark:bg-zinc-950 p-6 space-y-4">
          <h3 className="font-semibold text-lg text-black dark:text-white">
            🚀 Next Steps
          </h3>
          <ul className="space-y-2 text-sm text-black dark:text-white">
            <li className="flex items-start">
              <span className="w-6 h-6 bg-[#292929] text-white dark:text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                1
              </span>
              We’ll send you detailed information via email within 2-3 minutes.
            </li>
            <li className="flex items-start">
              <span className="w-6 h-6 bg-[#292929] text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                2
              </span>
              Share your logo, content, and photos as needed.
            </li>
            <li className="flex items-start">
              <span className="w-6 h-6 bg-[#292929] text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                3
              </span>
              We’ll present design proposals within 2-3 business days.
            </li>
            <li className="flex items-start">
              <span className="w-6 h-6 bg-[#292929] text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                4
              </span>
              Your website will be ready in 7-10 business days!
            </li>
          </ul>
        </div> */}

        {/* Upsell Section */}
        <div className="rounded-xl border border-[#d1d1d1] dark:border-[#313131] bg-white dark:bg-zinc-950 p-5 space-y-4">
          <h3 className="font-semibold text-lg text-black dark:text-white">
            💡 Grow Your Business
          </h3>
          <p className="text-sm text-black dark:text-white">
            Enhance your website with these additional services to attract more
            customers.
          </p>
          <div className="grid grid-cols-1 gap-4 mt-6">
            <div className="rounded-xl border border-[#d1d1d1] dark:border-[#313131] bg-white dark:bg-zinc-950 p-6 flex flex-col justify-between">
              <div>
                <h4 className="font-semibold text-lg text-black dark:text-white mb-2">
                  🏥 CRM System
                </h4>
                <p className="text-sm text-gray-400">
                  Track your customers, manage appointments, and view treatment
                  history digitally.
                </p>
              </div>
              <Button
                asChild
                className="w-full mt-4 bg-[#292929] rounded-[10px] hover:bg-[#333] text-white dark:text-white"
              >
                <Link href="https://panelmanage.com" target="_blank">
                  Learn More
                </Link>
              </Button>
            </div>
            <div className="rounded-xl border bg-white dark:bg-zinc-950 rounded-[10px] border-[#fafafa0d] p-6 flex flex-col justify-between">
              <div>
                <h4 className="font-semibold text-lg text-black dark:text-white mb-2">
                  📱 Social Media Management
                </h4>
                <p className="text-sm text-gray-400">
                  Let us professionally manage your social media accounts for
                  organic growth.
                </p>
              </div>

              <Button
                asChild
                className="w-full mt-4 bg-orange-600 rounded-[10px] hover:bg-orange-700 text-white dark:text-white"
              >
                <Link href="https://agency.moydus.com" target="_blank">
                  Explore Growth Packages
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        {/* <div className="rounded-xl border bg-[#1c1c1c] border-[#313131] p-6">
          <h4 className="font-semibold text-white mb-3">📞 Contact Us</h4>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-sm">
            <a
              href="mailto:info@moydus.com"
              className="text-white hover:underline flex items-center"
            >
              <span className="mr-2">✉️</span>info@moydus.com
            </a>
            <a
              href="tel:+905555555555"
              className="text-white hover:underline flex items-center"
            >
              <span className="mr-2">📱</span>0555 555 55 55
            </a>
            <a
              href="https://wa.me/905555555555"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:underline flex items-center"
            >
              <span className="mr-2">💬</span>WhatsApp
            </a>
          </div>
        </div> */}

        {/* Footer */}
        <div className="text-sm text-black/50 dark:text-white/50 text-center">
          Have questions? Contact us to track your website’s progress.
          <br />
          By continuing, you agree to the{" "}
          <Link
            href="https://moydus.com/legal/terms-of-service"
            className="underline hover:text-white/70 hover:decoration-white/70"
            target="_blank"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="https://moydus.com/legal/privacy-policy"
            className="underline hover:dark:text-white/70 hover:dark:decoration-white/70"
            target="_blank"
          >
            Privacy Policy
          </Link>
          .
        </div>
        <div className="flex justify-center text-sm text-black/60 dark:text-white/60">
          Need help?{" "}
          <Link
            href="mailto:support@moydus.com"
            className="ml-1 text-green-400 hover:text-green-300"
          >
            Contact support
          </Link>
        </div>
        {/* Dashboard Link */}
        <Button
          asChild
          className={cn(
            "text-sm inline-flex items-center justify-center rounded-[10px] border px-2 min-w-[36px] h-9",
            // Light mode → siyah zemin, beyaz yazı
            // Dark mode → beyaz zemin, siyah yazı
            "bg-black text-white hover:bg-black/80",
            "dark:bg-white dark:text-black dark:hover:bg-gray-100",
            "transition-colors border-transparent"
          )}
        >
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>

        {/* Debug Info */}
        {process.env.NODE_ENV === "development" && (
          <div className="text-xs text-gray-400 bg-gray-800 p-2 rounded mt-4">
            <div>
              <strong>Session ID:</strong> {sessionId || "Not found"}
            </div>
            <div>
              <strong>Data Loaded:</strong> {sessionData ? "Yes" : "No"}
            </div>
            {sessionData && (
              <>
                <div>
                  <strong>Company Name:</strong>{" "}
                  {sessionData.customerData.company || "None"}
                </div>
                <div>
                  <strong>Phone:</strong>{" "}
                  {sessionData.customerData.phone || "None"}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
