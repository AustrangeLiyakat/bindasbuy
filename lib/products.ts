import type { Product, ProductCategory, ProductFilter } from "@/types/product"

// Mock product data - for backward compatibility and demo purposes
export const mockProducts: Product[] = [
  {
    id: "1",
    title: "Data Structures and Algorithms in Java",
    description:
      "Comprehensive textbook for CS students. Excellent condition with minimal highlighting. Perfect for semester exams and competitive programming preparation.",
    price: 800,
    category: "Books",
    condition: "good",
    images: ["/placeholder.svg?height=400&width=400&text=DSA+Book"],
    sellerId: "1",
    sellerName: "John Doe",
    sellerCollege: "IIT Delhi",
    sellerRating: 4.8,
    sellerAvatar: "/placeholder.svg?height=40&width=40&text=JD",
    location: "Campus - Block A",
    deliveryOptions: ["pickup", "campus-delivery"],
    isAvailable: true,
    views: 45,
    likes: 12,
    tags: ["textbook", "computer-science", "algorithms"],
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    title: "MacBook Air M2 (2022)",
    description:
      "Barely used MacBook Air with M2 chip, 8GB RAM, 256GB SSD. Perfect for coding and design work. Includes charger and original box. No scratches or dents.",
    price: 85000,
    category: "Electronics",
    condition: "like-new",
    images: ["/placeholder.svg?height=400&width=400&text=MacBook+Air"],
    sellerId: "2",
    sellerName: "Sarah Wilson",
    sellerCollege: "IIT Delhi",
    sellerRating: 4.9,
    sellerAvatar: "/placeholder.svg?height=40&width=40&text=SW",
    location: "Hostel - Kailash",
    deliveryOptions: ["pickup", "hostel-delivery"],
    isAvailable: true,
    views: 128,
    likes: 34,
    tags: ["laptop", "apple", "m2", "programming"],
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
  },
  {
    id: "3",
    title: "College Hoodie - IIT Delhi",
    description:
      "Official IIT Delhi hoodie in excellent condition. Size M. Perfect for campus wear and representing your college pride.",
    price: 1200,
    category: "Fashion",
    condition: "good",
    images: ["/placeholder.svg?height=400&width=400&text=IIT+Hoodie"],
    sellerId: "3",
    sellerName: "Raj Patel",
    sellerCollege: "IIT Delhi",
    sellerRating: 4.7,
    sellerAvatar: "/placeholder.svg?height=40&width=40&text=RP",
    location: "Hostel - Girnar",
    deliveryOptions: ["pickup", "campus-delivery", "hostel-delivery"],
    isAvailable: true,
    views: 67,
    likes: 18,
    tags: ["hoodie", "college", "official", "clothing"],
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-12"),
  },
  {
    id: "4",
    title: "Scientific Calculator - Casio FX-991ES",
    description:
      "Essential scientific calculator for engineering students. All functions working perfectly. Includes user manual.",
    price: 450,
    category: "Stationery",
    condition: "good",
    images: ["/placeholder.svg?height=400&width=400&text=Calculator"],
    sellerId: "4",
    sellerName: "Priya Sharma",
    sellerCollege: "IIT Delhi",
    sellerRating: 4.6,
    sellerAvatar: "/placeholder.svg?height=40&width=40&text=PS",
    location: "Library - Central",
    deliveryOptions: ["pickup", "campus-delivery"],
    isAvailable: true,
    views: 23,
    likes: 5,
    tags: ["calculator", "casio", "scientific", "engineering"],
    createdAt: new Date("2024-01-14"),
    updatedAt: new Date("2024-01-14"),
  },
  {
    id: "5",
    title: "Study Desk Lamp - LED",
    description:
      "Adjustable LED desk lamp perfect for late-night study sessions. Multiple brightness levels and color temperatures.",
    price: 800,
    category: "Dorm Items",
    condition: "like-new",
    images: ["/placeholder.svg?height=400&width=400&text=Desk+Lamp"],
    sellerId: "5",
    sellerName: "Mike Chen",
    sellerCollege: "IIT Delhi",
    sellerRating: 4.8,
    sellerAvatar: "/placeholder.svg?height=40&width=40&text=MC",
    location: "Hostel - Udaigiri",
    deliveryOptions: ["pickup", "hostel-delivery"],
    isAvailable: true,
    views: 34,
    likes: 8,
    tags: ["lamp", "led", "study", "desk"],
    createdAt: new Date("2024-01-13"),
    updatedAt: new Date("2024-01-13"),
  },
  {
    id: "6",
    title: "Tech Fest 2024 - VIP Pass",
    description:
      "VIP access pass for the annual Tech Fest. Includes access to all events, workshops, and exclusive networking sessions.",
    price: 2500,
    category: "Event Tickets",
    condition: "new",
    images: ["/placeholder.svg?height=400&width=400&text=VIP+Pass"],
    sellerId: "6",
    sellerName: "Alex Kumar",
    sellerCollege: "IIT Delhi",
    sellerRating: 4.9,
    sellerAvatar: "/placeholder.svg?height=40&width=40&text=AK",
    location: "Student Activity Center",
    deliveryOptions: ["pickup"],
    isAvailable: true,
    views: 89,
    likes: 25,
    tags: ["ticket", "tech-fest", "vip", "event"],
    createdAt: new Date("2024-01-11"),
    updatedAt: new Date("2024-01-11"),
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
        product.sellerName.toLowerCase().includes(searchTerm) ||
        product.tags?.some((tag) => tag.toLowerCase().includes(searchTerm))
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
  try {
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
  } catch (error) {
    console.error("Error fetching products:", error)
    // Fallback to mock data for demo
    const filteredProducts = filters ? filterProducts(mockProducts, filters) : mockProducts
    return {
      products: filteredProducts,
      pagination: {
        page: 1,
        limit: 20,
        total: filteredProducts.length,
        pages: 1,
      },
    }
  }
}

export function getProductById(id: string): Product | undefined {
  // For demo purposes, return mock data
  return mockProducts.find((product) => product.id === id)
}

export async function createProduct(productData: Partial<Product>): Promise<Product> {
  try {
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
  } catch (error) {
    console.error("Error creating product:", error)
    throw error
  }
}

export async function updateProduct(id: string, productData: Partial<Product>): Promise<Product> {
  try {
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
  } catch (error) {
    console.error("Error updating product:", error)
    throw error
  }
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    const response = await fetch(`/api/products/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to delete product")
    }
  } catch (error) {
    console.error("Error deleting product:", error)
    throw error
  }
}

export async function toggleProductLike(id: string): Promise<{ liked: boolean; likesCount: number }> {
  try {
    const response = await fetch(`/api/products/${id}/like`, {
      method: "POST",
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to toggle like")
    }

    return response.json()
  } catch (error) {
    console.error("Error toggling like:", error)
    throw error
  }
}
