"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Home, ShoppingBag, MessageCircle, Users, User } from "lucide-react"

const navItems = [
  {
    href: "/dashboard",
    icon: Home,
    label: "Home",
    activePattern: /^\/dashboard$/,
  },
  {
    href: "/marketplace",
    icon: ShoppingBag,
    label: "Marketplace",
    activePattern: /^\/marketplace/,
  },
  {
    href: "/feed",
    icon: Users,
    label: "Feed",
    activePattern: /^\/feed/,
  },
  {
    href: "/messages",
    icon: MessageCircle,
    label: "Messages",
    activePattern: /^\/messages/,
  },
  {
    href: "/profile",
    icon: User,
    label: "Profile",
    activePattern: /^\/profile/,
  },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const isActive = item.activePattern.test(pathname)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 text-xs transition-colors",
                isActive ? "text-purple-600 bg-purple-50" : "text-gray-600 hover:text-gray-900",
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive && "text-purple-600")} />
              <span className={cn("text-xs", isActive && "text-purple-600 font-medium")}>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
