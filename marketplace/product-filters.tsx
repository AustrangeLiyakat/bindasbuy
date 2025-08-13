"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import type { ProductFilter, DeliveryOption } from "@/types/product"
import { conditionLabels } from "@/lib/products"

interface ProductFiltersProps {
  filters: ProductFilter
  onFiltersChange: (filters: ProductFilter) => void
}

export function ProductFilters({ filters, onFiltersChange }: ProductFiltersProps) {
  const [localFilters, setLocalFilters] = useState<ProductFilter>(filters)

  const handleFilterChange = (key: keyof ProductFilter, value: any) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleDeliveryOptionChange = (option: DeliveryOption, checked: boolean) => {
    const currentOptions = localFilters.deliveryOptions || []
    const newOptions = checked ? [...currentOptions, option] : currentOptions.filter((o) => o !== option)

    handleFilterChange("deliveryOptions", newOptions.length > 0 ? newOptions : undefined)
  }

  const clearFilters = () => {
    setLocalFilters({})
    onFiltersChange({})
  }

  return (
    <div className="space-y-6">
      {/* Price Range */}
      <div>
        <Label className="text-sm font-semibold">Price Range</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div>
            <Label htmlFor="min-price" className="text-xs text-gray-600">
              Min
            </Label>
            <Input
              id="min-price"
              type="number"
              placeholder="₹0"
              value={localFilters.minPrice || ""}
              onChange={(e) => handleFilterChange("minPrice", e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>
          <div>
            <Label htmlFor="max-price" className="text-xs text-gray-600">
              Max
            </Label>
            <Input
              id="max-price"
              type="number"
              placeholder="₹10000"
              value={localFilters.maxPrice || ""}
              onChange={(e) => handleFilterChange("maxPrice", e.target.value ? Number(e.target.value) : undefined)}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Condition */}
      <div>
        <Label className="text-sm font-semibold">Condition</Label>
        <Select
          value={localFilters.condition || "any"}
          onValueChange={(value) => handleFilterChange("condition", value || undefined)}
        >
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Any condition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any condition</SelectItem>
            {Object.entries(conditionLabels).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Location */}
      <div>
        <Label htmlFor="location" className="text-sm font-semibold">
          Location
        </Label>
        <Input
          id="location"
          placeholder="Campus, Hostel, etc."
          className="mt-2"
          value={localFilters.location || ""}
          onChange={(e) => handleFilterChange("location", e.target.value || undefined)}
        />
      </div>

      <Separator />

      {/* Delivery Options */}
      <div>
        <Label className="text-sm font-semibold">Delivery Options</Label>
        <div className="space-y-2 mt-2">
          {[
            { key: "pickup", label: "Pickup Available" },
            { key: "campus-delivery", label: "Campus Delivery" },
            { key: "hostel-delivery", label: "Hostel Delivery" },
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center space-x-2">
              <Checkbox
                id={key}
                checked={(localFilters.deliveryOptions || []).includes(key as DeliveryOption)}
                onCheckedChange={(checked) => handleDeliveryOptionChange(key as DeliveryOption, checked as boolean)}
              />
              <Label htmlFor={key} className="text-sm">
                {label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Clear Filters */}
      <Button variant="outline" onClick={clearFilters} className="w-full bg-transparent">
        Clear All Filters
      </Button>
    </div>
  )
}
