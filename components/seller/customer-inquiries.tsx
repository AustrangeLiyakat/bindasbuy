"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle, AlertCircle, DollarSign } from "lucide-react"

interface CustomerInquiry {
  id: string
  productId: string
  productName: string
  customerId: string
  customerName: string
  customerAvatar?: string
  message: string
  type: "question" | "negotiation" | "complaint"
  status: "unread" | "read" | "responded"
  createdAt: string
}

export function CustomerInquiries() {
  // Mock data for demo
  const inquiries: CustomerInquiry[] = [
    {
      id: "1",
      productId: "prod1",
      productName: "Sample Product",
      customerId: "cust1",
      customerName: "John Doe",
      message: "Is this product still available?",
      type: "question",
      status: "unread",
      createdAt: new Date().toISOString()
    },
    {
      id: "2",
      productId: "prod2", 
      productName: "Another Product",
      customerId: "cust2",
      customerName: "Jane Smith",
      message: "Can you offer a discount for bulk order?",
      type: "negotiation",
      status: "read",
      createdAt: new Date().toISOString()
    }
  ]

  const getTypeIcon = (type: CustomerInquiry["type"]) => {
    switch (type) {
      case "question":
        return <MessageCircle className="h-4 w-4" />
      case "negotiation":
        return <DollarSign className="h-4 w-4" />
      case "complaint":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <MessageCircle className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: CustomerInquiry["status"]) => {
    switch (status) {
      case "unread":
        return "bg-red-100 text-red-800"
      case "read":
        return "bg-yellow-100 text-yellow-800"
      case "responded":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Inquiries</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {inquiries.map((inquiry) => (
            <div key={inquiry.id} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
              <Avatar className="h-10 w-10">
                <AvatarImage src={inquiry.customerAvatar || "/placeholder.svg"} />
                <AvatarFallback>{inquiry.customerName[0]}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-900">{inquiry.customerName}</span>
                    <Badge className={getStatusColor(inquiry.status)}>
                      {inquiry.status}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-500">
                    {getTypeIcon(inquiry.type)}
                    <span className="text-xs capitalize">{inquiry.type}</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">{inquiry.productName}</p>
                <p className="text-sm text-gray-800 mb-3">{inquiry.message}</p>
                
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    Reply
                  </Button>
                  <Button variant="ghost" size="sm">
                    Mark as Read
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
