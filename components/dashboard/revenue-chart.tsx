"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface RevenueData {
  month: string;
  revenue: number;
}

interface RevenueChartProps {
  data: RevenueData[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  const isGrowthTrend = () => {
    if (data.length < 2) return true;
    const currentMonth = data[data.length - 1]?.revenue || 0;
    const lastMonth = data[data.length - 2]?.revenue || 0;
    return currentMonth >= lastMonth;
  };

  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: isGrowthTrend() ? "hsl(142, 76%, 36%)" : "hsl(0, 84%, 60%)",
    },
  } satisfies ChartConfig;

  const trendColor = isGrowthTrend() ? "text-green-600" : "text-red-600";
  const trendText = isGrowthTrend() ? "↗ Trending up" : "↘ Trending down";

  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);

  return (
    <Card className="rounded-3xl border">
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
        <CardDescription>
          Monthly revenue for the past 12 months • Total: $
          {totalRevenue.toLocaleString()}
          <span className={`ml-2 font-medium text-sm ${trendColor}`}>
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
              axisLine={false}
              dataKey="month"
              tickFormatter={(value) => value.slice(0, 3)}
              tickLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              content={<ChartTooltipContent indicator="line" />}
              cursor={false}
            />
            <Area
              dataKey="revenue"
              fill="var(--color-revenue)"
              fillOpacity={0.2}
              stroke="var(--color-revenue)"
              strokeWidth={2}
              type="natural"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
