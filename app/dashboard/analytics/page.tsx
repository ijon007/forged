import {
  getAnalyticsStats,
  getMonthlyChartData,
  getRecentCustomers,
} from "@/actions/analytics-actions";
import { getPolarConnectionStatus } from "@/actions/polar-actions";
import { CustomersTable } from "@/components/dashboard/customers-table";
import { MoneyStats } from "@/components/dashboard/money-stats";
import { OrdersChart } from "@/components/dashboard/orders-chart";
import { PolarConnectionCheck } from "@/components/dashboard/polar-connection-check";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { SidebarTrigger } from "@/components/ui/sidebar";

async function AnalyticsPage() {
  const [stats, monthlyData, recentCustomers, polarStatus] = await Promise.all([
    getAnalyticsStats(),
    getMonthlyChartData(),
    getRecentCustomers(),
    getPolarConnectionStatus(),
  ]);

  const revenueData = monthlyData.map((item) => ({
    month: item.month,
    revenue: item.revenue,
  }));

  const ordersData = monthlyData.map((item) => ({
    month: item.month,
    orders: item.orders,
  }));

  return (
    <div className="z-10 mx-auto my-5 w-11/12 space-y-8 lg:my-10 lg:max-w-7xl">
      <PolarConnectionCheck 
        isConnected={polarStatus.isConnected} 
        needsReconnection={polarStatus.needsReconnection} 
      />
      <div>
        <div className="flex items-center justify-between">
          <h1 className="mb-2 font-bold text-3xl tracking-tight">
            Analytics Dashboard
          </h1>
          <SidebarTrigger className="block md:hidden" />
        </div>
        <p className="mb-6 text-muted-foreground">
          Track your revenue, customer growth, and key metrics
        </p>
        <MoneyStats {...stats} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueChart data={revenueData} />
        <OrdersChart data={ordersData} />
      </div>

      <CustomersTable customers={recentCustomers} />
    </div>
  );
}

export default AnalyticsPage;
