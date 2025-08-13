"use client"

import { useState, useEffect } from "react"
import { Eye, Heart, MessageCircle, ShoppingCart, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { mockProductAnalytics } from "@/lib/seller"
import type { ProductAnalytics } from "@/types/seller"
import { cn } from "@/lib/utils"

export function ProductPerformance() {
  const [products, setProducts] = useState<ProductAnalytics[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setProducts(mockProductAnalytics)
      setLoading(false)
    }, 500)
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Product Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.map((product) => (
            <div key={product.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-start space-x-4">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-md"
                />

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-900">{product.name}</h4>
                    <Badge
                      className={cn(
                        product.status === "active"
                          ? "bg-green-100 text-green-800"
                          : product.status === "sold"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800",
                      )}
                    >
                      {product.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                    <div className="flex items-center space-x-2">
                      <Eye className="h-4 w-4 text-gray-500" />
                      <div>
                        <div className="text-sm font-medium">{product.views}</div>
                        <div className="text-xs text-gray-500">Views</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Heart className="h-4 w-4 text-gray-500" />
                      <div>
                        <div className="text-sm font-medium">{product.likes}</div>
                        <div className="text-xs text-gray-500">Likes</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <MessageCircle className="h-4 w-4 text-gray-500" />
                      <div>
                        <div className="text-sm font-medium">{product.inquiries}</div>
                        <div className="text-xs text-gray-500">Inquiries</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <ShoppingCart className="h-4 w-4 text-gray-500" />
                      <div>
                        <div className="text-sm font-medium">{product.orders}</div>
                        <div className="text-xs text-gray-500">Orders</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-4">
                      <div>
                        <div className="text-sm font-medium text-purple-600">${product.revenue.toFixed(2)}</div>
                        <div className="text-xs text-gray-500">Revenue</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">{product.conversionRate.toFixed(2)}%</div>
                        <div className="text-xs text-gray-500">Conversion</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        Boost
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
