import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { HealthStatus } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateHealthStatus(
  lastUpdateDate: Date | null,
  updateText?: string
): HealthStatus {
  if (!lastUpdateDate) return 'RED'

  const now = new Date()
  const daysSinceUpdate = Math.floor(
    (now.getTime() - lastUpdateDate.getTime()) / (1000 * 60 * 60 * 24)
  )

  // Check for negative keywords first
  const negativeKeywords = ['blocker', 'delay', 'issue', 'problem', 'stuck', 'blocked']
  if (updateText && negativeKeywords.some(keyword => 
    updateText.toLowerCase().includes(keyword)
  )) {
    return 'RED'
  }

  // Time-based health status
  if (daysSinceUpdate <= 2) return 'GREEN'
  if (daysSinceUpdate <= 5) return 'YELLOW'
  return 'RED'
}

export function getDaysSinceUpdate(date: Date | null): number {
  if (!date) return Infinity

  const now = new Date()
  return Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
}

export function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  
  const days = Math.floor(diffInSeconds / 86400)
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  
  return date.toLocaleDateString()
}

