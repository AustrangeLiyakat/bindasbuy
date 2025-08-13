export interface User {
  id: string
  email: string
  fullName: string
  college: string
  studentId?: string
  phone?: string
  role: "student" | "seller"
  isVerified: boolean
  bio?: string
  avatar?: string
  followers: number
  following: number
  createdAt: Date
  updatedAt: Date
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupData {
  email: string
  password: string
  fullName: string
  college: string
  studentId: string
  department: string
  phone: string
  role?: "student" | "seller"
}
