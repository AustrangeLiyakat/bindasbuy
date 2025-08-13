"use client"

import type { LucideIcon } from "lucide-react"
import { TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  title: string
  value: string
  change?: string
  icon: LucideIcon
  trend?: "up" | "down"
}

export function MetricCard({ title, value, change, icon: Icon, trend }: MetricCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon className="h-5 w-5 text-gray-600" />
            <span className="text-sm text-gray-600">{title}</span>
          </div>
          {change && trend && (
            <div className={cn("flex items-center space-x-1", trend === "up" ? "text-green-600" : "text-red-600")}>
              {trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              <span className="text-xs font-medium">{change}</span>
            </div>
          )}
        </div>
        <div className="mt-2">
          <span className="text-2xl font-bold text-gray-900">{value}</span>
        </div>
      </CardContent>
    </Card>
  )
}
