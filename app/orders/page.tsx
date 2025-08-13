"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Package, Clock, CheckCircle, XCircle, Truck, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"

interface Order {
  id: string
  buyer: {
    id: string
    name: string
    email: string
    college: string
    avatar: string
  }
  seller: {
    id: string
    name: string
    email: string
    college: string
    avatar: string
  }
  product: {
    id: string
    title: string
    price: number
    images: string[]
    category: string
  }
  quantity: number
  totalAmount: number
  shippingAddress: any
  paymentMethod: string
  paymentStatus: string
  orderStatus: string
  razorpayOrderId?: string
  razorpayPaymentId?: string
  deliveryDate?: string
  createdAt: string
  updatedAt: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    fetchOrders()
  }, [activeTab])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/orders?type=${activeTab}`)
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders)
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />
      case "shipped":
        return <Truck className="h-4 w-4" />
      case "delivered":
        return <CheckCircle className="h-4 w-4" />
      case "cancelled":
        return <XCircle className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="buyer">As Buyer</TabsTrigger>
            <TabsTrigger value="seller">As Seller</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {orders.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Package className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
                  <p className="text-gray-600 text-center mb-4">
                    {activeTab === "buyer"
                      ? "You haven't made any purchases yet"
                      : activeTab === "seller"
                        ? "You haven't received any orders yet"
                        : "You don't have any orders yet"}
                  </p>
                  <Button onClick={() => router.push("/marketplace")}>Browse Products</Button>
                </CardContent>
              </Card>
            ) : (
              orders.map((order) => (
                <Card key={order.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={order.product.images[0] || "/placeholder.svg"}
                          alt={order.product.title}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div>
                          <h3 className="font-semibold text-lg">{order.product.title}</h3>
                          <p className="text-sm text-gray-600">
                            {activeTab === "seller" ? `Buyer: ${order.buyer.name}` : `Seller: ${order.seller.name}`}
                          </p>
                          <p className="text-sm text-gray-500">Order #{order.id.slice(-8)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold">₹{order.totalAmount.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">Qty: {order.quantity}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Badge className={`${getStatusColor(order.orderStatus)} flex items-center space-x-1`}>
                          {getStatusIcon(order.orderStatus)}
                          <span className="capitalize">{order.orderStatus}</span>
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                          {order.paymentStatus}
                        </Badge>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            router.push(`/messages?user=${activeTab === "seller" ? order.buyer.id : order.seller.id}`)
                          }
                        >
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Message
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => router.push(`/orders/${order.id}`)}>
                          View Details
                        </Button>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t text-sm text-gray-600">
                      <p>Ordered on {new Date(order.createdAt).toLocaleDateString()}</p>
                      {order.deliveryDate && (
                        <p>Expected delivery: {new Date(order.deliveryDate).toLocaleDateString()}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
