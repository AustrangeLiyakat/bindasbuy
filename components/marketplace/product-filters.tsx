"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import type { ProductFilter, DeliveryOption } from "@/types/product"
import { categoryLabels, conditionLabels } from "@/lib/products"

interface ProductFiltersProps {
  filters: ProductFilter
  onFiltersChange: (filters: ProductFilter) => void
}

export function ProductFilters({ filters, onFiltersChange }: ProductFiltersProps) {
  const [priceRange, setPriceRange] = useState([filters.minPrice || 0, filters.maxPrice || 100000])

  const handleFilterChange = (key: keyof ProductFilter, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    })
  }

  const handlePriceRangeChange = (values: number[]) => {
    setPriceRange(values)
    onFiltersChange({
      ...filters,
      minPrice: values[0],
      maxPrice: values[1],
    })
  }

  const handleDeliveryOptionChange = (option: DeliveryOption, checked: boolean) => {
    const currentOptions = filters.deliveryOptions || []
    const newOptions = checked ? [...currentOptions, option] : currentOptions.filter((o) => o !== option)

    handleFilterChange("deliveryOptions", newOptions.length > 0 ? newOptions : undefined)
  }

  const clearFilters = () => {
    onFiltersChange({})
    setPriceRange([0, 100000])
  }

  const activeFiltersCount = Object.values(filters).filter(Boolean).length

  const deliveryOptions: { value: DeliveryOption; label: string }[] = [
    { value: "pickup", label: "Pickup from seller" },
    { value: "campus-delivery", label: "Campus delivery" },
    { value: "hostel-delivery", label: "Hostel delivery" },
  ]

  return (
    <div className="space-y-6">
      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <Label className="text-sm font-medium">Active Filters ({activeFiltersCount})</Label>
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear All
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.category && (
              <Badge variant="secondary" className="gap-1">
                {categoryLabels[filters.category]}
                <X className="h-3 w-3 cursor-pointer" onClick={() => handleFilterChange("category", undefined)} />
              </Badge>
            )}
            {filters.condition && (
              <Badge variant="secondary" className="gap-1">
                {conditionLabels[filters.condition]}
                <X className="h-3 w-3 cursor-pointer" onClick={() => handleFilterChange("condition", undefined)} />
              </Badge>
            )}
            {(filters.minPrice || filters.maxPrice) && (
              <Badge variant="secondary" className="gap-1">
                ₹{filters.minPrice || 0} - ₹{filters.maxPrice || 100000}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => {
                    handleFilterChange("minPrice", undefined)
                    handleFilterChange("maxPrice", undefined)
                    setPriceRange([0, 100000])
                  }}
                />
              </Badge>
            )}
            {filters.location && (
              <Badge variant="secondary" className="gap-1">
                {filters.location}
                <X className="h-3 w-3 cursor-pointer" onClick={() => handleFilterChange("location", undefined)} />
              </Badge>
            )}
          </div>
        </div>
      )}

      <Separator />

      {/* Price Range */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Price Range</Label>
        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={handlePriceRangeChange}
            max={100000}
            min={0}
            step={100}
            className="w-full"
          />
        </div>
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>₹{priceRange[0].toLocaleString()}</span>
          <span>₹{priceRange[1].toLocaleString()}</span>
        </div>
      </div>

      <Separator />

      {/* Category */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Category</Label>
        <Select
          value={filters.category || "all-categories"}
          onValueChange={(value) => handleFilterChange("category", value || undefined)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-categories">All categories</SelectItem>
            {Object.entries(categoryLabels).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Condition */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Condition</Label>
        <Select
          value={filters.condition || "any-condition"}
          onValueChange={(value) => handleFilterChange("condition", value || undefined)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Any condition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any-condition">Any condition</SelectItem>
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
      <div className="space-y-3">
        <Label className="text-sm font-medium">Location</Label>
        <Input
          placeholder="Enter location (e.g., Hostel, Block A)"
          value={filters.location || ""}
          onChange={(e) => handleFilterChange("location", e.target.value || undefined)}
        />
      </div>

      <Separator />

      {/* Delivery Options */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Delivery Options</Label>
        <div className="space-y-2">
          {deliveryOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={option.value}
                checked={filters.deliveryOptions?.includes(option.value) || false}
                onCheckedChange={(checked) => handleDeliveryOptionChange(option.value, checked as boolean)}
              />
              <Label htmlFor={option.value} className="text-sm font-normal">
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
