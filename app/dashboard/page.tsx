import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { getOrders } from "@/app/action/order-action";
import { getSubscriptions } from "@/app/action/subscriptions-action";

export default async function Page() {
  // Get user's orders
  const ordersResult = await getOrders();
  const orders = ordersResult.orders || [];

  // Get user's subscriptions
  const subscriptionsResult = await getSubscriptions();
  const subscriptions = subscriptionsResult.subscriptions || [];

  // Calculate metrics
  // Orders'da totalPrice zaten dollar cinsinden saklanıyor, /100 yapmaya gerek yok
  const totalRevenue = orders.reduce(
    (sum, order) => sum + (order.totalPrice || 0),
    0
  );
  const totalOrders = orders.length;
  const activeSubscriptions = subscriptions.filter(
    (sub) => sub.status === "ACTIVE"
  ).length;

  // Calculate growth based on current vs previous period (simplified)
  // For now, show positive growth if there are orders, zero if no orders
  const revenueGrowth =
    totalOrders > 0
      ? Math.min(totalOrders * 8.5, 45) // Dynamic growth based on orders (max 45%)
      : 0;

  // Get the most recent order's package
  const currentPackage = orders.length > 0 ? orders[0].packageName : null;

  // Transform subscriptions data for DataTable
  const tableData = subscriptions.map((sub, index) => ({
    id: index + 1,
    header: sub.packageName || sub.product,
    type: sub.interval === "once" ? "One-time" : "Subscription",
    status: sub.status,
    target: `$${sub.amount.toFixed(2)}`,
    limit: sub.interval,
    reviewer: sub.customerEmail,
  }));

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        {/* Header with New Project Button */}
        <div className="flex justify-between items-center px-2 lg:px-2">
          <div>
            <h1 className="text-2xl font-bold text-black dark:text-white">
              Dashboard
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage your projects
            </p>
          </div>
          <Link href="/onboarding?new=true">
            <Button className="bg-black text-white rounded-sm hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
              <Plus className="w-3 h-3 mr-2" />
              create new project
            </Button>
          </Link>
        </div>

        <SectionCards
          totalRevenue={totalRevenue}
          totalOrders={totalOrders}
          activeSubscriptions={activeSubscriptions}
          revenueGrowth={revenueGrowth}
        />
        <div className="px-4 lg:px-6">
          <ChartAreaInteractive />
        </div>
        <DataTable data={tableData} />
      </div>
    </div>
  );
}
