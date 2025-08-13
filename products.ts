import type { Product, ProductCategory, ProductFilter } from "@/types/product"

// Mock product data - for backward compatibility
export const mockProducts: Product[] = [
  {
    id: "1",
    title: "Data Structures and Algorithms in Java",
    description: "Comprehensive textbook for CS students. Excellent condition with minimal highlighting.",
    price: 800,
    category: "Books",
    condition: "good",
    images: ["/placeholder-f9bsl.png"],
    sellerId: "1",
    sellerName: "John Doe",
    sellerCollege: "IIT Delhi",
    sellerRating: 4.8,
    location: "Campus - Block A",
    deliveryOptions: ["pickup", "campus-delivery"],
    isAvailable: true,
    views: 45,
    likes: 12,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    title: "MacBook Air M2 (2022)",
    description:
      "Barely used MacBook Air with M2 chip. Perfect for coding and design work. Includes charger and original box.",
    price: 85000,
    category: "Electronics",
    condition: "like-new",
    images: ["/sleek-macbook-air.png"],
    sellerId: "2",
    sellerName: "Sarah Wilson",
    sellerCollege: "IIT Delhi",
    sellerRating: 4.9,
    location: "Hostel - Kailash",
    deliveryOptions: ["pickup", "hostel-delivery"],
    isAvailable: true,
    views: 128,
    likes: 34,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
  },
]

export const categoryLabels: Record<ProductCategory, string> = {
  Books: "Books & Textbooks",
  Electronics: "Electronics",
  Fashion: "Fashion & Clothing",
  Stationery: "Stationery & Supplies",
  "Dorm Items": "Dorm & Room Items",
  "Event Tickets": "Event Tickets",
  Other: "Other Items",
}

export const conditionLabels: Record<Product["condition"], string> = {
  new: "Brand New",
  "like-new": "Like New",
  good: "Good Condition",
  fair: "Fair Condition",
}

// Legacy function for backward compatibility
export function filterProducts(products: Product[], filters: ProductFilter): Product[] {
  return products.filter((product) => {
    if (filters.category && product.category !== filters.category) return false
    if (filters.minPrice && product.price < filters.minPrice) return false
    if (filters.maxPrice && product.price > filters.maxPrice) return false
    if (filters.condition && product.condition !== filters.condition) return false
    if (filters.location && !product.location.toLowerCase().includes(filters.location.toLowerCase())) return false
    if (filters.deliveryOptions && !filters.deliveryOptions.some((option) => product.deliveryOptions.includes(option)))
      return false
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      return (
        product.title.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.sellerName.toLowerCase().includes(searchTerm)
      )
    }
    return true
  })
}

export function getProductsBySeller(sellerId: string): Product[] {
  return mockProducts.filter((product) => product.sellerId === sellerId)
}

// API functions to replace mock data operations
export async function getProducts(filters?: ProductFilter): Promise<{ products: Product[]; pagination: any }> {
  const params = new URLSearchParams()

  if (filters?.category) params.append("category", filters.category)
  if (filters?.minPrice) params.append("minPrice", filters.minPrice.toString())
  if (filters?.maxPrice) params.append("maxPrice", filters.maxPrice.toString())
  if (filters?.condition) params.append("condition", filters.condition)
  if (filters?.location) params.append("location", filters.location)
  if (filters?.search) params.append("search", filters.search)
  if (filters?.college) params.append("college", filters.college)

  const response = await fetch(`/api/products?${params.toString()}`)
  if (!response.ok) {
    throw new Error("Failed to fetch products")
  }

  return response.json()
}

export async function getProductById(id: string): Promise<Product> {
  const response = await fetch(`/api/products/${id}`)
  if (!response.ok) {
    throw new Error("Failed to fetch product")
  }

  const data = await response.json()
  return data.product
}

export async function createProduct(productData: Partial<Product>): Promise<Product> {
  const response = await fetch("/api/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to create product")
  }

  const data = await response.json()
  return data.product
}

export async function updateProduct(id: string, productData: Partial<Product>): Promise<Product> {
  const response = await fetch(`/api/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to update product")
  }

  const data = await response.json()
  return data.product
}

export async function deleteProduct(id: string): Promise<void> {
  const response = await fetch(`/api/products/${id}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to delete product")
  }
}

export async function toggleProductLike(id: string): Promise<{ liked: boolean; likesCount: number }> {
  const response = await fetch(`/api/products/${id}/like`, {
    method: "POST",
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to toggle like")
  }

  return response.json()
}
