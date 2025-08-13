"use client"

import type React from "react"

import { useState } from "react"
import { CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import type { PaymentMethod } from "@/types/payment"

interface AddPaymentMethodDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddMethod: (method: PaymentMethod) => void
}

export function AddPaymentMethodDialog({ open, onOpenChange, onAddMethod }: AddPaymentMethodDialogProps) {
  const [cardNumber, setCardNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [name, setName] = useState("")
  const [isDefault, setIsDefault] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return v
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\D/g, "")
    if (v.length >= 2) {
      return `${v.slice(0, 2)}/${v.slice(2, 4)}`
    }
    return v
  }

  const getCardBrand = (number: string) => {
    const num = number.replace(/\s/g, "")
    if (num.startsWith("4")) return "visa"
    if (num.startsWith("5")) return "mastercard"
    if (num.startsWith("3")) return "amex"
    return "unknown"
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!cardNumber || !expiryDate || !cvv || !name) return

    setIsProcessing(true)

    // Simulate API call
    setTimeout(() => {
      const [month, year] = expiryDate.split("/")
      const newMethod: PaymentMethod = {
        id: `pm_${Date.now()}`,
        type: "card",
        brand: getCardBrand(cardNumber),
        last4: cardNumber.replace(/\s/g, "").slice(-4),
        expiryMonth: Number.parseInt(month),
        expiryYear: Number.parseInt(`20${year}`),
        isDefault,
        createdAt: new Date().toISOString(),
      }

      onAddMethod(newMethod)
      setIsProcessing(false)

      // Reset form
      setCardNumber("")
      setExpiryDate("")
      setCvv("")
      setName("")
      setIsDefault(false)
    }, 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Add Payment Method
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                value={expiryDate}
                onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                placeholder="MM/YY"
                maxLength={5}
                required
              />
            </div>
            <div>
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                placeholder="123"
                maxLength={4}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="name">Cardholder Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="default" checked={isDefault} onCheckedChange={(checked) => setIsDefault(checked === true)} />
            <Label htmlFor="default" className="text-sm">
              Set as default payment method
            </Label>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isProcessing}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Adding...
                </>
              ) : (
                "Add Card"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
