"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { categoryLabels, conditionLabels } from "@/lib/products"
import type { ProductCategory, DeliveryOption } from "@/types/product"
import { ArrowLeft, Upload, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SellItemPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "" as ProductCategory | "",
    condition: "" as "new" | "like-new" | "good" | "fair" | "",
    location: "",
    deliveryOptions: [] as DeliveryOption[],
    images: [] as string[],
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleDeliveryOptionChange = (option: DeliveryOption, checked: boolean) => {
    const newOptions = checked
      ? [...formData.deliveryOptions, option]
      : formData.deliveryOptions.filter((o) => o !== option)

    handleInputChange("deliveryOptions", newOptions)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    // In a real app, upload to cloud storage and get URLs
    const newImages = files.map((file) => URL.createObjectURL(file))
    handleInputChange("images", [...formData.images, ...newImages])
  }

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index)
    handleInputChange("images", newImages)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate form
      if (!formData.title || !formData.description || !formData.price || !formData.category || !formData.condition) {
        throw new Error("Please fill in all required fields")
      }

      if (formData.deliveryOptions.length === 0) {
        throw new Error("Please select at least one delivery option")
      }

      if (formData.images.length === 0) {
        throw new Error("Please upload at least one image")
      }

      // In a real app, submit to API
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Item listed successfully!",
        description: "Your item is now live on the marketplace.",
      })

      router.push("/marketplace")
    } catch (error) {
      toast({
        title: "Failed to list item",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">Sell an Item</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>List Your Item</CardTitle>
            <CardDescription>Fill in the details below to list your item on CampusCart+</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Images */}
              <div>
                <Label className="text-sm font-semibold">Product Images *</Label>
                <div className="mt-2">
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative aspect-square">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Product ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                    {formData.images.length < 5 && (
                      <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-purple-400 transition-colors">
                        <div className="text-center">
                          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <span className="text-sm text-gray-600">Add Photo</span>
                        </div>
                        <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                      </label>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">Upload up to 5 images. First image will be the main photo.</p>
                </div>
              </div>

              {/* Title */}
              <div>
                <Label htmlFor="title" className="text-sm font-semibold">
                  Title *
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., MacBook Air M2, Data Structures Textbook"
                  className="mt-2"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  required
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description" className="text-sm font-semibold">
                  Description *
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your item's condition, features, and any other relevant details..."
                  className="mt-2 min-h-[100px]"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  required
                />
              </div>

              {/* Price and Category */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price" className="text-sm font-semibold">
                    Price (₹) *
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="1000"
                    className="mt-2"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label className="text-sm font-semibold">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(categoryLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Condition and Location */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold">Condition *</Label>
                  <Select value={formData.condition} onValueChange={(value) => handleInputChange("condition", value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(conditionLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="location" className="text-sm font-semibold">
                    Pickup Location *
                  </Label>
                  <Input
                    id="location"
                    placeholder="e.g., Campus - Block A, Hostel - Kailash"
                    className="mt-2"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Delivery Options */}
              <div>
                <Label className="text-sm font-semibold">Delivery Options *</Label>
                <div className="space-y-2 mt-2">
                  {[
                    { key: "pickup", label: "Pickup from location" },
                    { key: "campus-delivery", label: "Campus delivery (+₹50)" },
                    { key: "hostel-delivery", label: "Hostel delivery (+₹100)" },
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        id={key}
                        checked={formData.deliveryOptions.includes(key as DeliveryOption)}
                        onCheckedChange={(checked) =>
                          handleDeliveryOptionChange(key as DeliveryOption, checked as boolean)
                        }
                      />
                      <Label htmlFor={key} className="text-sm">
                        {label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Listing Item..." : "List Item for Sale"}
                </Button>
                <p className="text-xs text-gray-500 text-center mt-2">
                  By listing this item, you agree to our terms of service and community guidelines.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
