"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle, Download, MessageCircle, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function CheckoutSuccessPage() {
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")

  useEffect(() => {
    if (orderId) {
      // Mock order details
      setOrderDetails({
        id: orderId,
        productName: "MacBook Pro 13-inch",
        productImage: "/placeholder.svg?height=80&width=80",
        sellerName: "Alex Chen",
        amount: 899.0,
        estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      })
    }
  }, [orderId])

  if (!orderDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600">Your order has been confirmed and is being processed</p>
        </div>

        {/* Order Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <img
                src={orderDetails.productImage || "/placeholder.svg"}
                alt={orderDetails.productName}
                className="w-16 h-16 object-cover rounded-md"
              />
              <div className="flex-1">
                <h4 className="font-semibold">{orderDetails.productName}</h4>
                <p className="text-sm text-gray-600">Sold by {orderDetails.sellerName}</p>
                <p className="text-sm text-gray-600">Order #{orderDetails.id}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">${orderDetails.amount.toFixed(2)}</p>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">Payment Status</p>
                <p className="text-green-600">Completed</p>
              </div>
              <div>
                <p className="font-medium">Estimated Delivery</p>
                <p className="text-gray-600">{orderDetails.estimatedDelivery}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <Package className="h-5 w-5 text-purple-600 mt-0.5" />
              <div>
                <p className="font-medium">Order Processing</p>
                <p className="text-sm text-gray-600">The seller will prepare your item for shipping</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <MessageCircle className="h-5 w-5 text-purple-600 mt-0.5" />
              <div>
                <p className="font-medium">Stay Connected</p>
                <p className="text-sm text-gray-600">You can message the seller if you have any questions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={() => router.push("/orders")}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <Package className="h-4 w-4 mr-2" />
            View Order Status
          </Button>
          <Button variant="outline" onClick={() => router.push("/marketplace")} className="w-full">
            Continue Shopping
          </Button>
          <Button variant="outline" className="w-full bg-transparent">
            <Download className="h-4 w-4 mr-2" />
            Download Receipt
          </Button>
        </div>
      </div>
    </div>
  )
}
