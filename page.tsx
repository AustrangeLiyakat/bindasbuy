import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GraduationCap, ShoppingBag, Users, Zap, ArrowRight, LogIn, UserPlus } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Navigation Header */}
      <header className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-purple-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              CampusCart+
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth">
              <Button variant="ghost" className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                Sign In
              </Button>
            </Link>
            <Link href="/auth">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Join Now
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            CampusCart+
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            The social marketplace built exclusively for college students. Buy, sell, and connect with your campus
            community.
          </p>

          {/* Quick Access Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Link href="/marketplace">
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                <ShoppingBag className="h-4 w-4" />
                Browse Marketplace
              </Button>
            </Link>
            <Link href="/feed">
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                <Users className="h-4 w-4" />
                Social Feed
              </Button>
            </Link>
            <Link href="/reels">
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                <Zap className="h-4 w-4" />
                Watch Reels
              </Button>
            </Link>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <ShoppingBag className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Campus Marketplace</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Buy and sell textbooks, electronics, dorm items, and more with verified students
                </CardDescription>
                <Link href="/marketplace">
                  <Button variant="ghost" size="sm" className="w-full">
                    Explore Marketplace <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Social Feed</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Share campus life, discover trending items, and connect with fellow students
                </CardDescription>
                <Link href="/feed">
                  <Button variant="ghost" size="sm" className="w-full">
                    View Feed <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <Zap className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Reels & Stories</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  Create engaging video content to showcase products and campus experiences
                </CardDescription>
                <Link href="/reels">
                  <Button variant="ghost" size="sm" className="w-full">
                    Watch Reels <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="max-w-md mx-auto">
            <Card className="border-0 shadow-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl mb-2">Join CampusCart+</CardTitle>
                <CardDescription className="text-purple-100">Connect with your college community today</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link href="/auth">
                  <Button className="w-full bg-white text-purple-600 hover:bg-gray-100">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <p className="text-sm text-purple-100 text-center">Verify with your college email • Safe & Secure</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
