"use client"

import { useState, useEffect } from "react"
import { MessageCircle, Clock, CheckCircle, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { mockCustomerInquiries } from "@/lib/seller"
import type { CustomerInquiry } from "@/types/seller"
import { cn } from "@/lib/utils"

export function CustomerInquiries() {
  const [inquiries, setInquiries] = useState<CustomerInquiry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setInquiries(mockCustomerInquiries)
      setLoading(false)
    }, 500)
  }, [])

  const getStatusIcon = (status: CustomerInquiry["status"]) => {
    switch (status) {
      case "new":
        return <Clock className="h-4 w-4" />
      case "responded":
        return <CheckCircle className="h-4 w-4" />
      case "closed":
        return <X className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: CustomerInquiry["status"]) => {
    switch (status) {
      case "new":
        return "bg-yellow-100 text-yellow-800"
      case "responded":
        return "bg-green-100 text-green-800"
      case "closed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60)
      return `${diffInMinutes}m ago`
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays}d ago`
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Customer Inquiries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Inquiries</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {inquiries.map((inquiry) => (
            <div key={inquiry.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-start space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={inquiry.customerAvatar || "/placeholder.svg"} />
                  <AvatarFallback>{inquiry.customerName[0]}</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">{inquiry.customerName}</h4>
                      <p className="text-sm text-gray-600">{inquiry.productName}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={cn(getStatusColor(inquiry.status))}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(inquiry.status)}
                          <span className="capitalize">{inquiry.status}</span>
                        </div>
                      </Badge>
                      <span className="text-xs text-gray-500">{formatTime(inquiry.createdAt)}</span>
                    </div>
                  </div>

                  <div className="mt-2">
                    <p className="text-sm text-gray-700">{inquiry.message}</p>
                  </div>

                  <div className="flex items-center space-x-2 mt-3">
                    <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Reply
                    </Button>
                    {inquiry.status === "new" && (
                      <Button variant="outline" size="sm">
                        Mark as Read
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
