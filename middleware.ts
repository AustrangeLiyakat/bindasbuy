import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Protected routes that require authentication
const protectedRoutes = [
  "/dashboard",
  "/profile",
  "/marketplace/sell",
  "/messages",
  "/reels/create",
  "/feed",
  "/seller",
  "/checkout",
  "/orders",
  "/analytics",
]

// Public routes that should redirect to dashboard if authenticated
const publicRoutes = ["/auth", "/login", "/signup"]

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  console.log("🛡️ Middleware called for path:", path)
  
  // Skip middleware for API routes
  if (path.startsWith('/api/')) {
    console.log("⏭️ Skipping middleware for API route")
    return NextResponse.next()
  }
  
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route))
  const isPublicRoute = publicRoutes.some((route) => path.startsWith(route))

  // Get session from cookie - just check if it exists, don't decrypt
  const cookie = request.cookies.get("session")?.value
  console.log("🍪 Session cookie exists:", !!cookie)
  
  // For now, just check if cookie exists (we'll verify properly in API routes)
  const hasSession = !!cookie
  console.log("👤 Session exists:", hasSession)

  // Redirect to auth if accessing protected route without session
  if (isProtectedRoute && !hasSession) {
    console.log("🔒 Redirecting to auth - no session for protected route")
    return NextResponse.redirect(new URL("/auth", request.nextUrl))
  }

  // Redirect to dashboard if accessing public route with session
  if (isPublicRoute && hasSession) {
    console.log("🏠 Redirecting to dashboard - has session on public route")
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl))
  }

  // Allow access to home page regardless of auth status
  if (path === "/" || (path.startsWith("/marketplace") && !path.includes("/sell"))) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|placeholder.svg).*)"],
  runtime: "nodejs",
}
