"use client"

import { useState, useEffect } from "react"
import { DollarSign, Package, Eye, TrendingUp, ShoppingCart, MessageSquare } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MetricCard } from "@/components/seller/metric-card"
import { SalesChart } from "@/components/seller/sales-chart"
import { RecentOrders } from "@/components/seller/recent-orders"
import { ProductPerformance } from "@/components/seller/product-performance"
import { CustomerInquiries } from "@/components/seller/customer-inquiries"
import { mockSellerMetrics, mockSalesData } from "@/lib/seller"
import type { SellerMetrics, SalesData } from "@/types/seller"

export default function SellerDashboard() {
  const [metrics, setMetrics] = useState<SellerMetrics | null>(null)
  const [salesData, setSalesData] = useState<SalesData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setMetrics(mockSellerMetrics)
      setSalesData(mockSalesData)
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!metrics) return null

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-20 md:pb-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Seller Dashboard</h1>
            <p className="text-gray-600">Track your sales performance and manage your business</p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="text-sm text-gray-500">Last updated: {new Date().toLocaleString()}</div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard
            title="Total Revenue"
            value={`$${metrics.totalRevenue.toFixed(2)}`}
            change={`+${metrics.revenueGrowth}%`}
            icon={DollarSign}
            trend="up"
          />
          <MetricCard
            title="Total Orders"
            value={metrics.totalOrders.toString()}
            change={`+${metrics.orderGrowth}%`}
            icon={ShoppingCart}
            trend="up"
          />
          <MetricCard title="Products Listed" value={metrics.totalProducts.toString()} icon={Package} />
          <MetricCard title="Total Views" value={metrics.totalViews.toString()} icon={Eye} />
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Conversion Rate</span>
                <span className="font-semibold">{metrics.conversionRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Average Order Value</span>
                <span className="font-semibold">${metrics.averageOrderValue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Revenue per View</span>
                <span className="font-semibold">${(metrics.totalRevenue / metrics.totalViews).toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <Package className="h-5 w-5 text-purple-600" />
                  <span className="font-medium">Add New Product</span>
                </div>
              </button>
              <button className="w-full text-left p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">View Messages</span>
                </div>
              </button>
              <button className="w-full text-left p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span className="font-medium">View Analytics</span>
                </div>
              </button>
            </CardContent>
          </Card>
        </div>

        {/* Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <SalesChart data={salesData} />
          </CardContent>
        </Card>

        {/* Tabs for detailed views */}
        <Tabs defaultValue="orders" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="orders">Recent Orders</TabsTrigger>
            <TabsTrigger value="products">Product Performance</TabsTrigger>
            <TabsTrigger value="inquiries">Customer Inquiries</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <RecentOrders />
          </TabsContent>

          <TabsContent value="products">
            <ProductPerformance />
          </TabsContent>

          <TabsContent value="inquiries">
            <CustomerInquiries />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
