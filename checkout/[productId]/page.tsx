"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, CreditCard, Shield, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PaymentMethodSelector } from "@/components/payment/payment-method-selector"
import { OrderSummary } from "@/components/payment/order-summary"
import { mockProducts } from "@/lib/products"
import { calculateFee, formatCurrency } from "@/lib/payment"
import type { Product } from "@/types/product"
import type { CheckoutSession } from "@/types/payment"
import { useAuth } from "@/contexts/auth-context"

interface CheckoutPageProps {
  params: {
    productId: string
  }
}

export default function CheckoutPage({ params }: CheckoutPageProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [checkoutSession, setCheckoutSession] = useState<CheckoutSession | null>(null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    // Load product data
    const foundProduct = mockProducts.find((p) => p.id === params.productId)
    if (foundProduct) {
      setProduct(foundProduct)
      setCheckoutSession({
        productId: foundProduct.id,
        productName: foundProduct.name,
        productImage: foundProduct.images[0] || "/placeholder.svg",
        price: foundProduct.price,
        quantity: 1,
        sellerId: foundProduct.sellerId,
        sellerName: foundProduct.sellerName,
        shippingAddress: {
          name: "",
          address: "",
          city: "",
          state: "",
          zipCode: "",
          country: "US",
        },
      })
    }
    setLoading(false)
  }, [params.productId])

  const handleAddressChange = (field: string, value: string) => {
    if (!checkoutSession) return
    setCheckoutSession({
      ...checkoutSession,
      shippingAddress: {
        ...checkoutSession.shippingAddress,
        [field]: value,
      },
    })
  }

  const handlePayment = async () => {
    if (!checkoutSession || !selectedPaymentMethod) return

    setIsProcessing(true)

    try {
      if (selectedPaymentMethod === "razorpay") {
        // Added Razorpay integration with proper error handling
        // Load Razorpay script
        const script = document.createElement("script")
        script.src = "https://checkout.razorpay.com/v1/checkout.js"
        script.async = true
        document.body.appendChild(script)

        script.onload = () => {
          const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: Math.round(checkoutSession.price * checkoutSession.quantity * 100), // Amount in paise
            currency: "INR",
            name: "CampusCart+",
            description: `Payment for ${checkoutSession.productName}`,
            image: "/logo.png",
            order_id: `order_${Date.now()}`, // You should generate this from backend
            handler: (response: any) => {
              // Payment successful
              console.log("Payment successful:", response)
              setIsProcessing(false)
              router.push(`/checkout/success?orderId=ORD-${Date.now()}&paymentId=${response.razorpay_payment_id}`)
            },
            prefill: {
              name: checkoutSession.shippingAddress.name,
              email: user?.email || "",
              contact: "9999999999", // You can add phone field to form
            },
            notes: {
              address: checkoutSession.shippingAddress.address,
              productId: checkoutSession.productId,
            },
            theme: {
              color: "#7C3AED",
            },
            modal: {
              ondismiss: () => {
                setIsProcessing(false)
              },
            },
          }

          const rzp = new (window as any).Razorpay(options)
          rzp.open()
        }

        script.onerror = () => {
          setIsProcessing(false)
          alert("Failed to load Razorpay. Please try again.")
        }
      } else {
        // For other payment methods, simulate processing
        setTimeout(() => {
          setIsProcessing(false)
          router.push(`/checkout/success?orderId=ORD-${Date.now()}`)
        }, 3000)
      }
    } catch (error) {
      console.error("Payment error:", error)
      setIsProcessing(false)
      alert("Payment failed. Please try again.")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!product || !checkoutSession) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-xl font-semibold mb-2">Product not found</h1>
        <Button onClick={() => router.push("/marketplace")}>Back to Marketplace</Button>
      </div>
    )
  }

  const subtotal = checkoutSession.price * checkoutSession.quantity
  const fee = calculateFee(subtotal)
  const total = subtotal + fee

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-6">
            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="h-5 w-5 mr-2" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={checkoutSession.shippingAddress.name}
                    onChange={(e) => handleAddressChange("name", e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={checkoutSession.shippingAddress.address}
                    onChange={(e) => handleAddressChange("address", e.target.value)}
                    placeholder="Enter your address"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={checkoutSession.shippingAddress.city}
                      onChange={(e) => handleAddressChange("city", e.target.value)}
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={checkoutSession.shippingAddress.state}
                      onChange={(e) => handleAddressChange("state", e.target.value)}
                      placeholder="State"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    value={checkoutSession.shippingAddress.zipCode}
                    onChange={(e) => handleAddressChange("zipCode", e.target.value)}
                    placeholder="ZIP Code"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PaymentMethodSelector
                  selectedMethod={selectedPaymentMethod}
                  onMethodSelect={setSelectedPaymentMethod}
                />
              </CardContent>
            </Card>

            {/* Security Notice */}
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-800">Secure Payment</p>
                    <p className="text-xs text-green-600">Your payment information is encrypted and secure</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <OrderSummary
              product={product}
              quantity={checkoutSession.quantity}
              subtotal={subtotal}
              fee={fee}
              total={total}
            />

            {/* Place Order Button */}
            <Button
              onClick={handlePayment}
              disabled={
                !selectedPaymentMethod ||
                !checkoutSession.shippingAddress.name ||
                !checkoutSession.shippingAddress.address ||
                isProcessing
              }
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Processing Payment...
                </>
              ) : (
                `Pay ${formatCurrency(total)}`
              )}
            </Button>

            <p className="text-xs text-gray-500 text-center">
              By placing your order, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
