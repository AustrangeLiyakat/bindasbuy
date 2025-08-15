export interface SellerMetrics {
  totalRevenue: number
  totalOrders: number
  totalProducts: number
  totalViews: number
  conversionRate: number
  averageOrderValue: number
  revenueGrowth: number
  orderGrowth: number
}

export interface SalesData {
  date: string
  revenue: number
  orders: number
  views: number
}

export interface Order {
  id: string
  productId: string
  productName: string
  productImage: string
  buyerId: string
  buyerName: string
  buyerAvatar: string
  quantity: number
  price: number
  total: number
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
  paymentStatus: "pending" | "paid" | "refunded"
  shippingAddress: string
  orderDate: string
  estimatedDelivery?: string
}

export interface ProductAnalytics {
  id: string
  name: string
  image: string
  views: number
  likes: number
  inquiries: number
  orders: number
  revenue: number
  conversionRate: number
  status: "active" | "inactive" | "sold"
}

export interface CustomerInquiry {
  id: string
  productId: string
  productName: string
  customerId: string
  customerName: string
  customerAvatar: string
  message: string
  type: "question" | "negotiation" | "complaint"
  status: "unread" | "read" | "responded"
  createdAt: string
}
