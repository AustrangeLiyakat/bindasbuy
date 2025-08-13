"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { AddPaymentMethodDialog } from "@/components/payment/add-payment-method-dialog"
import { mockPaymentMethods } from "@/lib/payment"
import type { PaymentMethod } from "@/types/payment"
import { cn } from "@/lib/utils"

interface PaymentMethodSelectorProps {
  selectedMethod: string
  onMethodSelect: (methodId: string) => void
}

export function PaymentMethodSelector({ selectedMethod, onMethodSelect }: PaymentMethodSelectorProps) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load payment methods with Razorpay as default option
    setTimeout(() => {
      const razorpayMethod: PaymentMethod = {
        id: "razorpay",
        type: "razorpay",
        brand: "Razorpay",
        last4: "",
        expiryMonth: null,
        expiryYear: null,
        isDefault: true,
      }

      const allMethods = [razorpayMethod, ...mockPaymentMethods]
      setPaymentMethods(allMethods)

      if (!selectedMethod) {
        onMethodSelect("razorpay")
      }
      setLoading(false)
    }, 500)
  }, [selectedMethod, onMethodSelect])

  const getPaymentIcon = (method: PaymentMethod) => {
    if (method.type === "razorpay") {
      return "💰"
    }
    switch (method.brand?.toLowerCase()) {
      case "visa":
        return "💳"
      case "mastercard":
        return "💳"
      case "amex":
        return "💳"
      default:
        return "💳"
    }
  }

  const getPaymentLabel = (method: PaymentMethod) => {
    if (method.type === "razorpay") {
      return "Razorpay - UPI, Cards, Net Banking"
    }
    return `${method.brand?.toUpperCase()} •••• ${method.last4}`
  }

  const getPaymentSubLabel = (method: PaymentMethod) => {
    if (method.type === "razorpay") {
      return "Secure payment gateway"
    }
    return `Expires ${method.expiryMonth?.toString().padStart(2, "0")}/${method.expiryYear}`
  }

  const handleAddPaymentMethod = (method: PaymentMethod) => {
    setPaymentMethods((prev) => [...prev, method])
    onMethodSelect(method.id)
    setShowAddDialog(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <RadioGroup value={selectedMethod} onValueChange={onMethodSelect}>
        {paymentMethods.map((method) => (
          <div key={method.id} className="flex items-center space-x-2">
            <RadioGroupItem value={method.id} id={method.id} />
            <Label htmlFor={method.id} className="flex-1 cursor-pointer">
              <Card className={cn("transition-colors", selectedMethod === method.id && "ring-2 ring-purple-600")}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{getPaymentIcon(method)}</div>
                      <div>
                        <div className="font-medium">{getPaymentLabel(method)}</div>
                        <div className="text-sm text-gray-500">{getPaymentSubLabel(method)}</div>
                      </div>
                    </div>
                    {method.isDefault && (
                      <div className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">Default</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Label>
          </div>
        ))}
      </RadioGroup>

      <Button
        variant="outline"
        onClick={() => setShowAddDialog(true)}
        className="w-full border-dashed border-2 border-gray-300 hover:border-purple-600"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add New Payment Method
      </Button>

      <AddPaymentMethodDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAddMethod={handleAddPaymentMethod}
      />
    </div>
  )
}
