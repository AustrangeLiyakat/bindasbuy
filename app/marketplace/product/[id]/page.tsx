"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Heart, Share2, MessageCircle, MapPin, Eye, Star, Shield, Truck } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { getProductById, conditionLabels } from "@/lib/products"
import type { Product } from "@/types/product"

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const { toast } = useToast()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const productData = getProductById(params.id as string)
        if (productData) {
          setProduct(productData)
        } else {
          toast({
            title: "Product not found",
            description: "The item you're looking for doesn't exist",
            variant: "destructive",
          })
          router.push("/marketplace")
        }
      } catch (error) {
        toast({
          title: "Error loading product",
          description: "Please try again later",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      loadProduct()
    }
  }, [params.id, router, toast])

  const handleLike = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please log in to like items",
        variant: "destructive",
      })
      return
    }
    setIsLiked(!isLiked)
    toast({
      title: isLiked ? "Removed from favorites" : "Added to favorites",
      description: isLiked ? "Item removed from your favorites" : "Item added to your favorites",
    })
  }

  const handleMessage = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please log in to message sellers",
        variant: "destructive",
      })
      return
    }

    if (user?.id === product?.sellerId) {
      toast({
        title: "Cannot message yourself",
        description: "This is your own listing",
        variant: "destructive",
      })
      return
    }

    router.push(`/messages?user=${product?.sellerId}`)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.title,
          text: product?.description,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied",
        description: "Product link copied to clipboard",
      })
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="aspect-square bg-gray-200 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Product not found</h2>
          <p className="text-gray-600 mb-4">The item you're looking for doesn't exist</p>
          <Link href="/marketplace">
            <Button>Back to Marketplace</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLike}>
                <Heart className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square relative bg-white rounded-lg border overflow-hidden">
              <Image
                src={product.images[currentImageIndex] || "/placeholder.svg"}
                alt={product.title}
                fill
                className="object-cover"
              />
              {!product.isAvailable && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Badge variant="destructive" className="text-lg px-4 py-2">
                    Sold Out
                  </Badge>
                </div>
              )}
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden ${
                      currentImageIndex === index ? "border-purple-500" : "border-gray-200"
                    }`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.title} ${index + 1}`}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
                <div className="text-3xl font-bold text-purple-600">{formatPrice(product.price)}</div>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline">{conditionLabels[product.condition]}</Badge>
                <Badge variant="secondary">{product.category}</Badge>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Eye className="h-4 w-4" />
                  {product.views} views
                </div>
              </div>

              <p className="text-gray-700 text-lg leading-relaxed">{product.description}</p>
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Delivery Options */}
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Delivery Options
              </h3>
              <div className="space-y-2">
                {product.deliveryOptions.map((option) => (
                  <div key={option} className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    {option === "pickup" && "Pickup from seller"}
                    {option === "campus-delivery" && "Campus delivery available"}
                    {option === "hostel-delivery" && "Hostel delivery available"}
                  </div>
                ))}
              </div>
            </div>

            {/* Location */}
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location
              </h3>
              <p className="text-gray-700">{product.location}</p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {product.isAvailable ? (
                <>
                  <Button
                    onClick={handleMessage}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg py-6"
                    disabled={user?.id === product.sellerId}
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    {user?.id === product.sellerId ? "Your Listing" : "Message Seller"}
                  </Button>

                  {user?.id !== product.sellerId && (
                    <Link href={`/checkout/${product.id}`}>
                      <Button variant="outline" className="w-full text-lg py-6 bg-transparent">
                        Buy Now
                      </Button>
                    </Link>
                  )}
                </>
              ) : (
                <Button disabled className="w-full text-lg py-6">
                  Item Sold Out
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Seller Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Seller Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={product.sellerAvatar || "/placeholder.svg"} />
                <AvatarFallback className="text-lg">
                  {product.sellerName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <h3 className="text-xl font-semibold">{product.sellerName}</h3>
                <p className="text-gray-600">{product.sellerCollege}</p>

                {product.sellerRating && (
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{product.sellerRating}</span>
                    <span className="text-gray-600 text-sm">(Based on previous sales)</span>
                  </div>
                )}
              </div>

              <div className="text-right">
                <Link href={`/profile/${product.sellerId}`}>
                  <Button variant="outline">View Profile</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Safety Tips */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              Safety Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">For Buyers:</h4>
                <ul className="space-y-1">
                  <li>• Meet in public places on campus</li>
                  <li>• Inspect items before payment</li>
                  <li>• Use secure payment methods</li>
                  <li>• Trust your instincts</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">For Sellers:</h4>
                <ul className="space-y-1">
                  <li>• Meet buyers in safe locations</li>
                  <li>• Verify payment before handover</li>
                  <li>• Keep transaction records</li>
                  <li>• Report suspicious activity</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
