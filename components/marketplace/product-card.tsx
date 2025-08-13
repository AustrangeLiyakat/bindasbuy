"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageCircle, MapPin, Eye } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { Product } from "@/types/product"
import { conditionLabels } from "@/lib/products"

interface ProductCardProps {
  product: Product
  viewMode?: "grid" | "list"
}

export function ProductCard({ product, viewMode = "grid" }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsLiked(!isLiked)
  }

  const handleMessage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // Handle message functionality
  }

  if (viewMode === "list") {
    return (
      <Link href={`/marketplace/product/${product.id}`}>
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="relative w-24 h-24 flex-shrink-0">
                <Image
                  src={product.images[0] || "/placeholder.svg"}
                  alt={product.title}
                  fill
                  className="object-cover rounded-lg"
                />
                {!product.isAvailable && (
                  <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                    <Badge variant="destructive">Sold</Badge>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg truncate pr-2">{product.title}</h3>
                  <div className="text-xl font-bold text-purple-600 flex-shrink-0">{formatPrice(product.price)}</div>
                </div>

                <p className="text-gray-600 text-sm line-clamp-2 mb-3">{product.description}</p>

                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline">{conditionLabels[product.condition]}</Badge>
                  <Badge variant="secondary">{product.category}</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={product.sellerAvatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-xs">
                        {product.sellerName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-sm">
                      <div className="font-medium">{product.sellerName}</div>
                      <div className="text-gray-500 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {product.location}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={handleLike} className="h-8 w-8 p-0">
                      <Heart className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleMessage} className="h-8 w-8 p-0">
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    )
  }

  return (
    <Link href={`/marketplace/product/${product.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
        <CardContent className="p-0">
          <div className="relative aspect-square">
            <Image
              src={product.images[0] || "/placeholder.svg"}
              alt={product.title}
              fill
              className="object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
            />

            {!product.isAvailable && (
              <div className="absolute inset-0 bg-black/50 rounded-t-lg flex items-center justify-center">
                <Badge variant="destructive">Sold Out</Badge>
              </div>
            )}

            <div className="absolute top-3 left-3">
              <Badge variant="secondary" className="bg-white/90 text-gray-900">
                {product.category}
              </Badge>
            </div>

            <div className="absolute top-3 right-3 flex gap-1">
              <Button variant="ghost" size="sm" onClick={handleLike} className="h-8 w-8 p-0 bg-white/90 hover:bg-white">
                <Heart className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
              </Button>
            </div>

            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <div className="flex items-center gap-1 text-white text-xs bg-black/50 rounded px-2 py-1">
                <Eye className="h-3 w-3" />
                {product.views}
              </div>
              <div className="text-white text-xs bg-black/50 rounded px-2 py-1">{product.likes} likes</div>
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-lg line-clamp-1 pr-2">{product.title}</h3>
              <div className="text-xl font-bold text-purple-600 flex-shrink-0">{formatPrice(product.price)}</div>
            </div>

            <p className="text-gray-600 text-sm line-clamp-2 mb-3">{product.description}</p>

            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline" className="text-xs">
                {conditionLabels[product.condition]}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={product.sellerAvatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-xs">
                    {product.sellerName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <div className="font-medium">{product.sellerName}</div>
                  <div className="text-gray-500 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {product.location}
                  </div>
                </div>
              </div>

              <Button variant="ghost" size="sm" onClick={handleMessage} className="h-8 w-8 p-0">
                <MessageCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
