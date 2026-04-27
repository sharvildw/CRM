import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    'New': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    'Contacted': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    'Qualified': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    'Proposal Sent': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
    'Negotiation': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    'Won': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    'Lost': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    'Active': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    'Inactive': 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
    'Churned': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    'Pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    'In Progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    'Completed': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    'Prospecting': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
    'Qualification': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    'Proposal': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
    'Closed Won': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    'Closed Lost': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  }
  return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
}

export function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    'Low': 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    'Medium': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'High': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    'Urgent': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  }
  return colors[priority] || colors['Medium']
}

export function timeAgo(date: string | Date): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return formatDate(date)
}
