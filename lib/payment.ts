import type { PaymentMethod, Transaction } from "@/types/payment"

export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: "pm_1",
    type: "card",
    brand: "visa",
    last4: "4242",
    expiryMonth: 12,
    expiryYear: 2025,
    isDefault: true,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "pm_2",
    type: "card",
    brand: "mastercard",
    last4: "5555",
    expiryMonth: 8,
    expiryYear: 2026,
    isDefault: false,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export const mockTransactions: Transaction[] = [
  {
    id: "txn_1",
    orderId: "ORD-001",
    productId: "1",
    productName: "MacBook Pro 13-inch",
    productImage: "/placeholder.svg?height=60&width=60",
    sellerId: "seller1",
    sellerName: "Alex Chen",
    buyerId: "buyer1",
    buyerName: "Sarah Johnson",
    amount: 899.0,
    fee: 26.97,
    netAmount: 872.03,
    currency: "usd",
    status: "completed",
    paymentMethod: "Visa •••• 4242",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "txn_2",
    orderId: "ORD-002",
    productId: "2",
    productName: "Chemistry Textbook",
    productImage: "/placeholder.svg?height=60&width=60",
    sellerId: "seller2",
    sellerName: "Mike Rodriguez",
    buyerId: "buyer2",
    buyerName: "Emma Davis",
    amount: 90.0,
    fee: 2.7,
    netAmount: 87.3,
    currency: "usd",
    status: "completed",
    paymentMethod: "Mastercard •••• 5555",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "txn_3",
    orderId: "ORD-003",
    productId: "3",
    productName: "Desk Lamp",
    productImage: "/placeholder.svg?height=60&width=60",
    sellerId: "seller3",
    sellerName: "Lisa Wang",
    buyerId: "buyer3",
    buyerName: "David Kim",
    amount: 25.99,
    fee: 0.78,
    netAmount: 25.21,
    currency: "usd",
    status: "pending",
    paymentMethod: "Visa •••• 4242",
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
]

export const calculateFee = (amount: number): number => {
  // Stripe fee: 2.9% + $0.30
  return Math.round((amount * 0.029 + 0.3) * 100) / 100
}

export const formatCurrency = (amount: number, currency = "USD"): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount)
}
