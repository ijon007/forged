"use server"

import { getSession } from "./auth-actions"
import { refreshPolarToken } from "./polar-actions"
import { db } from "@/db/drizzle"
import { user } from "@/db/schemas/auth-schema"
import { course } from "@/db/schemas/course-schema"
import { eq } from "drizzle-orm"

interface AnalyticsStats {
  totalRevenue: number
  monthlyRevenue: number
  revenueGrowth: number
  totalSales: number
  salesGrowth: number
}

interface MonthlyData {
  month: string
  revenue: number
  orders: number
}

interface RecentCustomer {
  id: string
  name: string
  email: string
  purchaseDate: string
  amount: string
  course: string
}

async function getUserPolarData() {
  const session = await getSession()
  if (!session) {
    throw new Error('Not authenticated')
  }

  const userData = await db.select({
    polarAccessToken: user.polarAccessToken,
    polarTokenExpiresAt: user.polarTokenExpiresAt,
    polarOrganizationId: user.polarOrganizationId,
    userId: user.id
  })
  .from(user)
  .where(eq(user.id, session.user.id))
  .limit(1)

  if (!userData.length || !userData[0].polarAccessToken) {
    throw new Error('Polar account not connected')
  }

  if (!userData[0].polarOrganizationId) {
    throw new Error('Polar organization not found')
  }

  // Check if token is expired and refresh if needed
  if (userData[0].polarTokenExpiresAt && new Date() > userData[0].polarTokenExpiresAt) {
    try {
      await refreshPolarToken()
      // Refetch the updated token
      const updatedUserData = await db.select({
        polarAccessToken: user.polarAccessToken,
        polarOrganizationId: user.polarOrganizationId,
        userId: user.id
      })
      .from(user)
      .where(eq(user.id, session.user.id))
      .limit(1)
      
      if (!updatedUserData.length || !updatedUserData[0].polarAccessToken || !updatedUserData[0].polarOrganizationId) {
        throw new Error('Failed to refresh token')
      }
      
      return {
        polarAccessToken: updatedUserData[0].polarAccessToken,
        polarOrganizationId: updatedUserData[0].polarOrganizationId,
        userId: updatedUserData[0].userId
      }
    } catch (error) {
      throw new Error('Polar token expired and refresh failed. Please reconnect your account.')
    }
  }

  return {
    polarAccessToken: userData[0].polarAccessToken,
    polarOrganizationId: userData[0].polarOrganizationId,
    userId: userData[0].userId
  }
}

