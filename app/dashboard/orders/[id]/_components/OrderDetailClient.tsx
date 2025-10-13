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

interface OrderDetailClientProps {
  order: {
    id: string;
    orderNumber: string;
    packageName: string;
    selectedAddons: string[];
    projectDescription?: string | null;
    specialRequirements?: string | null;
    exampleSites?: string | null;
    additionalNotes?: string | null;
    packagePrice: number;
    addOnsPrice: number;
    totalPrice: number;
    status: string;
    createdAt: Date;
    stripeSessionId?: string | null;
    customerName?: string | null;
    formEmail?: string | null;
    companyName?: string | null;
    businessField: string[];
    hasDomain?: string | null;
    domainName?: string | null;
    hasSocialMedia?: string | null;
    socialMediaAccounts: string[];
    packageAnswers?: Record<string, unknown>;
  };
}

export default function OrderDetailClient({ order }: OrderDetailClientProps) {
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
      case "paid":
      case "completed":
        return "bg-emerald-100 text-emerald-500 dark:bg-emerald-950";
      case "processing":
        return "bg-blue-100 text-blue-500 dark:bg-blue-950";
      case "pending_payment":
      case "pending":
        return "bg-yellow-100 text-yellow-500 dark:bg-yellow-950";
      case "canceled":
        return "bg-red-100 text-red-500 dark:bg-red-950";
      case "failed":
        return "bg-red-100 text-red-500 dark:bg-red-950";
      default:
        return "bg-gray-100 text-gray-500 dark:bg-gray-950";
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
      case "completed":
        return "Paid";
      case "processing":
        return "Processing";
      case "pending_payment":
      case "pending":
        return "Pending";
      case "canceled":
        return "Canceled";
      case "failed":
        return "Failed";
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

  const handleGenerateInvoice = () => {
    // Burada invoice generation logic'i olacak
    console.log("Generating invoice with billing info:", billingInfo);
    // Şimdilik sadece sheet'i kapat
    setIsInvoiceSheetOpen(false);
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="flex h-full w-full flex-row gap-x-2 p-4">
      <div className="flex w-full flex-col items-center rounded-2xl border  bg-white px-4 md:overflow-y-auto md:border md:bg-white md:px-8 dark:boder-[#313131] dark:bg-[#171719]">
        <div className="flex h-full w-full flex-col max-w-7xl">
          <div className="flex w-full flex-col gap-y-4 py-8 md:flex-row md:items-center md:justify-between">
            <h4 className="text-2xl font-medium text-gray-900 dark:text-white">
              <div className="flex flex-col gap-4">
                <div className="flex flex-row items-center gap-4">
                  <h2 className="text-xl font-normal">Order</h2>
                  <div
                    className={`rounded-md px-2.5 py-1 text-sm ${getStatusBadge(order.status)}`}
                  >
                    {getStatusText(order.status)}
                  </div>
                </div>
              </div>
            </h4>
            <Sheet
              open={isInvoiceSheetOpen}
              onOpenChange={setIsInvoiceSheetOpen}
            >
              <SheetTrigger asChild>
                <button className="flex items-center justify-center rounded-xl border border-white/10 bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
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
                <div className="p-8 h-full flex flex-col">
                  <SheetHeader className="mb-6 flex-shrink-0">
                    <SheetTitle>Billing Information</SheetTitle>
                  </SheetHeader>
                  <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-12rem)] pr-3">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="billingName">Billing name</Label>
                        <Input
                          id="billingName"
                          value={billingInfo.billingName}
                          onChange={(e) =>
                            handleBillingInfoChange(
                              "billingName",
                              e.target.value
                            )
                          }
                          placeholder="deneme burak"
                          className="w-full p-3 border rounded-xl dark:bg-[#171719] dark:border-white/10"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="line1">Billing address - Line 1</Label>
                        <Input
                          id="line1"
                          value={billingInfo.line1}
                          onChange={(e) =>
                            handleBillingInfoChange("line1", e.target.value)
                          }
                          placeholder="Address line 1"
                          className="w-full p-3 border rounded-xl dark:bg-[#171719] dark:border-white/10"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="line2">Line 2</Label>
                        <Input
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
                          <Label htmlFor="postalCode">Postal code</Label>
                          <Input
                            id="postalCode"
                            value={billingInfo.postalCode}
                            onChange={(e) =>
                              handleBillingInfoChange(
                                "postalCode",
                                e.target.value
                              )
                            }
                            placeholder="34000"
                            className="w-full p-3 border rounded-xl dark:bg-[#171719] dark:border-white/10"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            value={billingInfo.city}
                            onChange={(e) =>
                              handleBillingInfoChange("city", e.target.value)
                            }
                            placeholder="Istanbul"
                            className="w-full p-3 border rounded-xl dark:bg-[#171719] dark:border-white/10"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="state">State / Province</Label>
                        <Input
                          id="state"
                          value={billingInfo.state}
                          onChange={(e) =>
                            handleBillingInfoChange("state", e.target.value)
                          }
                          placeholder="Istanbul"
                          className="w-full p-3 border rounded-xl dark:bg-[#171719] dark:border-white/10"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          value={billingInfo.country}
                          onChange={(e) =>
                            handleBillingInfoChange("country", e.target.value)
                          }
                          placeholder="Turkey"
                          className="w-full p-3 border rounded-xl dark:bg-[#171719] dark:border-white/10"
                        />
                      </div>

                      <div className="flex gap-3 pt-6 bottom-0 pb-4">
                        <Button
                          onClick={handleGenerateInvoice}
                          className="bg-[#171719] border border-white/10 dark:bg-[#131313] dark:hover:bg-[#171719] text-white px-6 py-3 rounded-xl hover:opacity-90 flex-1 font-medium"
                        >
                          Generate invoice
                        </Button>
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
            {/* Order Details */}
            <div className="flex w-full flex-col divide-y divide-[#313131] rounded-xl border  bg-transparent p-0 dark:divide-gray-700 dark:border-[#313131] dark:bg-[#171719] md:rounded-3xl lg:rounded-4xl">
              <div className="flex flex-col gap-6 p-4 md:p-8">
                <div className="flex flex-col gap-4 md:gap-1">
                  <div className="flex flex-col text-sm md:flex-row md:items-baseline md:justify-between md:gap-4">
                    <h3 className="flex-1 text-gray-500 dark:text-gray-500">
                      Invoice number
                    </h3>
                    <span className="group flex flex-1 flex-row items-center justify-between gap-x-2 rounded-md transition-colors duration-75 hover:bg-gray-100 md:px-2.5 md:py-1 dark:hover:bg-gray-800">
                      {order.stripeSessionId?.slice(-8) || "N/A"}
                    </span>
                  </div>
                  <div className="flex flex-col text-sm md:flex-row md:items-baseline md:justify-between md:gap-4">
                    <h3 className="flex-1 text-gray-500 dark:text-gray-500">
                      Order ID
                    </h3>
                    <span className="group flex flex-1 flex-row items-center justify-between gap-x-2 rounded-md font-mono text-sm transition-colors duration-75 hover:bg-gray-100 md:px-2.5 md:py-1 dark:hover:bg-gray-800">
                      {order.id}
                    </span>
                  </div>
                  <div className="flex flex-col text-sm md:flex-row md:items-baseline md:justify-between md:gap-4">
                    <h3 className="flex-1 text-gray-500 dark:text-gray-500">
                      Order Date
                    </h3>
                    <span className="group flex flex-1 flex-row items-center justify-between gap-x-2 rounded-md transition-colors duration-75 hover:bg-gray-100 md:px-2.5 md:py-1 dark:hover:bg-gray-800">
                      {formatDate(order.createdAt)}
                    </span>
                  </div>
                  <div className="flex flex-col text-sm md:flex-row md:items-baseline md:justify-between md:gap-4">
                    <h3 className="flex-1 text-gray-500 dark:text-gray-500">
                      Status
                    </h3>
                    <span className="group flex flex-1 flex-row items-center justify-between gap-x-2 rounded-md transition-colors duration-75 hover:bg-gray-100 md:px-2.5 md:py-1 dark:hover:bg-gray-800">
                      <div
                        className={`w-fit rounded-md px-2.5 py-1 text-sm ${getStatusBadge(order.status)}`}
                      >
                        {getStatusText(order.status)}
                      </div>
                    </span>
                  </div>
                  <div className="flex flex-col text-sm md:flex-row md:items-baseline md:justify-between md:gap-4">
                    <h3 className="flex-1 text-gray-500 dark:text-gray-500">
                      Billing Reason
                    </h3>
                    <span className="group flex flex-1 flex-row items-center justify-between gap-x-2 rounded-md capitalize transition-colors duration-75 hover:bg-gray-100 md:px-2.5 md:py-1 dark:hover:bg-gray-800">
                      purchase
                    </span>
                  </div>
                  <div className="my-4 h-px bg-gray-300 dark:bg-gray-700"></div>

                  {/* Package Details */}
                  <div className="flex flex-col gap-y-6 pb-4">
                    <div className="flex flex-col text-sm md:flex-row md:items-baseline md:justify-between md:gap-4">
                      <h3 className="flex-1 text-gray-500 dark:text-gray-500">
                        {order.packageName}
                      </h3>
                      <span className="group flex flex-1 flex-row items-center justify-between gap-x-2 rounded-md transition-colors duration-75 hover:bg-gray-100 md:px-2.5 md:py-1 dark:hover:bg-gray-800">
                        {formatPrice(order.packagePrice)}
                      </span>
                    </div>
                    {order.selectedAddons &&
                      order.selectedAddons.length > 0 && (
                        <div className="flex flex-col gap-y-2">
                          <div className="flex flex-col text-sm md:flex-row md:items-baseline md:justify-between md:gap-4">
                            <h3 className="flex-1 text-gray-500 dark:text-gray-500">
                              Add-ons
                            </h3>
                            <span className="group flex flex-1 flex-row items-center justify-between gap-x-2 rounded-md transition-colors duration-75 hover:bg-gray-100 md:px-2.5 md:py-1 dark:hover:bg-gray-800">
                              {formatPrice(order.addOnsPrice)}
                            </span>
                          </div>
                          {/* List each addon */}
                          <div className="ml-4 space-y-1">
                            {order.selectedAddons.map((addon, index) => (
                              <div
                                key={index}
                                className="text-xs text-gray-400 dark:text-gray-500"
                              >
                                • {addon}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>

                  <div className="flex flex-col text-sm md:flex-row md:items-baseline md:justify-between md:gap-4">
                    <h3 className="flex-1 text-gray-500 dark:text-gray-500">
                      Subtotal
                    </h3>
                    <span className="group flex flex-1 flex-row items-center justify-between gap-x-2 rounded-md transition-colors duration-75 hover:bg-gray-100 md:px-2.5 md:py-1 dark:hover:bg-gray-800">
                      {formatPrice(order.packagePrice + order.addOnsPrice)}
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
                      {formatPrice(order.totalPrice)}
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
                      {formatPrice(order.totalPrice)}
                    </span>
                  </div>
                  <div className="my-4 h-px bg-gray-300 dark:bg-gray-700"></div>

                  {/* Customer Info */}
                  <div className="flex flex-col text-sm md:flex-row md:items-baseline md:justify-between md:gap-4">
                    <h3 className="flex-1 text-gray-500 dark:text-gray-500">
                      Customer Name
                    </h3>
                    <span className="group flex flex-1 flex-row items-center justify-between gap-x-2 rounded-md transition-colors duration-75 hover:bg-gray-100 md:px-2.5 md:py-1 dark:hover:bg-gray-800">
                      {order.customerName || "N/A"}
                    </span>
                  </div>
                  <div className="flex flex-col text-sm md:flex-row md:items-baseline md:justify-between md:gap-4">
                    <h3 className="flex-1 text-gray-500 dark:text-gray-500">
                      Email
                    </h3>
                    <span className="group flex flex-1 flex-row items-center justify-between gap-x-2 rounded-md transition-colors duration-75 hover:bg-gray-100 md:px-2.5 md:py-1 dark:hover:bg-gray-800">
                      {order.formEmail || "N/A"}
                    </span>
                  </div>
                  {order.companyName && (
                    <div className="flex flex-col text-sm md:flex-row md:items-baseline md:justify-between md:gap-4">
                      <h3 className="flex-1 text-gray-500 dark:text-gray-500">
                        Company
                      </h3>
                      <span className="group flex flex-1 flex-row items-center justify-between gap-x-2 rounded-md transition-colors duration-75 hover:bg-gray-100 md:px-2.5 md:py-1 dark:hover:bg-gray-800">
                        {order.companyName}
                      </span>
                    </div>
                  )}
                  <div className="flex flex-col text-sm md:flex-row md:items-baseline md:justify-between md:gap-4">
                    <h3 className="flex-1 text-gray-500 dark:text-gray-500">
                      Business Field
                    </h3>
                    <span className="group flex flex-1 flex-row items-center justify-between gap-x-2 rounded-md transition-colors duration-75 hover:bg-gray-100 md:px-2.5 md:py-1 dark:hover:bg-gray-800">
                      {order.businessField.join(", ") || "N/A"}
                    </span>
                  </div>
                  {order.hasDomain && (
                    <div className="flex flex-col text-sm md:flex-row md:items-baseline md:justify-between md:gap-4">
                      <h3 className="flex-1 text-gray-500 dark:text-gray-500">
                        Has Domain
                      </h3>
                      <span className="group flex flex-1 flex-row items-center justify-between gap-x-2 rounded-md transition-colors duration-75 hover:bg-gray-100 md:px-2.5 md:py-1 dark:hover:bg-gray-800">
                        {order.hasDomain}
                      </span>
                    </div>
                  )}
                  {order.domainName && (
                    <div className="flex flex-col text-sm md:flex-row md:items-baseline md:justify-between md:gap-4">
                      <h3 className="flex-1 text-gray-500 dark:text-gray-500">
                        Domain Name
                      </h3>
                      <span className="group flex flex-1 flex-row items-center justify-between gap-x-2 rounded-md transition-colors duration-75 hover:bg-gray-100 md:px-2.5 md:py-1 dark:hover:bg-gray-800">
                        {order.domainName}
                      </span>
                    </div>
                  )}
                  {order.hasSocialMedia && (
                    <div className="flex flex-col text-sm md:flex-row md:items-baseline md:justify-between md:gap-4">
                      <h3 className="flex-1 text-gray-500 dark:text-gray-500">
                        Has Social Media
                      </h3>
                      <span className="group flex flex-1 flex-row items-center justify-between gap-x-2 rounded-md transition-colors duration-75 hover:bg-gray-100 md:px-2.5 md:py-1 dark:hover:bg-gray-800">
                        {order.hasSocialMedia}
                      </span>
                    </div>
                  )}
                  {order.socialMediaAccounts &&
                    order.socialMediaAccounts.length > 0 && (
                      <div className="flex flex-col text-sm md:flex-row md:items-baseline md:justify-between md:gap-4">
                        <h3 className="flex-1 text-gray-500 dark:text-gray-500">
                          Social Media Accounts
                        </h3>
                        <span className="group flex flex-1 flex-row items-center justify-between gap-x-2 rounded-md transition-colors duration-75 hover:bg-gray-100 md:px-2.5 md:py-1 dark:hover:bg-gray-800">
                          {order.socialMediaAccounts.join(", ")}
                        </span>
                      </div>
                    )}
                </div>
              </div>

              {/* Project Details */}
              {(order.projectDescription ||
                order.specialRequirements ||
                order.exampleSites ||
                order.additionalNotes) && (
                <div className="flex flex-col gap-6 p-8">
                  <h3 className="text-lg">Project Details</h3>
                  <div className="flex flex-col gap-2">
                    {order.projectDescription && (
                      <div className="flex flex-col text-sm md:flex-row md:items-baseline md:justify-between md:gap-4">
                        <h3 className="flex-1 text-gray-500 dark:text-gray-500">
                          Project Description
                        </h3>
                        <span className="group flex flex-1 flex-row items-center justify-between gap-x-2 rounded-md transition-colors duration-75 hover:bg-gray-100 md:px-2.5 md:py-1 dark:hover:bg-gray-800">
                          {order.projectDescription}
                        </span>
                      </div>
                    )}
                    {order.specialRequirements && (
                      <div className="flex flex-col text-sm md:flex-row md:items-baseline md:justify-between md:gap-4">
                        <h3 className="flex-1 text-gray-500 dark:text-gray-500">
                          Special Requirements
                        </h3>
                        <span className="group flex flex-1 flex-row items-center justify-between gap-x-2 rounded-md transition-colors duration-75 hover:bg-gray-100 md:px-2.5 md:py-1 dark:hover:bg-gray-800">
                          {order.specialRequirements}
                        </span>
                      </div>
                    )}
                    {order.exampleSites && (
                      <div className="flex flex-col text-sm md:flex-row md:items-baseline md:justify-between md:gap-4">
                        <h3 className="flex-1 text-gray-500 dark:text-gray-500">
                          Example Sites
                        </h3>
                        <span className="group flex flex-1 flex-row items-center justify-between gap-x-2 rounded-md transition-colors duration-75 hover:bg-gray-100 md:px-2.5 md:py-1 dark:hover:bg-gray-800">
                          {order.exampleSites}
                        </span>
                      </div>
                    )}
                    {order.additionalNotes && (
                      <div className="flex flex-col text-sm md:flex-row md:items-baseline md:justify-between md:gap-4">
                        <h3 className="flex-1 text-gray-500 dark:text-gray-500">
                          Additional Notes
                        </h3>
                        <span className="group flex flex-1 flex-row items-center justify-between gap-x-2 rounded-md transition-colors duration-75 hover:bg-gray-100 md:px-2.5 md:py-1 dark:hover:bg-gray-800">
                          {order.additionalNotes}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Payment Attempts */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-row items-center justify-between gap-x-8">
                <div className="flex flex-row items-center justify-between gap-x-6">
                  <h3 className="text-lg">Payment Attempts</h3>
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <div className="overflow-hidden rounded-2xl border  dark:border-[#313131]">
                  <div className="relative w-full overflow-auto">
                    <table className="w-full table-fixed text-sm">
                      <thead className="border-b  dark:bg-[#171719]">
                        <tr className="transition-colors   ">
                          <th
                            className="h-12 px-4 text-left font-medium text-gray-500 dark:text-gray-400"
                            style={{ width: "150px" }}
                          >
                            Created At
                          </th>
                          <th
                            className="h-12 px-4 text-left font-medium text-gray-500 dark:text-gray-400"
                            style={{ width: "150px" }}
                          >
                            Method
                          </th>
                          <th
                            className="h-12 px-4 text-left font-medium text-gray-500 dark:text-gray-400"
                            style={{ width: "150px" }}
                          >
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-[#313131]">
                        <tr className="transition-colors ">
                          <td className="p-4" style={{ width: "150px" }}>
                            {formatDate(order.createdAt)}
                          </td>
                          <td className="p-4" style={{ width: "150px" }}>
                            <div className="flex flex-row items-center gap-1">
                              <svg viewBox="0 0 24 16" className="h-6">
                                <g
                                  stroke="none"
                                  strokeWidth="1"
                                  fill="none"
                                  fillRule="evenodd"
                                >
                                  <g
                                    transform="translate(-80.000000, -280.000000)"
                                    fillRule="nonzero"
                                  >
                                    <g transform="translate(40.000000, 200.000000)">
                                      <g transform="translate(0.000000, 80.000000)">
                                        <g transform="translate(40.000000, 0.000000)">
                                          <rect
                                            strokeOpacity="0.2"
                                            stroke="#000000"
                                            strokeWidth="0.5"
                                            fill="#171E6C"
                                            x="0.25"
                                            y="0.25"
                                            width="23.5"
                                            height="15.5"
                                            rx="2"
                                          ></rect>
                                          <path
                                            d="M2.78773262,5.91443732 C2.26459089,5.62750595 1.6675389,5.39673777 1,5.23659312 L1.0280005,5.1118821 L3.76497922,5.1118821 C4.13596254,5.12488556 4.43699113,5.23650585 4.53494636,5.63071135 L5.12976697,8.46659052 L5.31198338,9.32072617 L6.97796639,5.1118821 L8.77678896,5.1118821 L6.10288111,11.2775284 L4.30396552,11.2775284 L2.78773262,5.91443732 L2.78773262,5.91443732 Z M10.0999752,11.2840738 L8.39882877,11.2840738 L9.46284763,5.1118821 L11.163901,5.1118821 L10.0999752,11.2840738 Z M16.2667821,5.26277458 L16.0354292,6.59558538 L15.881566,6.53004446 C15.5737466,6.40524617 15.1674138,6.28053516 14.6143808,6.29371316 C13.942741,6.29371316 13.6415263,6.56277129 13.6345494,6.82545859 C13.6345494,7.11441463 13.998928,7.3048411 14.5939153,7.58725177 C15.5740257,8.02718756 16.0286384,8.56556562 16.0218476,9.26818871 C16.0080799,10.5486366 14.8460128,11.376058 13.0610509,11.376058 C12.2978746,11.3694253 11.5627918,11.2180965 11.163808,11.0475679 L11.4018587,9.66204513 L11.6258627,9.76066195 C12.1788958,9.99070971 12.5428092,10.0889775 13.221984,10.0889775 C13.7117601,10.0889775 14.2368857,9.89837643 14.2435835,9.48488392 C14.2435835,9.21565125 14.0198586,9.01850486 13.3617074,8.7164581 C12.717789,8.42086943 11.8568435,7.92848346 11.8707973,7.04197926 C11.8780532,5.84042483 13.0610509,5 14.7409877,5 C15.3990458,5 15.9312413,5.13788902 16.2667821,5.26277458 Z M18.5277524,9.0974856 L19.941731,9.0974856 C19.8717762,8.78889347 19.549631,7.31147374 19.549631,7.31147374 L19.4307452,6.77964104 C19.3467437,7.00942698 19.1998574,7.38373457 19.2069273,7.37055657 C19.2069273,7.37055657 18.6678479,8.74290137 18.5277524,9.0974856 Z M20.6276036,5.1118821 L22,11.2839865 L20.4249023,11.2839865 C20.4249023,11.2839865 20.2707601,10.5748181 20.221922,10.3581228 L18.0377903,10.3581228 C17.9746264,10.5221933 17.6807607,11.2839865 17.6807607,11.2839865 L15.8957988,11.2839865 L18.4226343,5.62399144 C18.5977072,5.22341512 18.9059917,5.1118821 19.3117663,5.1118821 L20.6276036,5.1118821 L20.6276036,5.1118821 Z"
                                            fill="#FFFFFF"
                                          ></path>
                                        </g>
                                      </g>
                                    </g>
                                  </g>
                                </g>
                              </svg>
                              <span className="capitalize">•••• 4242</span>
                            </div>
                          </td>
                          <td className="p-4" style={{ width: "150px" }}>
                            <div
                              className={`w-fit rounded-md px-2.5 py-1 text-sm ${getStatusBadge(order.status)}`}
                            >
                              {getStatusText(order.status)}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Refunds */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-row items-center justify-between gap-x-8">
                <div className="flex flex-row items-center justify-between gap-x-6">
                  <h3 className="text-lg">Refunds</h3>
                </div>
                <button className="flex items-center justify-center rounded-xl border border-white/10 bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  <div className="flex flex-row items-center">Refund Order</div>
                </button>
              </div>
              <div className="flex flex-col gap-6">
                <div className="overflow-hidden rounded-2xl border  dark:border-[#313131]">
                  <div className="relative w-full overflow-auto">
                    <table className="w-full table-fixed text-sm">
                      <thead className="border-b  dark:bg-[#171719]">
                        <tr className="transition-colors ">
                          <th
                            className="h-12 px-4 text-left font-medium text-gray-500 dark:text-gray-400"
                            style={{ width: "150px" }}
                          >
                            Created At
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
                            Reason
                          </th>
                          <th
                            className="h-12 px-4 text-left font-medium text-gray-500 dark:text-gray-400"
                            style={{ width: "150px" }}
                          >
                            Revoke Benefits
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        <tr className="transition-colors ">
                          <td className="p-4 text-center" colSpan={5}>
                            No Results
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
          <div className="w-full rounded-xl border border-gray-200 bg-white p-6 dark:border-[#313131] dark:bg-[#171719] lg:rounded-2xl">
            <div className="flex flex-row items-center gap-4">
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-[#313131] bg-gray-50 text-sm dark:border-[#313131] dark:bg-[#171719]">
                <div className="absolute inset-0 flex items-center justify-center bg-transparent">
                  <span>
                    {order.customerName
                      ? order.customerName.charAt(0).toUpperCase()
                      : "U"}
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <p>{order.customerName || "Unknown Customer"}</p>
                <div className="flex flex-row items-center gap-1 text-sm text-gray-500 dark:text-gray-500">
                  {order.formEmail || "No email"}
                </div>
              </div>
            </div>
            <div className="flex flex-row justify-between gap-4 mt-4">
              <div className="flex flex-1 flex-col gap-1 rounded-lg bg-gray-100 px-4 py-3 text-sm dark:bg-[#313131]">
                <span className="text-gray-500 dark:text-gray-500">
                  Total Revenue
                </span>
                <span>
                  <div className="flex flex-row items-baseline gap-x-1">
                    {formatPrice(order.totalPrice)}
                  </div>
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-1 rounded-lg bg-gray-100 px-4 py-3 text-sm dark:bg-[#313131]">
                <span className="text-gray-500 dark:text-gray-500">
                  Order Date
                </span>
                <span>{formatDate(order.createdAt)}</span>
              </div>
            </div>
            <div className="flex flex-col gap-4 mt-4">
              <div className="">
                <Link
                  href={`mailto:${order.formEmail}`}
                  className="w-1/2 text-blue-500 dark:text-blue-400"
                >
                  <button className="flex w-full items-center justify-center rounded-2xl border border-black/10 bg-gray-100 px-5 py-4 text-sm font-medium text-black transition-colors  dark:border-white/10 dark:bg-[#313131] dark:text-white ">
                    <div className="flex flex-row text-xs md:text-sm items-center">
                      Send Email
                    </div>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
