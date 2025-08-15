"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Eye } from "lucide-react"

interface ProductPerformance {
  id: string
  name: string
  image?: string
  views: number
  sales: number
  revenue: number
  trend: "up" | "down"
  trendValue: string
}

export function ProductPerformance() {
  // Mock data for demo
  const products: ProductPerformance[] = [
    {
      id: "1",
      name: "Sample Product 1",
      views: 1250,
      sales: 45,
      revenue: 2250,
      trend: "up",
      trendValue: "+12%"
    },
    {
      id: "2",
      name: "Sample Product 2", 
      views: 890,
      sales: 23,
      revenue: 1150,
      trend: "down",
      trendValue: "-8%"
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.map((product) => (
            <div key={product.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-12 h-12 object-cover rounded-md"
              />
              
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 truncate">{product.name}</h4>
                <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Eye className="h-3 w-3" />
                    <span>{product.views} views</span>
                  </div>
                  <span>{product.sales} sales</span>
                  <span className="font-semibold text-green-600">${product.revenue}</span>
                </div>
              </div>

              <Badge className={`${product.trend === "up" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                <div className="flex items-center space-x-1">
                  {product.trend === "up" ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  <span>{product.trendValue}</span>
                </div>
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
