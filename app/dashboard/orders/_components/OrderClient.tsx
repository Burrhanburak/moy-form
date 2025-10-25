"use client";

import { IconChevronDown } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { TrendingUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Order {
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
  subscription?: {
    packageName?: string | null;
    businessField: string[];
  } | null;
}

interface OrderClientProps {
  orders: { orders?: Order[]; error?: string };
}

export default function OrderClient({
  orders: initialOrders,
}: OrderClientProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders.orders || []);
  const [statusFilter, setStatusFilter] = useState("All Orders");

  useEffect(() => {
    if (initialOrders.orders) {
      setOrders(initialOrders.orders);
    }
  }, [initialOrders]);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
      case "completed":
        return {
          text: "Paid",
          className:
            "bg-emerald-100 text-emerald-500 dark:bg-emerald-950 dark:text-emerald-500",
        };
      case "processing":
        return {
          text: "Processing",
          className:
            "bg-blue-100 text-blue-500 dark:bg-blue-950 dark:text-blue-500",
        };
      case "pending_payment":
      case "pending":
        return {
          text: "Pending",
          className:
            "bg-yellow-100 text-yellow-500 dark:bg-yellow-950 dark:text-yellow-500",
        };
      case "canceled":
        return {
          text: "Canceled",
          className:
            "bg-red-100 text-red-500 dark:bg-red-950 dark:text-red-500",
        };
      case "failed":
        return {
          text: "Failed",
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

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("tr-TR");
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Calculate KPIs
  const totalOrders = orders.length;
  const todayRevenue = orders
    .filter((order) => {
      const today = new Date().toDateString();
      return (
        new Date(order.createdAt).toDateString() === today &&
        (order.status === "PAID" || order.status === "COMPLETED")
      );
    })
    .reduce((sum, order) => sum + order.totalPrice, 0);

  const cumulativeRevenue = orders
    .filter((order) => order.status === "PAID" || order.status === "COMPLETED")
    .reduce((sum, order) => sum + order.totalPrice, 0);

  const filteredOrders = orders.filter((order) => {
    if (statusFilter === "All Orders") return true;

    // Handle special cases for status mapping
    if (statusFilter === "pending_payment") {
      return order.status.toLowerCase() === "pending_payment";
    }
    if (statusFilter === "paid") {
      return (
        order.status.toLowerCase() === "paid" ||
        order.status.toLowerCase() === "completed"
      );
    }

    return order.status.toLowerCase() === statusFilter.toLowerCase();
  });

  return (
    <div className="relative flex h-full w-full flex-col gap-y-4">
      <main className="relative flex min-h-0 w-full grow flex-col">
        <div className="flex h-full w-full flex-row gap-x-2 p-5">
          <div className="dark:md:bg-[#171719] dark:border-[#313131] md:shadow-xs relative flex w-full flex-col items-center rounded-2xl border px-4 md:overflow-y-auto md:border md:bg-white md:px-8">
            <div className="flex h-full w-full flex-col">
              <div className="flex w-full flex-col gap-y-4 py-8 md:flex-row md:items-center md:justify-between md:py-8">
                <h4 className="whitespace-nowrap text-lg font-medium dark:text-white">
                  Orders
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
                          <SelectTrigger className="w-[140px] md:w-[180px]">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="All Orders">
                              All Orders
                            </SelectItem>
                            <SelectItem value="pending_payment">
                              Pending Payment
                            </SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="processing">
                              Processing
                            </SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="canceled">Canceled</SelectItem>
                            <SelectItem value="failed">Failed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* KPI cards */}
                  <div className="grid grid-cols-1 gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-2xl bg-white p-4 md:p-6 text-black dark:bg-[#171719] dark:text-white border border-gray-200 dark:border-[#313131]">
                      <div className="space-y-1.5 pb-2">
                        <span className="text-black dark:text-white text-sm md:text-base">
                          Total Orders
                        </span>
                      </div>
                      <div className="pt-0">
                        <h3 className="text-xl md:text-2xl">{totalOrders}</h3>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white p-4 md:p-6 text-black dark:bg-[#171719] dark:text-white border border-gray-200 dark:border-[#313131]">
                      <div className="space-y-1.5 pb-2">
                        <span className="text-black dark:text-white text-sm md:text-base">
                          Today&apos;s Revenue
                        </span>
                      </div>
                      <div className="pt-0">
                        <h3 className="text-xl md:text-2xl">
                          {formatPrice(todayRevenue)}
                        </h3>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white p-4 md:p-6 text-black dark:bg-[#171719] dark:text-white border border-gray-200 dark:border-[#313131]">
                      <div className="space-y-1.5 pb-2">
                        <span className="text-black dark:text-white text-sm md:text-base">
                          Total Revenue
                        </span>
                      </div>
                      <div className="pt-0">
                        <h3 className="text-xl md:text-2xl">
                          {formatPrice(cumulativeRevenue)}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Orders table */}
                  <div className="flex flex-col gap-4 md:gap-6">
                    <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-[#313131]">
                      <div className="relative w-full overflow-x-auto">
                        <table className="w-full text-sm table-fixed caption-bottom">
                          <thead>
                            <tr className="border-b border-gray-200 dark:border-[#313131] bg-white dark:bg-[#171719]">
                              <th
                                className="h-12 px-4 text-left align-middle font-medium"
                                style={{ width: 150 }}
                              >
                                Customer
                              </th>
                              <th
                                className="h-12 px-4 text-left align-middle font-medium"
                                style={{ width: 150 }}
                              >
                                Amount
                              </th>
                              <th
                                className="h-12 px-4 text-left align-middle font-medium"
                                style={{ width: 150 }}
                              >
                                Product
                              </th>
                              <th
                                className="h-12 px-4 text-left align-middle font-medium"
                                style={{ width: 150 }}
                              >
                                Status
                              </th>
                              <th
                                className="h-12 px-4 text-left align-middle font-medium hidden md:table-cell"
                                style={{ width: 150 }}
                              >
                                Invoice number
                              </th>
                              <th
                                className="h-12 px-4 text-left align-middle font-medium hidden md:table-cell"
                                style={{ width: 150 }}
                              >
                                <div className="flex items-center">
                                  Date
                                  <IconChevronDown className="h-4 w-4 opacity-50 text-black dark:text-white" />
                                </div>
                              </th>
                              <th
                                className="h-12 px-4 text-left align-middle font-medium"
                                style={{ width: 120 }}
                              >
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="[&_tr:last-child]:border-0">
                            {filteredOrders.length === 0 ? (
                              <tr>
                                <td
                                  colSpan={5}
                                  className="p-8 text-center text-gray-500 dark:text-gray-400"
                                >
                                  No orders found.
                                </td>
                              </tr>
                            ) : (
                              filteredOrders.map((order) => (
                                <tr
                                  key={order.id}
                                  className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors"
                                >
                                  <td className="p-2 md:p-4 align-middle">
                                    <div className="flex items-center gap-2 md:gap-3">
                                      <div className="dark:bg-polar-900 dark:border-polar-700 z-2 relative flex shrink-0 items-center justify-center rounded-full border-2 border-gray-200 text-xs md:text-sm h-6 w-6 md:h-8 md:w-8">
                                        <div className="absolute inset-0 flex items-center justify-center bg-transparent">
                                          <span>
                                            {order.customerName
                                              ? order.customerName
                                                  .charAt(0)
                                                  .toUpperCase()
                                              : "U"}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="flex flex-col">
                                        <span className="font-medium text-xs md:text-sm dark:text-white">
                                          {order.customerName ||
                                            "Unknown Customer"}
                                        </span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400 hidden md:block">
                                          {order.formEmail || "No email"}
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="p-2 md:p-4 align-middle text-xs md:text-sm">
                                    {formatPrice(order.totalPrice)}
                                  </td>
                                  <td className="p-2 md:p-4 align-middle">
                                    <div className="flex flex-col">
                                      <span className="font-medium text-xs md:text-sm">
                                        {order.packageName}
                                      </span>
                                      {order.selectedAddons?.length > 0 && (
                                        <span className="text-xs text-gray-500">
                                          +{order.selectedAddons.length} add-ons
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                  <td className="p-2 md:p-4 align-middle">
                                    <div className="flex shrink">
                                      <div
                                        className={`flex flex-row items-center justify-center rounded-[0.5em] px-[0.5em] md:px-[0.7em] py-[0.2em] md:py-[0.3em] text-xs md:text-sm font-medium capitalize ${getStatusBadge(order.status).className}`}
                                      >
                                        {getStatusBadge(order.status).text}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="p-2 md:p-4 align-middle text-xs md:text-sm hidden md:table-cell">
                                    {order.stripeSessionId?.slice(-8) || "N/A"}
                                  </td>
                                  <td className="p-2 md:p-4 align-middle text-xs md:text-sm hidden md:table-cell">
                                    {formatDate(order.createdAt)}
                                  </td>
                                  <td className="p-2 md:p-4 align-middle w-full">
                                    <div className="flex">
                                      <Link
                                        href={`/dashboard/orders/${order.id}`}
                                        passHref
                                      >
                                        <button
                                          type="button"
                                          className="flex items-center gap-1 md:gap-2 px-1 md:px-2 py-1 md:py-2 rounded-lg bg-[#171719] text-white hover:bg-[#171719]/90 border border-white/10 text-xs md:text-sm"
                                        >
                                          <span className="hidden md:inline">
                                            Detail
                                          </span>
                                          <span className="md:hidden">
                                            View
                                          </span>
                                          <TrendingUp className="w-3 h-3 md:w-4 md:h-4" />
                                        </button>
                                      </Link>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  {/* end orders table */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
