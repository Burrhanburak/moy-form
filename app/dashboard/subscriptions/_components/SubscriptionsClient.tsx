"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { TrendingUp } from "lucide-react";

interface Subscription {
  id: string;
  customer: string;
  customerEmail: string;
  status: string;
  subscriptionDate: Date;
  renewalDate: Date;
  product: string;
  productDescription: string;
  stripeSubscriptionId: string;
  cancelAtPeriodEnd: boolean;
  trialEnd: Date | null;
  amount: number;
  currency: string;
  interval: string;
}

interface SubscriptionsClientProps {
  subscriptions: Subscription[];
  cancelAction: (
    subscriptionId: string
  ) => Promise<{ error?: string; success?: boolean }>;
  reactivateAction: (
    subscriptionId: string
  ) => Promise<{ error?: string; success?: boolean }>;
}

export default function SubscriptionsClient({
  subscriptions,
  cancelAction,
  reactivateAction,
}: SubscriptionsClientProps) {
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );
  const [planFilter, setPlanFilter] = useState<string | undefined>(undefined);

  useEffect(() => {
    console.log("Subscriptions received:", subscriptions);
  }, [subscriptions]);
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));
  };

  const loadSubscriptions = () => {
    window.location.reload();
  };

  const handleCancelSubscription = async (subscriptionId: string) => {
    try {
      const result = await cancelAction(subscriptionId);

      if (result.error) {
        alert(`Error: ${result.error}`);
      } else {
        alert("Subscription will be canceled at the end of the current period");
        loadSubscriptions(); // Reload to show updated status
      }
    } catch {
      alert("Failed to cancel subscription");
    }
  };

  const handleReactivateSubscription = async (subscriptionId: string) => {
    try {
      const result = await reactivateAction(subscriptionId);

      if (result.error) {
        alert(`Error: ${result.error}`);
      } else {
        alert("Subscription has been reactivated");
        loadSubscriptions(); // Reload to show updated status
      }
    } catch {
      alert("Failed to reactivate subscription");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return {
          text: "Active",
          className:
            "bg-emerald-100 text-emerald-500 dark:bg-emerald-950 dark:text-emerald-500",
        };
      case "canceled":
        return {
          text: "Canceled",
          className:
            "bg-red-100 text-red-500 dark:bg-red-950 dark:text-red-500",
        };
      case "trialing":
        return {
          text: "Trialing",
          className:
            "bg-blue-100 text-blue-500 dark:bg-blue-950 dark:text-blue-500",
        };
      case "past_due":
        return {
          text: "Past Due",
          className:
            "bg-yellow-100 text-yellow-500 dark:bg-yellow-950 dark:text-yellow-500",
        };
      case "incomplete":
        return {
          text: "Incomplete",
          className:
            "bg-orange-100 text-orange-500 dark:bg-orange-950 dark:text-orange-500",
        };
      case "unpaid":
        return {
          text: "Unpaid",
          className:
            "bg-red-100 text-red-500 dark:bg-red-950 dark:text-red-500",
        };
      default:
        return {
          text: status,
          className:
            "bg-gray-100 text-gray-500 dark:bg-gray-950 dark:text-gray-500",
        };
    }
  };

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  const filteredSubscriptions = subscriptions.filter((sub: Subscription) => {
    const statusMatch =
      !statusFilter ||
      statusFilter === "All" ||
      sub.status.toLowerCase() === statusFilter.toLowerCase();
    const planMatch =
      !planFilter ||
      planFilter === "All plans" ||
      sub.product.includes(planFilter);
    return statusMatch && planMatch;
  });

  // if (loading) {
  //   return (
  //     <div className="relative flex h-full w-full flex-col gap-y-4">
  //       <main className="relative flex min-h-0 w-full grow flex-col">
  //         <div className="flex h-full w-full flex-row gap-x-2 p-5">
  //           <div className="dark:md:bg-[#171719] dark:border-[#313131] md:shadow-xs relative flex w-full flex-col items-center rounded-2xl border px-4 md:overflow-y-auto md:border md:bg-white md:px-8">
  //             <div className="flex h-full w-full flex-col">
  //               <div className="flex w-full flex-col gap-y-4 py-8 md:flex-row md:items-center md:justify-between md:py-8">
  //                 <h4 className="whitespace-nowrap text-2xl font-medium dark:text-white">
  //                   Subscriptions
  //                 </h4>
  //               </div>
  //               <div className="flex items-center justify-center py-12 h-full">
  //                 <Loader className="animate-spin" />
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </main>
  //     </div>
  //   );
  // }

  // if (error) {
  //   return (
  //     <div className="relative flex h-full w-full flex-col gap-y-4">
  //       <main className="relative flex min-h-0 w-full grow flex-col">
  //         <div className="flex h-full w-full flex-row gap-x-2 p-5">
  //           <div className="dark:md:bg-[#171719] dark:border-[#313131] md:shadow-xs relative flex w-full flex-col items-center rounded-2xl border px-4 md:overflow-y-auto md:border md:bg-white md:px-8">
  //             <div className="flex h-full w-full flex-col">
  //               <div className="flex w-full flex-col gap-y-4 py-8 md:flex-row md:items-center md:justify-between md:py-8">
  //                 <h4 className="whitespace-nowrap text-2xl font-medium dark:text-white">
  //                   Subscriptions
  //                 </h4>
  //               </div>
  //               <div className="flex items-center justify-center py-12">
  //                 <div className="text-red-600 dark:text-red-400">
  //                   Error: {error}
  //                 </div>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </main>
  //     </div>
  //   );
  // }

  return (
    <div className="relative flex h-full w-full flex-col gap-y-4">
      <main className="relative flex min-h-0 w-full grow flex-col">
        <div className="flex h-full w-full flex-row gap-x-2 p-5">
          <div className="dark:md:bg-[#171719] dark:border-[#313131] md:shadow-xs relative flex w-full flex-col items-center rounded-2xl border px-4 md:overflow-y-auto md:border md:bg-white md:px-8">
            <div className="flex h-full w-full flex-col">
              <div className="flex w-full flex-col gap-y-4 py-8 md:flex-row md:items-center md:justify-between md:py-8">
                <h4 className="whitespace-nowrap text-lg font-medium dark:text-white">
                  Subscriptions
                </h4>
              </div>
              <div className="flex w-full flex-col pb-8" style={{ opacity: 1 }}>
                <div className="flex flex-col gap-8">
                  <div className="flex w-full flex-row items-center justify-between gap-2">
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="w-auto">
                        <Select
                          value={statusFilter}
                          onValueChange={(value) => setStatusFilter(value)}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="All">All</SelectItem>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Canceled">Canceled</SelectItem>
                            <SelectItem value="Trialing">Trialing</SelectItem>
                            <SelectItem value="Past_due">Past Due</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="w-auto">
                        <Select
                          value={planFilter}
                          onValueChange={(value) => setPlanFilter(value)}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="All Plans" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="All plans">All plans</SelectItem>
                            <SelectItem value="Starter">Starter</SelectItem>
                            <SelectItem value="Business">Business</SelectItem>
                            <SelectItem value="Ecommerce">Ecommerce</SelectItem>
                            <SelectItem value="Maintenance">
                              Maintenance
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="w-auto flex items-end gap-2">
                      {/* Upgrade button removed - subscriptions have individual details instead */}
                    </div>
                  </div>
                  <div className="flex flex-col gap-6">
                    <div className="dark:border-[#313131] overflow-hidden rounded-2xl border border-gray-200">
                      <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm table-fixed">
                          <thead className="[&_tr]:border-b">
                            <tr className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors dark:bg-[#171719] bg-gray-50">
                              <th
                                className="text-muted-foreground h-12 px-4 text-left align-middle text-sm font-medium"
                                style={{ width: "150px" }}
                              >
                                Customer
                              </th>
                              <th
                                className="text-muted-foreground h-12 px-4 text-left align-middle font-medium"
                                style={{ width: "120px" }}
                              >
                                Status
                              </th>
                              <th
                                className="text-muted-foreground h-12 px-4 text-left align-middle font-medium"
                                style={{ width: "150px" }}
                              >
                                Subscription Date
                              </th>
                              <th
                                className="text-muted-foreground h-12 px-4 text-left align-middle font-medium"
                                style={{ width: "150px" }}
                              >
                                Renewal Date
                              </th>
                              <th
                                className="text-muted-foreground h-12 px-4 text-left align-middle font-medium"
                                style={{ width: "200px" }}
                              >
                                Product
                              </th>
                              <th
                                className="text-muted-foreground h-12 px-4 text-left align-middle font-medium"
                                style={{ width: "100px" }}
                              >
                                Amount
                              </th>
                              <th
                                className="text-muted-foreground h-12 px-4 text-left align-middle font-medium"
                                style={{ width: "100px" }}
                              >
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="[&_tr:last-child]:border-0">
                            {filteredSubscriptions.length === 0 ? (
                              <tr className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors">
                                <td
                                  className="p-4 align-middle text-center"
                                  colSpan={7}
                                >
                                  No subscriptions found
                                </td>
                              </tr>
                            ) : (
                              filteredSubscriptions.map((subscription) => (
                                <tr
                                  key={subscription.id}
                                  className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors cursor-pointer"
                                  onClick={() =>
                                    (window.location.href = `/dashboard/subscriptions/${subscription.id}`)
                                  }
                                >
                                  <td className="p-4 align-middle">
                                    <div className="flex flex-col">
                                      <span className="font-medium dark:text-white">
                                        {subscription.customer}
                                      </span>
                                      <span className="text-sm text-gray-500">
                                        {subscription.customerEmail}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="p-4 align-middle">
                                    <span
                                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(subscription.status).className}`}
                                    >
                                      {getStatusBadge(subscription.status).text}
                                      {subscription.cancelAtPeriodEnd &&
                                        " (Canceling)"}
                                    </span>
                                  </td>
                                  <td className="p-4 align-middle dark:text-white">
                                    {formatDate(subscription.subscriptionDate)}
                                  </td>
                                  <td className="p-4 align-middle dark:text-white">
                                    {formatDate(subscription.renewalDate)}
                                  </td>
                                  <td className="p-4 align-middle">
                                    <div className="flex flex-col">
                                      <span className="font-medium dark:text-white">
                                        {subscription.product}
                                      </span>
                                      <span className="text-sm text-gray-500">
                                        {subscription.productDescription}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="p-4 align-middle dark:text-white">
                                    {formatPrice(
                                      subscription.amount,
                                      subscription.currency
                                    )}
                                    <span className="text-sm text-gray-500">
                                      /{subscription.interval}
                                    </span>
                                  </td>
                                  {/* <td className="p-4 align-middle" onClick={(e) => e.stopPropagation()}>
                                    {subscription.status === 'ACTIVE' && !subscription.cancelAtPeriodEnd && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleCancelSubscription(subscription.id)}
                                        className="text-red-600 hover:text-red-700"
                                      >
                                        Cancel
                                      </Button>
                                    )}
                                    {subscription.cancelAtPeriodEnd && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleReactivateSubscription(subscription.id)}
                                        className="text-green-600 hover:text-green-700"
                                      >
                                        Reactivate
                                      </Button>
                                    )}
                                  </td> */}
                                  <td
                                    className="p-4 align-middle"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Button
                                      variant="outline"
                                      className="rounded-lg text-xs md:text-sm h-8 px-3 py-2"
                                      size="sm"
                                      onClick={() =>
                                        (window.location.href = `/dashboard/subscriptions/${subscription.id}`)
                                      }
                                    >
                                      Details
                                    </Button>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
