import React from 'react'
import { MoneyStats } from '@/components/dashboard/money-stats'
import { RevenueChart } from '@/components/dashboard/revenue-chart'
import { CustomerGrowthChart } from '@/components/dashboard/customer-growth-chart'
import { CustomersTable } from '@/components/dashboard/customers-table'

function AnalyticsPage() {
    const stats = {
        totalRevenue: 45870,
        monthlyRevenue: 6090,
        revenueGrowth: 12.5,
        totalSales: 705,
        salesGrowth: 8.3
    }

     return (
        <div className="space-y-8 w-11/12 lg:max-w-7xl mx-auto my-5 lg:my-10 z-10">
            {/* Stats Overview */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Analytics Dashboard</h1>
                <p className="text-muted-foreground mb-6">
                    Track your revenue, customer growth, and key metrics
                </p>
                <MoneyStats {...stats} />
            </div>

            {/* Charts Section */}
            <div className="grid gap-6 lg:grid-cols-2">
                <RevenueChart />
                <CustomerGrowthChart />
            </div>

            {/* Customers Table */}
            <CustomersTable />
        </div>
    )
}

export default AnalyticsPage