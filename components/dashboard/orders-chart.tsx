"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
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

interface OrdersData {
  month: string;
  orders: number;
}

interface OrdersChartProps {
  data: OrdersData[];
}

export function OrdersChart({ data }: OrdersChartProps) {
  const chartConfig = {
    orders: {
      label: "New Orders",
      color: "hsl(217, 91%, 60%)",
    },
  } satisfies ChartConfig;

  // Calculate total orders for the period
  const totalOrders = data.reduce((sum, item) => sum + item.orders, 0);

  return (
    <Card className="rounded-3xl border">
      <CardHeader>
        <CardTitle>Orders</CardTitle>
        <CardDescription>
          New orders each month • Total: {totalOrders.toLocaleString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="month"
              tickFormatter={(value) => value.slice(0, 3)}
              tickLine={false}
              tickMargin={10}
            />
            <ChartTooltip
              content={<ChartTooltipContent hideLabel />}
              cursor={false}
              labelClassName="gap-2"
            />
            <Bar dataKey="orders" fill="var(--color-orders)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
