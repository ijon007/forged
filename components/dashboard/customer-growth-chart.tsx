"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
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
  { month: "January", customers: 28 },
  { month: "February", customers: 45 },
  { month: "March", customers: 38 },
  { month: "April", customers: 62 },
  { month: "May", customers: 34 },
  { month: "June", customers: 78 },
  { month: "July", customers: 56 },
  { month: "August", customers: 71 },
  { month: "September", customers: 49 },
  { month: "October", customers: 84 },
  { month: "November", customers: 67 },
  { month: "December", customers: 93 },
]

const chartConfig = {
  customers: {
    label: "New Customers",
    color: "hsl(217, 91%, 60%)",
  },
} satisfies ChartConfig

export function CustomerGrowthChart() {
  return (
    <Card className="border rounded-3xl">
      <CardHeader>
        <CardTitle>Customer Growth</CardTitle>
        <CardDescription>
          New customers acquired each month
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
              labelClassName="gap-2"
            />
            <Bar dataKey="customers" fill="var(--color-customers)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
} 