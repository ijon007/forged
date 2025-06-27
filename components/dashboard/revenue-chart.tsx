"use client"

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface RevenueData {
  month: string
  revenue: number
}

interface RevenueChartProps {
  data: RevenueData[]
}

export function RevenueChart({ data }: RevenueChartProps) {
  // Calculate if overall trend is positive or negative
  const isGrowthTrend = () => {
    if (data.length < 6) return true
    const firstHalf = data.slice(0, 6).reduce((sum, item) => sum + item.revenue, 0)
    const secondHalf = data.slice(6).reduce((sum, item) => sum + item.revenue, 0)
    return secondHalf > firstHalf
  }

  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: isGrowthTrend() ? "hsl(142, 76%, 36%)" : "hsl(0, 84%, 60%)",
    },
  } satisfies ChartConfig

  const trendColor = isGrowthTrend() ? "text-green-600" : "text-red-600"
  const trendText = isGrowthTrend() ? "↗ Trending up" : "↘ Trending down"

  // Calculate total revenue for the period
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0)

  return (
    <Card className="border rounded-3xl">
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
        <CardDescription>
          Monthly revenue for the past 12 months • Total: ${totalRevenue.toLocaleString()}
          <span className={`ml-2 text-sm font-medium ${trendColor}`}>
            {trendText}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="revenue"
              type="natural"
              fill="var(--color-revenue)"
              fillOpacity={0.2}
              stroke="var(--color-revenue)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
} 