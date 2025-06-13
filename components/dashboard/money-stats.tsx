import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, TrendingUp, TrendingDown, Users } from "lucide-react"

interface MoneyStatsProps {
  totalRevenue: number
  monthlyRevenue: number
  revenueGrowth: number
  totalSales: number
  salesGrowth: number
}

export function MoneyStats({ 
  totalRevenue, 
  monthlyRevenue, 
  revenueGrowth, 
  totalSales, 
  salesGrowth 
}: MoneyStatsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : ''
    return `${sign}${value.toFixed(1)}%`
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Revenue */}
      <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
            Total Revenue
          </CardTitle>
          <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
            <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-900 dark:text-green-100">
            {formatCurrency(totalRevenue)}
          </div>
          <p className="text-xs text-green-600 dark:text-green-400">
            All time earnings
          </p>
        </CardContent>
      </Card>

      {/* Monthly Revenue */}
      <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
            This Month
          </CardTitle>
          <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
            {revenueGrowth >= 0 ? (
              <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            ) : (
              <TrendingDown className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
            {formatCurrency(monthlyRevenue)}
          </div>
          <p className="text-xs text-blue-600 dark:text-blue-400">
            <span className={revenueGrowth >= 0 ? "text-green-600" : "text-red-600"}>
              {formatPercentage(revenueGrowth)}
            </span> from last month
          </p>
        </CardContent>
      </Card>

      {/* Total Sales */}
      <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
            Total Sales
          </CardTitle>
          <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
            <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
            {totalSales.toLocaleString()}
          </div>
          <p className="text-xs text-purple-600 dark:text-purple-400">
            Total purchases
          </p>
        </CardContent>
      </Card>

      {/* Sales Growth */}
      <Card className="border-0 shadow-md bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">
            Sales Growth
          </CardTitle>
          <div className="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
            {salesGrowth >= 0 ? (
              <TrendingUp className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            ) : (
              <TrendingDown className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
            {formatPercentage(salesGrowth)}
          </div>
          <p className="text-xs text-orange-600 dark:text-orange-400">
            Month over month
          </p>
        </CardContent>
      </Card>
    </div>
  )
} 