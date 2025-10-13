"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { JsonValue } from "@prisma/client/runtime/library";
import InvoicePDF from "@/components/InvoicePDF";

interface SubscriptionDetailClientProps {
  subscription: {
    id: string;
    customer: string;
    customerEmail: string;
    status:
      | string
      | "ACTIVE"
      | "CANCELED"
      | "INCOMPLETE"
      | "INCOMPLETE_EXPIRED"
      | "PAST_DUE"
      | "TRIALING"
      | "UNPAID";
    subscriptionDate: Date;
    renewalDate: Date | null;
    product: string;
    productDescription: string;
    stripeSubscriptionId: string | null;
    cancelAtPeriodEnd: boolean;
    trialEnd: Date | null;
    trialStart: Date | null;
    canceledAt: Date | null;
    amount: number;
    currency: string;
    interval: string;

    // Business Information
    packageName: string | null;
    businessField: string[];
    domainName?: string | null;
    hasDomain?: string | null;
    socialMediaAccounts: string[];
    packageAnswers?: JsonValue;
  };
}

export default function SubscriptionDetailClient({
  subscription,
}: SubscriptionDetailClientProps) {
  const [isInvoiceSheetOpen, setIsInvoiceSheetOpen] = useState(false);
  const [billingInfo, setBillingInfo] = useState({
    billingName: "",
    line1: "",
    line2: "",
    postalCode: "",
    city: "",
    state: "",
    country: "Turkey",
  });

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-emerald-100 text-emerald-500 dark:bg-emerald-950";
      case "canceled":
        return "bg-red-100 text-red-500 dark:bg-red-950";
      case "trialing":
        return "bg-blue-100 text-blue-500 dark:bg-blue-950";
      case "past_due":
        return "bg-yellow-100 text-yellow-500 dark:bg-yellow-950";
      case "incomplete":
        return "bg-orange-100 text-orange-500 dark:bg-orange-950";
      case "unpaid":
        return "bg-red-100 text-red-500 dark:bg-red-950";
      default:
        return "bg-gray-100 text-gray-500 dark:bg-gray-950";
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "Active";
      case "canceled":
        return "Canceled";
      case "trialing":
        return "Trialing";
      case "past_due":
        return "Past Due";
      case "incomplete":
        return "Incomplete";
      case "unpaid":
        return "Unpaid";
      default:
        return status;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleBillingInfoChange = (field: string, value: string) => {
    setBillingInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleInvoiceDownloadComplete = () => {
    setBillingInfo({
      billingName: "",
      line1: "",
      line2: "",
      postalCode: "",
      city: "",
      state: "",
      country: "Turkey",
    });
    setIsInvoiceSheetOpen(false);
  };

  // handleGenerateInvoice function removed - now using PDF component

  const formatPrice = (amount: number, currency?: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: (currency || "usd").toUpperCase(),
    }).format(amount);
  };

  return (
    <div className="flex h-full w-full flex-row gap-x-2 p-4">
      <div className="flex w-full flex-col items-center rounded-2xl border bg-white px-4 md:overflow-y-auto md:border md:bg-white md:px-8 dark:border-[#313131] dark:bg-[#171719]">
        <div className="flex h-full w-full flex-col max-w-7xl">
          <div className="flex w-full flex-col gap-y-4 py-8 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-4">
              <div className="flex flex-row items-center gap-4">
                <Link
                  href="/dashboard/subscriptions"
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  <ArrowLeft size={20} />
                  Back to Subscriptions
                </Link>
              </div>
              <div className="flex flex-row items-center gap-4">
                <h2 className="text-xl font-normal">Subscription</h2>
                <div
                  className={`rounded-md px-2.5 py-1 text-sm ${getStatusBadge(subscription.status)}`}
                >
                  {getStatusText(subscription.status)}
                  {subscription.cancelAtPeriodEnd && " (Canceling)"}
                </div>
              </div>
            </div>
            <Sheet
              open={isInvoiceSheetOpen}
              onOpenChange={setIsInvoiceSheetOpen}
            >
              <SheetTrigger asChild>
                <button className="flex items-center justify-center rounded-xl border border-white/10 bg-[#171719s] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 focus:outline-none focus:ring-0 focus:ring-gray-500 focus:ring-offset-0">
                  <div className="flex flex-row items-center">
                    Download Invoice
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
                <div className="p-8 h-full">
                  <SheetHeader className="mb-6">
                    <SheetTitle>Billing Information</SheetTitle>
                  </SheetHeader>
                  <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-12rem)] pr-3">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="billingName">Billing name</label>
                        <input
                          id="billingName"
                          value={billingInfo.billingName}
                          onChange={(e) =>
                            handleBillingInfoChange(
                              "billingName",
                              e.target.value
                            )
                          }
                          placeholder="Billing name"
                          className="w-full p-3 border rounded-xl dark:bg-[#171719] dark:border-white/10"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="line1">Billing address - Line 1</label>
                        <input
                          id="line1"
                          value={billingInfo.line1}
                          onChange={(e) =>
                            handleBillingInfoChange("line1", e.target.value)
                          }
                          placeholder="Billing address - Line 1"
                          className="w-full p-3 border rounded-xl dark:bg-[#171719] dark:border-white/10"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="line2">Line 2</label>
                        <input
                          id="line2"
                          value={billingInfo.line2}
                          onChange={(e) =>
                            handleBillingInfoChange("line2", e.target.value)
                          }
                          placeholder="Address line 2"
                          className="w-full p-3 border rounded-xl dark:bg-[#171719] dark:border-white/10"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <label htmlFor="postalCode">Postal code</label>
                          <input
                            id="postalCode"
                            value={billingInfo.postalCode}
                            onChange={(e) =>
                              handleBillingInfoChange(
                                "postalCode",
                                e.target.value
                              )
                            }
                            placeholder="Postal code"
                            className="w-full p-3 border rounded-xl dark:bg-[#171719] dark:border-white/10"
                          />
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="city">City</label>
                          <input
                            id="city"
                            value={billingInfo.city}
                            onChange={(e) =>
                              handleBillingInfoChange("city", e.target.value)
                            }
                            placeholder="City"
                            className="w-full p-3 border rounded-xl dark:bg-[#171719] dark:border-white/10"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="state">State / Province</label>
                        <input
                          id="state"
                          value={billingInfo.state}
                          onChange={(e) =>
                            handleBillingInfoChange("state", e.target.value)
                          }
                          placeholder="State / Province"
                          className="w-full p-3 border rounded-xl dark:bg-[#171719] dark:border-white/10"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="country">Country</label>
                        <input
                          id="country"
                          value={billingInfo.country}
                          onChange={(e) =>
                            handleBillingInfoChange("country", e.target.value)
                          }
                          placeholder="Country"
                          className="w-full p-3 border rounded-xl dark:bg-[#171719] dark:border-white/10"
                        />
                      </div>

                      <div className="flex gap-3 pt-6 bottom-0 pb-4">
                        <InvoicePDF
                          subscription={{
                            stripeSubscriptionId:
                              subscription.stripeSubscriptionId,
                            customer: subscription.customer,
                            customerEmail: subscription.customerEmail,
                            product: subscription.product,
                            amount: subscription.amount,
                            currency: subscription.currency,
                            renewalDate: subscription.renewalDate,
                            subscriptionDate: subscription.subscriptionDate,
                          }}
                          billingInfo={billingInfo}
                          onDownloadComplete={handleInvoiceDownloadComplete}
                        />
                        <Button
                          variant="outline"
                          onClick={() => setIsInvoiceSheetOpen(false)}
                          className="border border-gray-300 dark:border-white/10 px-6 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-[#171719] flex-1 font-medium"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex w-full flex-col gap-y-12 pb-8">
            {/* Subscription Details */}
            <div className="flex w-full flex-col divide-y divide-[#313131] rounded-xl border bg-transparent p-0 dark:divide-gray-700 dark:border-[#313131] dark:bg-[#171719] md:rounded-3xl lg:rounded-4xl">
              <div className="flex flex-col gap-6 p-4 md:p-8">
                <div className="flex flex-col gap-4 md:gap-1">
                  <div className="flex flex-col text-sm md:flex-row md:items-baseline md:justify-between md:gap-4">
                    <h3 className="flex-1 text-gray-500 dark:text-gray-500">
                      Subscription ID
                    </h3>
                    <span className="group flex flex-1 flex-row items-center justify-between gap-x-2 rounded-md transition-colors duration-75 hover:bg-gray-100 md:px-2.5 md:py-1 dark:hover:bg-gray-800">
                      {subscription.stripeSubscriptionId?.slice(-8) || "N/A"}
                    </span>
                  </div>
                  <div className="flex flex-col text-sm md:flex-row md:items-baseline md:justify-between md:gap-4">
                    <h3 className="flex-1 text-gray-500 dark:text-gray-500">
                      Internal ID
                    </h3>
                    <span className="group flex flex-1 flex-row items-center justify-between gap-x-2 rounded-md font-mono text-sm transition-colors duration-75 hover:bg-gray-100 md:px-2.5 md:py-1 dark:hover:bg-gray-800">
                      {subscription.id}
                    </span>
                  </div>
                  <div className="flex flex-col text-sm md:flex-row md:items-baseline md:justify-between md:gap-4">
                    <h3 className="flex-1 text-gray-500 dark:text-gray-500">
                      Subscription Date
                    </h3>
                    <span className="group flex flex-1 flex-row items-center justify-between gap-x-2 rounded-md transition-colors duration-75 hover:bg-gray-100 md:px-2.5 md:py-1 dark:hover:bg-gray-800">
                      {formatDate(subscription.subscriptionDate)}
                    </span>
                  </div>
                  <div className="flex flex-col text-sm md:flex-row md:items-baseline md:justify-between md:gap-4">
                    <h3 className="flex-1 text-gray-500 dark:text-gray-500">
                      Status
                    </h3>
                    <span className="group flex flex-1 flex-row items-center justify-between gap-x-2 rounded-md transition-colors duration-75 hover:bg-gray-100 md:px-2.5 md:py-1 dark:hover:bg-gray-800">
                      <div
                        className={`w-fit rounded-md px-2.5 py-1 text-sm ${getStatusBadge(subscription.status)}`}
                      >
                        {getStatusText(subscription.status)}
                        {subscription.cancelAtPeriodEnd && " (Canceling)"}
                      </div>
                    </span>
                  </div>
                  <div className="flex flex-col text-sm md:flex-row md:items-baseline md:justify-between md:gap-4">
                    <h3 className="flex-1 text-gray-500 dark:text-gray-500">
                      Billing Reason
                    </h3>
                    <span className="group flex flex-1 flex-row items-center justify-between gap-x-2 rounded-md capitalize transition-colors duration-75 hover:bg-gray-100 md:px-2.5 md:py-1 dark:hover:bg-gray-800">
                      subscription
                    </span>
                  </div>
                  <div className="my-4 h-px bg-gray-300 dark:bg-gray-700"></div>

                  {/* Package Details */}
                  <div className="flex flex-col gap-y-6 pb-4">
                    <div className="flex flex-col text-sm md:flex-row md:items-baseline md:justify-between md:gap-4">
                      <h3 className="flex-1 text-gray-500 dark:text-gray-500">
                        {subscription.packageName || subscription.product}
                      </h3>
                      <span className="group flex flex-1 flex-row items-center justify-between gap-x-2 rounded-md transition-colors duration-75 hover:bg-gray-100 md:px-2.5 md:py-1 dark:hover:bg-gray-800">
                        {formatPrice(
                          subscription.amount,
                          subscription.currency
                        )}
                        /{subscription.interval}
                      </span>
                    </div>
                    {subscription.productDescription && (
                      <div className="flex flex-col text-sm md:flex-row md:items-baseline md:justify-between md:gap-4">
                        <h3 className="flex-1 text-gray-500 dark:text-gray-500">
                          Description
                        </h3>
                        <span className="group flex flex-1 flex-row items-center justify-between gap-x-2 rounded-md transition-colors duration-75 hover:bg-gray-100 md:px-2.5 md:py-1 dark:hover:bg-gray-800">
                          {subscription.productDescription}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col text-sm md:flex-row md:items-baseline md:justify-between md:gap-4">
                    <h3 className="flex-1 text-gray-500 dark:text-gray-500">
                      Next Billing Date
                    </h3>
                    <span className="group flex flex-1 flex-row items-center justify-between gap-x-2 rounded-md transition-colors duration-75 hover:bg-gray-100 md:px-2.5 md:py-1 dark:hover:bg-gray-800">
                      {subscription.renewalDate
                        ? formatDate(subscription.renewalDate)
                        : "N/A (One-time payment)"}
                    </span>
                  </div>
                  <div className="flex flex-col text-sm md:flex-row md:items-baseline md:justify-between md:gap-4">
                    <h3 className="flex-1 text-gray-500 dark:text-gray-500">
                      Discount
                    </h3>
                    <span className="group flex flex-1 flex-row items-center justify-between gap-x-2 rounded-md transition-colors duration-75 hover:bg-gray-100 md:px-2.5 md:py-1 dark:hover:bg-gray-800">
                      —
                    </span>
                  </div>
                  <div className="flex flex-col text-sm md:flex-row md:items-baseline md:justify-between md:gap-4">
                    <h3 className="flex-1 text-gray-500 dark:text-gray-500">
                      Net amount
                    </h3>
                    <span className="group flex flex-1 flex-row items-center justify-between gap-x-2 rounded-md transition-colors duration-75 hover:bg-gray-100 md:px-2.5 md:py-1 dark:hover:bg-gray-800">
                      {formatPrice(subscription.amount, subscription.currency)}
                    </span>
                  </div>
                  <div className="flex flex-col text-sm md:flex-row md:items-baseline md:justify-between md:gap-4">
                    <h3 className="flex-1 text-gray-500 dark:text-gray-500">
                      Tax
                    </h3>
                    <span className="group flex flex-1 flex-row items-center justify-between gap-x-2 rounded-md transition-colors duration-75 hover:bg-gray-100 md:px-2.5 md:py-1 dark:hover:bg-gray-800">
                      $0.00
                    </span>
                  </div>
                  <div className="flex flex-col text-sm md:flex-row md:items-baseline md:justify-between md:gap-4">
                    <h3 className="flex-1 text-gray-500 dark:text-gray-500">
                      Total
                    </h3>
                    <span className="group flex flex-1 flex-row items-center justify-between gap-x-2 rounded-md transition-colors duration-75 hover:bg-gray-100 md:px-2.5 md:py-1 dark:hover:bg-gray-800">
                      {formatPrice(subscription.amount, subscription.currency)}
                    </span>
                  </div>
                  <div className="my-4 h-px bg-gray-300 dark:bg-gray-700"></div>

                  {/* Customer Info */}
                  <div className="flex flex-col text-sm md:flex-row md:items-baseline md:justify-between md:gap-4">
                    <h3 className="flex-1 text-gray-500 dark:text-gray-500">
                      Customer Name
                    </h3>
                    <span className="group flex flex-1 flex-row items-center justify-between gap-x-2 rounded-md transition-colors duration-75 hover:bg-gray-100 md:px-2.5 md:py-1 dark:hover:bg-gray-800">
                      {subscription.customer || "N/A"}
                    </span>
                  </div>
                  <div className="flex flex-col text-sm md:flex-row md:items-baseline md:justify-between md:gap-4">
                    <h3 className="flex-1 text-gray-500 dark:text-gray-500">
                      Email
                    </h3>
                    <span className="group flex flex-1 flex-row items-center justify-between gap-x-2 rounded-md transition-colors duration-75 hover:bg-gray-100 md:px-2.5 md:py-1 dark:hover:bg-gray-800">
                      {subscription.customerEmail || "N/A"}
                    </span>
                  </div>
                  <div className="flex flex-col text-sm md:flex-row md:items-baseline md:justify-between md:gap-4">
                    <h3 className="flex-1 text-gray-500 dark:text-gray-500">
                      Business Field
                    </h3>
                    <span className="group flex flex-1 flex-row items-center justify-between gap-x-2 rounded-md transition-colors duration-75 hover:bg-gray-100 md:px-2.5 md:py-1 dark:hover:bg-gray-800">
                      {subscription.businessField.join(", ") || "N/A"}
                    </span>
                  </div>
                  {subscription.hasDomain && (
                    <div className="flex flex-col text-sm md:flex-row md:items-baseline md:justify-between md:gap-4">
                      <h3 className="flex-1 text-gray-500 dark:text-gray-500">
                        Has Domain
                      </h3>
                      <span className="group flex flex-1 flex-row items-center justify-between gap-x-2 rounded-md transition-colors duration-75 hover:bg-gray-100 md:px-2.5 md:py-1 dark:hover:bg-gray-800">
                        {subscription.hasDomain}
                      </span>
                    </div>
                  )}
                  {subscription.domainName && (
                    <div className="flex flex-col text-sm md:flex-row md:items-baseline md:justify-between md:gap-4">
                      <h3 className="flex-1 text-gray-500 dark:text-gray-500">
                        Domain Name
                      </h3>
                      <span className="group flex flex-1 flex-row items-center justify-between gap-x-2 rounded-md transition-colors duration-75 hover:bg-gray-100 md:px-2.5 md:py-1 dark:hover:bg-gray-800">
                        {subscription.domainName}
                      </span>
                    </div>
                  )}
                  {subscription.socialMediaAccounts &&
                    subscription.socialMediaAccounts.length > 0 && (
                      <div className="flex flex-col text-sm md:flex-row md:items-baseline md:justify-between md:gap-4">
                        <h3 className="flex-1 text-gray-500 dark:text-gray-500">
                          Social Media Accounts
                        </h3>
                        <span className="group flex flex-1 flex-row items-center justify-between gap-x-2 rounded-md transition-colors duration-75 hover:bg-gray-100 md:px-2.5 md:py-1 dark:hover:bg-gray-800">
                          {subscription.socialMediaAccounts.join(", ")}
                        </span>
                      </div>
                    )}
                </div>
              </div>

              {/* Trial Information */}
              {subscription.trialStart && subscription.trialEnd && (
                <div className="flex flex-col gap-6 p-8">
                  <h3 className="text-lg">Trial Information</h3>
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col text-sm md:flex-row md:items-baseline md:justify-between md:gap-4">
                      <h3 className="flex-1 text-gray-500 dark:text-gray-500">
                        Trial Start
                      </h3>
                      <span className="group flex flex-1 flex-row items-center justify-between gap-x-2 rounded-md transition-colors duration-75 hover:bg-gray-100 md:px-2.5 md:py-1 dark:hover:bg-gray-800">
                        {formatDate(subscription.trialStart)}
                      </span>
                    </div>
                    <div className="flex flex-col text-sm md:flex-row md:items-baseline md:justify-between md:gap-4">
                      <h3 className="flex-1 text-gray-500 dark:text-gray-500">
                        Trial End
                      </h3>
                      <span className="group flex flex-1 flex-row items-center justify-between gap-x-2 rounded-md transition-colors duration-75 hover:bg-gray-100 md:px-2.5 md:py-1 dark:hover:bg-gray-800">
                        {formatDate(subscription.trialEnd)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Cancellation Information */}
              {subscription.canceledAt && (
                <div className="flex flex-col gap-6 p-8">
                  <h3 className="text-lg">Cancellation Information</h3>
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col text-sm md:flex-row md:items-baseline md:justify-between md:gap-4">
                      <h3 className="flex-1 text-gray-500 dark:text-gray-500">
                        Canceled At
                      </h3>
                      <span className="group flex flex-1 flex-row items-center justify-between gap-x-2 rounded-md transition-colors duration-75 hover:bg-gray-100 md:px-2.5 md:py-1 dark:hover:bg-gray-800">
                        {formatDate(subscription.canceledAt)}
                      </span>
                    </div>
                    <div className="flex flex-col text-sm md:flex-row md:items-baseline md:justify-between md:gap-4">
                      <h3 className="flex-1 text-gray-500 dark:text-gray-500">
                        Cancel at Period End
                      </h3>
                      <span className="group flex flex-1 flex-row items-center justify-between gap-x-2 rounded-md transition-colors duration-75 hover:bg-gray-100 md:px-2.5 md:py-1 dark:hover:bg-gray-800">
                        {subscription.cancelAtPeriodEnd ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Payment History */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-row items-center justify-between gap-x-8">
                <div className="flex flex-row items-center justify-between gap-x-6">
                  <h3 className="text-lg">Payment History</h3>
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <div className="overflow-hidden rounded-2xl border dark:border-[#313131]">
                  <div className="relative w-full overflow-auto">
                    <table className="w-full table-fixed text-sm">
                      <thead className="border-b dark:bg-[#171719]">
                        <tr className="transition-colors">
                          <th
                            className="h-12 px-4 text-left font-medium text-gray-500 dark:text-gray-400"
                            style={{ width: "150px" }}
                          >
                            Date
                          </th>
                          <th
                            className="h-12 px-4 text-left font-medium text-gray-500 dark:text-gray-400"
                            style={{ width: "150px" }}
                          >
                            Amount
                          </th>
                          <th
                            className="h-12 px-4 text-left font-medium text-gray-500 dark:text-gray-400"
                            style={{ width: "150px" }}
                          >
                            Status
                          </th>
                          <th
                            className="h-12 px-4 text-left font-medium text-gray-500 dark:text-gray-400"
                            style={{ width: "150px" }}
                          >
                            Invoice
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-[#313131]">
                        <tr className="transition-colors">
                          <td className="p-4" style={{ width: "150px" }}>
                            {formatDate(subscription.subscriptionDate)}
                          </td>
                          <td className="p-4" style={{ width: "150px" }}>
                            {formatPrice(
                              subscription.amount,
                              subscription.currency
                            )}
                          </td>
                          <td className="p-4" style={{ width: "150px" }}>
                            <div
                              className={`w-fit rounded-md px-2.5 py-1 text-sm ${getStatusBadge(subscription.status)}`}
                            >
                              {getStatusText(subscription.status)}
                            </div>
                          </td>
                          <td className="p-4" style={{ width: "150px" }}>
                            <InvoicePDF
                              subscription={{
                                stripeSubscriptionId:
                                  subscription.stripeSubscriptionId,
                                customer: subscription.customer,
                                customerEmail: subscription.customerEmail,
                                product: subscription.product,
                                amount: subscription.amount,
                                currency: subscription.currency,
                                renewalDate: subscription.renewalDate,
                                subscriptionDate: subscription.subscriptionDate,
                              }}
                              billingInfo={billingInfo}
                              onDownloadComplete={handleInvoiceDownloadComplete}
                            />
                            <button className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"></button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Sidebar */}
      <div className="hidden w-full max-w-[320px] overflow-y-auto rounded-none border-none bg-transparent md:block xl:max-w-[440px] dark:bg-transparent">
        <div className="flex h-full flex-col gap-2 overflow-y-auto">
          <div className="w-full rounded-xl  bg-white p-6 border  border-gray-200 dark:border-[#313131]  dark:bg-[#171719] lg:rounded-2xl">
            <div className="flex flex-row items-center gap-4">
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-[#313131] bg-gray-50 text-sm dark:border-[#313131] dark:bg-[#171719]">
                <div className="absolute inset-0 flex items-center justify-center bg-transparent">
                  <span>
                    {subscription.customer
                      ? subscription.customer.charAt(0).toUpperCase()
                      : "U"}
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <p>{subscription.customer || "Unknown Customer"}</p>
                <div className="flex flex-row items-center gap-1 text-sm text-gray-500 dark:text-gray-500">
                  {subscription.customerEmail || "No email"}
                </div>
              </div>
            </div>
            <div className="flex flex-row justify-between gap-4 mt-4">
              <div className="flex flex-1 flex-col gap-1 rounded-lg bg-gray-100 px-4 py-3 text-sm dark:bg-[#313131]">
                <span className="text-gray-500 dark:text-gray-500">
                  Monthly Revenue
                </span>
                <span>
                  <div className="flex flex-row items-baseline gap-x-1">
                    {formatPrice(subscription.amount, subscription.currency)}
                  </div>
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-1 rounded-lg bg-gray-100 px-4 py-3 text-sm dark:bg-[#313131]">
                <span className="text-gray-500 dark:text-gray-500">
                  Next Billing
                </span>
                <span>
                  {subscription.renewalDate
                    ? formatDate(subscription.renewalDate)
                    : "N/A"}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-4 mt-4">
              <div className="gap-4">
                <a
                  href={`mailto:${subscription.customerEmail}`}
                  className="w-1/2 text-blue-500 dark:text-blue-400"
                >
                  <button className="flex w-full items-center justify-center rounded-2xl border border-black/10 bg-gray-100 px-5 py-4 text-sm font-medium text-black transition-colors  dark:border-white/10 dark:bg-[#313131] dark:text-white ">
                    <div className=" items-center">Send Email</div>
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
