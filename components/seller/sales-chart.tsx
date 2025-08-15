"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SalesData {
  date: string
  revenue: number
  orders: number
}

interface SalesChartProps {
  data: SalesData[]
}

export function SalesChart({ data }: SalesChartProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const chartData = data.map((item) => ({
    ...item,
    date: formatDate(item.date),
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <div className="text-lg font-semibold mb-2">Chart Placeholder</div>
            <p className="text-sm">Sales data visualization will appear here</p>
            <div className="mt-4 text-xs">
              {chartData.map((item, index) => (
                <div key={index} className="mb-1">
                  {item.date}: ${item.revenue} ({item.orders} orders)
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
