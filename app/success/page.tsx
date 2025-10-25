import Link from "next/link";
import Logo from "@/components/Logo";
import { BadgeCheck } from "lucide-react";
import { stripe } from "@/lib/stripe";
import { Button } from "@/components/ui/button";
import { OfferCard } from "@/components/offer-card";
import { FieldSeparator } from "@/components/ui/field";

interface SessionData {
  id: string;
  package: "Starter" | "Business" | "Ecommerce";
  amount: number;
  currency: string;
  status: string;
  customerData: {
    name?: string;
    email?: string;
    company?: string;
  };
  created: number;
}

interface SuccessPageProps {
  searchParams: {
    session_id?: string;
  };
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const sessionId = searchParams.session_id;

  if (!sessionId) {
    return (
      <div className="bg-white dark:bg-zinc-950 flex min-h-screen items-center justify-center p-6">
        <div className="flex flex-col mx-auto max-w-[360px] p-5 gap-12">
          <Logo width={40} height={50} />
          <div className="text-center">
            <h1 className="text-2xl font-medium text-black dark:text-white">
              Error
            </h1>
            <p className="text-sm text-muted-foreground">
              Invalid session. Please contact{" "}
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

  let sessionData: SessionData | null = null;
  let error: string | null = null;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });

    if (session.metadata) {
      sessionData = {
        id: session.id,
        package: session.metadata.package as
          | "Starter"
          | "Business"
          | "Ecommerce",
        amount: (session.amount_total || 0) / 100,
        currency: session.currency || "usd",
        status: session.status || "unknown",
        customerData: {
          name: session.metadata.name,
          email: session.metadata.email,
          company: session.metadata.company,
        },
        created: session.created,
      };
    }
  } catch (err) {
    console.error("❌ Error fetching session:", err);
    error = "Failed to load order details. Please contact support.";
  }

  if (error || !sessionData) {
    return (
      <div className="bg-white dark:bg-zinc-950 flex min-h-screen items-center justify-center p-6">
        <div className="flex flex-col mx-auto max-w-[360px] p-5 gap-12">
          <Logo width={40} height={50} />
          <div className="text-center">
            <h1 className="text-2xl font-medium text-black dark:text-white">
              Error
            </h1>
            <p className="text-sm text-muted-foreground">
              {error || "Session not found"}{" "}
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
    <main className="bg-white dark:bg-zinc-950 flex min-h-screen items-center justify-center p-6">
      <div className="flex flex-col mx-auto max-w-[480px] gap-8">
        {/* Logo and Header */}
        <div className="flex flex-col gap-6 items-center justify-center text-center space-y-4">
          {/* <Logo width={40} height={50} /> */}
          <div className="flex flex-col gap-3 items-center">
            <div className="flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-[10px]">
              <BadgeCheck className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl font-semibold text-black dark:text-white">
              Payment Successful!
            </h1>
            <p className="text-lg text-muted-foreground">
              Your order has been confirmed
              {sessionData?.customerData.company &&
                ` for ${sessionData.customerData.company}`}
            </p>
            <p className="text-sm text-muted-foreground">
              Our team will start working on your website and contact you soon.
            </p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="rounded-[10px] border dark:border-[#313131] bg-white dark:bg-zinc-950 p-4">
          <h3 className="font-semibold text-lg text-black dark:text-white mb-4">
            📋 Order Summary
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Package:</span>
              <span className="font-medium text-black dark:text-white">
                {sessionData.package}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Amount:</span>
              <span className="font-bold text-black dark:text-white text-lg">
                ${sessionData.amount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Order ID:</span>
              <span className="text-black dark:text-white font-mono text-xs">
                {sessionId.slice(0, 20)}...
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Date:</span>
              <span className="text-black dark:text-white">
                {new Date(sessionData.created * 1000).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <FieldSeparator />
        {/* Offer Card */}
        <div className="flex justify-center">
          <OfferCard />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <Button
            asChild
            className="w-full bg-green-600 hover:bg-green-700 text-white rounded-[10px]"
          >
            <Link href="/dashboard/orders">View Order Details</Link>
          </Button>
          <Button asChild variant="outline" className="w-full rounded-[10px]">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center space-y-3">
          <div className="text-sm text-muted-foreground">
            Questions? Contact{" "}
            <Link
              href="mailto:support@moydus.com"
              className="text-green-600 hover:text-green-700 underline"
            >
              support@moydus.com
            </Link>
          </div>
          <div className="text-xs text-muted-foreground">
            By continuing, you agree to our{" "}
            <Link
              href="https://moydus.com/legal/terms-of-service"
              className="underline hover:text-muted-foreground/70"
              target="_blank"
            >
              Terms
            </Link>{" "}
            and{" "}
            <Link
              href="https://moydus.com/legal/privacy-policy"
              className="underline hover:text-muted-foreground/70"
              target="_blank"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
