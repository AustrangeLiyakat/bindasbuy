import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { Product } from "@/types/product"
import { categoryLabels, conditionLabels } from "@/lib/products"
import { Heart, Eye, MapPin, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface ProductCardProps {
  product: Product
  viewMode?: "grid" | "list"
}

export function ProductCard({ product, viewMode = "grid" }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  if (viewMode === "list") {
    return (
      <Card className="hover:shadow-lg transition-shadow">
        <div className="flex">
          <div className="w-48 h-32 relative">
            <Image
              src={product.images[0] || "/placeholder.svg"}
              alt={product.title}
              fill
              className="object-cover rounded-l-lg"
            />
          </div>
          <div className="flex-1 p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <Link href={`/marketplace/product/${product.id}`}>
                  <h3 className="font-semibold text-lg hover:text-purple-600 transition-colors">{product.title}</h3>
                </Link>
                <p className="text-gray-600 text-sm line-clamp-2 mb-2">{product.description}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600">{formatPrice(product.price)}</div>
                <Badge variant="secondary" className="mt-1">
                  {conditionLabels[product.condition]}
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-xs">
                      {product.sellerName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span>{product.sellerName}</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>{product.sellerRating}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>{product.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>{product.views}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Heart className="h-4 w-4" />
                  {product.likes}
                </Button>
                <Link href={`/marketplace/product/${product.id}`}>
                  <Button size="sm">View Details</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="hover:shadow-lg transition-shadow group">
      <div className="relative">
        <div className="aspect-square relative overflow-hidden rounded-t-lg">
          <Image
            src={product.images[0] || "/placeholder.svg"}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="bg-white/90">
            {categoryLabels[product.category]}
          </Badge>
        </div>
        <div className="absolute top-2 right-2">
          <Button variant="ghost" size="sm" className="bg-white/90 hover:bg-white">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <Link href={`/marketplace/product/${product.id}`}>
              <CardTitle className="text-lg hover:text-purple-600 transition-colors line-clamp-1">
                {product.title}
              </CardTitle>
            </Link>
            <CardDescription className="line-clamp-2 mt-1">{product.description}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex justify-between items-center mb-3">
          <div className="text-2xl font-bold text-purple-600">{formatPrice(product.price)}</div>
          <Badge variant="outline">{conditionLabels[product.condition]}</Badge>
        </div>

        <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
          <Avatar className="w-6 h-6">
            <AvatarFallback className="text-xs">
              {product.sellerName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <span className="flex-1 truncate">{product.sellerName}</span>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span>{product.sellerRating}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{product.location}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span>{product.views}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              <span>{product.likes}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Link href={`/marketplace/product/${product.id}`} className="flex-1">
            <Button className="w-full" size="sm">
              View Details
            </Button>
          </Link>
          <Button variant="outline" size="sm">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
