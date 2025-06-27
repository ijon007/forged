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

const chartData = [
  { month: "January", revenue: 1860 },
  { month: "February", revenue: 3050 },
  { month: "March", revenue: 2370 },
  { month: "April", revenue: 4230 },
  { month: "May", revenue: 2090 },
  { month: "June", revenue: 5140 },
  { month: "July", revenue: 3890 },
  { month: "August", revenue: 4950 },
  { month: "September", revenue: 3640 },
  { month: "October", revenue: 5280 },
  { month: "November", revenue: 4170 },
  { month: "December", revenue: 6090 },
]

// Calculate if overall trend is positive or negative
const isGrowthTrend = () => {
  const firstHalf = chartData.slice(0, 6).reduce((sum, item) => sum + item.revenue, 0)
  const secondHalf = chartData.slice(6).reduce((sum, item) => sum + item.revenue, 0)
  return secondHalf > firstHalf
}

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: isGrowthTrend() ? "hsl(142, 76%, 36%)" : "hsl(0, 84%, 60%)",
  },
} satisfies ChartConfig

export function RevenueChart() {
  const trendColor = isGrowthTrend() ? "text-green-600" : "text-red-600"
  const trendText = isGrowthTrend() ? "↗ Trending up" : "↘ Trending down"

  return (
    <Card className="border rounded-3xl">
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
        <CardDescription>
          Monthly revenue for the past 12 months
          <span className={`ml-2 text-sm font-medium ${trendColor}`}>
            {trendText}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
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