import type React from "react"
import type { Metadata } from "next"
import { Inter, Poppins } from "next/font/google"
import "./app/globals.css"
import BottomNav from "@/components/layout/bottom-nav"
import { AuthProvider } from "@/contexts/auth-context"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: "CampusCart+ | Social Marketplace for Students",
  description: "Buy, sell, and connect with your college community on the ultimate student marketplace",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} antialiased`}>
      <body className="font-sans">
        <AuthProvider>
          {children}
          <BottomNav />
        </AuthProvider>
        {/* <Toaster /> */}
      </body>
    </html>
  )
}
