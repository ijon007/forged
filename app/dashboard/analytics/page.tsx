import React from 'react'
import { MoneyStats } from '@/components/dashboard/money-stats'
import { RevenueChart } from '@/components/dashboard/revenue-chart'
import { CustomersTable } from '@/components/dashboard/customers-table'
import { OrdersChart } from '@/components/dashboard/orders-chart'
import { getAnalyticsStats, getMonthlyChartData, getRecentCustomers } from '@/actions/analytics-actions'

async function AnalyticsPage() {
    // Fetch real analytics data
    const [stats, monthlyData, recentCustomers] = await Promise.all([
        getAnalyticsStats(),
        getMonthlyChartData(),
        getRecentCustomers()
    ])

    // Debug logging
    console.log('Analytics Debug:')
    console.log('Stats:', stats)
    console.log('Monthly Data:', monthlyData)
    console.log('Recent Customers:', recentCustomers)

    // Extract revenue and orders data for charts
    const revenueData = monthlyData.map(item => ({
        month: item.month,
        revenue: item.revenue
    }))

    const ordersData = monthlyData.map(item => ({
        month: item.month,
        orders: item.orders
    }))

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
                <RevenueChart data={revenueData} />
                <OrdersChart data={ordersData} />
            </div>

            {/* Customers Table */}
            <CustomersTable customers={recentCustomers} />
        </div>
    )
}

export default AnalyticsPage