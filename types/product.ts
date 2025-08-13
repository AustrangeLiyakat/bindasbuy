export type ProductCategory =
  | "Books"
  | "Electronics"
  | "Fashion"
  | "Stationery"
  | "Dorm Items"
  | "Event Tickets"
  | "Other"

export type ProductCondition = "new" | "like-new" | "good" | "fair"

export type DeliveryOption = "pickup" | "campus-delivery" | "hostel-delivery"

export interface Product {
  id: string
  title: string
  description: string
  price: number
  category: ProductCategory
  condition: ProductCondition
  images: string[]
  sellerId: string
  sellerName: string
  sellerCollege: string
  sellerRating?: number
  sellerAvatar?: string
  location: string
  deliveryOptions: DeliveryOption[]
  isAvailable: boolean
  views: number
  likes: number
  tags?: string[]
  createdAt: Date
  updatedAt: Date
}

export interface ProductFilter {
  category?: ProductCategory
  minPrice?: number
  maxPrice?: number
  condition?: ProductCondition
  location?: string
  deliveryOptions?: DeliveryOption[]
  search?: string
  college?: string
}