async function fetchPolarOrders(accessToken: string, organizationId: string, limit?: number) {
  const baseUrl = 'https://sandbox-api.polar.sh/v1/orders'
  const params = new URLSearchParams({
    organization_id: organizationId,
    ...(limit && { limit: limit.toString() })
  })
  
  const response = await fetch(`${baseUrl}?${params}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Polar API error:', response.status, errorText)
    
    if (response.status === 403) {
      const errorData = JSON.parse(errorText)
      if (errorData.error === 'insufficient_scope') {
        throw new Error('Insufficient permissions. Please disconnect and reconnect your Polar account to grant the orders:read permission.')
      }
    }
    
    throw new Error(`Failed to fetch orders from Polar: ${response.status}`)
  }

  const data = await response.json()
  return data.items || []
}

export async function getAnalyticsStats(): Promise<AnalyticsStats> {
  try {
    const userData = await getUserPolarData()

    console.log('Fetching analytics stats for organization:', userData.polarOrganizationId)

    const orders = await fetchPolarOrders(userData.polarAccessToken, userData.polarOrganizationId)

    // Calculate current month start and last month start
    const now = new Date()
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)

    // Filter completed orders only
    const completedOrders = orders.filter((order: any) => order.status === 'paid')
  

    // Calculate total revenue (convert from cents to dollars)
    const totalRevenue = completedOrders.reduce((sum: number, order: any) => {
      return sum + (order.amount / 100)
    }, 0)

    // Calculate current month revenue
    const currentMonthOrders = completedOrders.filter((order: any) => {
      const orderDate = new Date(order.created_at)
      return orderDate >= currentMonthStart
    })
    const monthlyRevenue = currentMonthOrders.reduce((sum: number, order: any) => {
      return sum + (order.amount / 100)
    }, 0)

    // Calculate last month revenue for growth calculation
    const lastMonthOrders = completedOrders.filter((order: any) => {
      const orderDate = new Date(order.created_at)
      return orderDate >= lastMonthStart && orderDate < currentMonthStart
    })
    const lastMonthRevenue = lastMonthOrders.reduce((sum: number, order: any) => {
      return sum + (order.amount / 100)
    }, 0)

    // Calculate revenue growth
    const revenueGrowth = lastMonthRevenue > 0 
      ? ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
      : monthlyRevenue > 0 ? 100 : 0

    // Calculate total sales
    const totalSales = completedOrders.length

    // Calculate sales growth
    const salesGrowth = lastMonthOrders.length > 0 
      ? ((currentMonthOrders.length - lastMonthOrders.length) / lastMonthOrders.length) * 100
      : currentMonthOrders.length > 0 ? 100 : 0

    return {
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      monthlyRevenue: Math.round(monthlyRevenue * 100) / 100,
      revenueGrowth: Math.round(revenueGrowth * 100) / 100,
      totalSales,
      salesGrowth: Math.round(salesGrowth * 100) / 100
    }
  } catch (error) {
    console.error('Error getting analytics stats:', error)
    // Return default values if there's an error
    return {
      totalRevenue: 0,
      monthlyRevenue: 0,
      revenueGrowth: 0,
      totalSales: 0,
      salesGrowth: 0
    }
  }
}

export async function getMonthlyChartData(): Promise<MonthlyData[]> {
  try {
    const userData = await getUserPolarData()

    const orders = await fetchPolarOrders(userData.polarAccessToken, userData.polarOrganizationId)

    // Filter completed orders only
    const completedOrders = orders.filter((order: any) => order.status === 'paid')

    // Get last 12 months
    const months = []
    const now = new Date()
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      months.push({
        date,
        month: date.toLocaleString('default', { month: 'long' }),
        start: new Date(date.getFullYear(), date.getMonth(), 1),
        end: new Date(date.getFullYear(), date.getMonth() + 1, 1)
      })
    }

    // Group orders by month
    const monthlyData = months.map(monthInfo => {
      const monthOrders = completedOrders.filter((order: any) => {
        const orderDate = new Date(order.created_at)
        return orderDate >= monthInfo.start && orderDate < monthInfo.end
      })

      const revenue = monthOrders.reduce((sum: number, order: any) => {
        return sum + (order.amount / 100)
      }, 0)

      return {
        month: monthInfo.month,
        revenue: Math.round(revenue * 100) / 100,
        orders: monthOrders.length
      }
    })

    return monthlyData
  } catch (error) {
    console.error('Error getting monthly chart data:', error)
    // Return default data for last 12 months
    const months = []
    const now = new Date()
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      months.push({
        month: date.toLocaleString('default', { month: 'long' }),
        revenue: 0,
        orders: 0
      })
    }
    
    return months
  }
}

export async function getRecentCustomers(): Promise<RecentCustomer[]> {
  try {
    const userData = await getUserPolarData()

    const orders = await fetchPolarOrders(userData.polarAccessToken, userData.polarOrganizationId, 20)

    // Filter completed orders
    const completedOrders = orders.filter((order: any) => order.status === 'paid')

    // Get user's courses for product mapping
    const userCourses = await db
      .select({ 
        id: course.id, 
        title: course.title, 
        polarProductId: course.polarProductId 
      })
      .from(course)
      .where(eq(course.userId, userData.userId))

    const productToCourseMap = new Map()
    userCourses.forEach(course => {
      if (course.polarProductId) {
        productToCourseMap.set(course.polarProductId, course.title)
      }
    })

    return completedOrders.slice(0, 10).map((order: any) => {
      // Get the course name from the product mapping or use the product name from order
      const courseName = order.product_id 
        ? productToCourseMap.get(order.product_id) || order.product?.name || 'Unknown Course'
        : 'Unknown Course'

      return {
        id: order.id,
        name: order.customer?.name || 'Anonymous Customer',
        email: order.customer?.email || 'anonymous@customer.com',
        purchaseDate: new Date(order.created_at).toLocaleDateString(),
        amount: `$${(order.amount / 100).toFixed(2)}`,
        course: courseName
      }
    })
  } catch (error) {
    console.error('Error getting recent customers:', error)
    return []
  }
} 