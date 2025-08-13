"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/payment"
import type { Product } from "@/types/product"

interface OrderSummaryProps {
  product: Product
  quantity: number
  subtotal: number
  fee: number
  total: number
}

export function OrderSummary({ product, quantity, subtotal, fee, total }: OrderSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Product */}
        <div className="flex items-center space-x-4">
          <img
            src={product.images[0] || "/placeholder.svg"}
            alt={product.name}
            className="w-16 h-16 object-cover rounded-md"
          />
          <div className="flex-1">
            <h4 className="font-semibold">{product.name}</h4>
            <p className="text-sm text-gray-600">Sold by {product.sellerName}</p>
            <p className="text-sm text-gray-600">Qty: {quantity}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold">{formatCurrency(product.price)}</p>
          </div>
        </div>

        <Separator />

        {/* Pricing Breakdown */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Processing Fee</span>
            <span>{formatCurrency(fee)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Shipping</span>
            <span>Free</span>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>

        {/* Delivery Info */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm font-medium">Estimated Delivery</p>
          <p className="text-sm text-gray-600">3-5 business days</p>
        </div>
      </CardContent>
    </Card>
  )
}
