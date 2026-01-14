'use client'
import { Layout } from '@/components/layout/Layout'
import React from 'react'
import OverviewCards, {
  StatCard,
} from '@/components/dashboard/OverviewCards'
import OrderStatistics from '@/components/dashboard/OrderStatistics'
import DealAnalytics from '@/components/dashboard/DealAnalytics'
import FinancialMetrics from '@/components/dashboard/FinancialMetrics'
import OperationalMetrics from '@/components/dashboard/OperationalMetrics'
import RealTimeActivity, {
  Activity,
} from '@/components/dashboard/RealTimeActivity'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  ShoppingBag,
  Package,
  Award,
  DollarSign,
} from 'lucide-react'

// Mock data for the market dashboard
const mockData = {
  // Overview cards data
  stats: {
    totalDeals: 152,
    totalOrders: 850,
    totalDealsPro: 35,
    revenueThisMonth: 28500,
  },

  // Order statistics data
  orderStatusData: [
    {
      name: 'In Progress',
      value: 25,
      color: '#FFBB28',
    },
    {
      name: 'Delivered',
      value: 65,
      color: '#00C49F',
    },
    {
      name: 'Canceled',
      value: 10,
      color: '#FF8042',
    },
  ],
  orderTrendData: [
    { name: 'Mon', orders: 15 },
    { name: 'Tue', orders: 22 },
    { name: 'Wed', orders: 18 },
    { name: 'Thu', orders: 30 },
    { name: 'Fri', orders: 28 },
    { name: 'Sat', orders: 40 },
    { name: 'Sun', orders: 32 },
  ],
  averageOrderValue: 33.5,
  completionRate: 88,

  // Deal analytics data
  popularDeals: [
    {
      id: '1',
      title: 'Fresh Produce Bundle',
      category: 'Fruits & Vegetables',
      orders: 38,
      views: 105,
    },
    {
      id: '2',
      title: 'Weekly Meat Special',
      category: 'Meat & Poultry',
      orders: 30,
      views: 85,
    },
    {
      id: '3',
      title: 'Artisan Bakery Box',
      category: 'Bakery',
      orders: 25,
      views: 70,
    },
  ],
  dealCategories: [
    {
      name: 'Fruits & Vegetables',
      value: 42,
    },
    {
      name: 'Meat & Poultry',
      value: 23,
    },
    { name: 'Dairy & Eggs', value: 18 },
    { name: 'Bakery', value: 12 },
    { name: 'Other', value: 5 },
  ],
  dealPerformance: [
    {
      name: 'Fruits & Vegetables',
      orders: 42,
      views: 110,
    },
    {
      name: 'Meat & Poultry',
      orders: 35,
      views: 90,
    },
    {
      name: 'Dairy & Eggs',
      orders: 25,
      views: 75,
    },
    {
      name: 'Bakery',
      orders: 20,
      views: 60,
    },
    {
      name: 'Other',
      orders: 15,
      views: 45,
    },
  ],

  // Financial metrics data
  revenueByPaymentMethod: [
    { name: 'Card', value: 22800 },
    { name: 'Cash', value: 5700 },
  ],
  commissionRevenue: 2850,
  revenueTrendData: [
    { name: 'Jan', revenue: 20000 },
    { name: 'Feb', revenue: 22500 },
    { name: 'Mar', revenue: 21000 },
    { name: 'Apr', revenue: 24000 },
    { name: 'May', revenue: 26000 },
    { name: 'Jun', revenue: 28500 },
  ],

  // Operational metrics data
  deliveryPerformanceData: [
    { name: 'Mon', time: 23 },
    { name: 'Tue', time: 25 },
    { name: 'Wed', time: 20 },
    { name: 'Thu', time: 27 },
    { name: 'Fri', time: 24 },
    { name: 'Sat', time: 30 },
    { name: 'Sun', time: 28 },
  ],
  cancellationRate: 7,
  averageDeliveryTime: 25,

  // Real-time activity data
  activities: [
    {
      id: '1',
      type: 'order',
      title: 'New Order',
      description:
        'Order #12345 has been placed for Fresh Produce Bundle',
      time: '5 min ago',
      user: {
        name: 'Jane Smith',
        avatar: '/images/user-1.png',
      },
      status: 'pending',
    },
    {
      id: '2',
      type: 'deal',
      title: 'New Deal',
      description:
        'New deal "Weekend Bakery Special" has been added',
      time: '20 min ago',
      user: {
        name: 'Market Manager',
        avatar: '/images/manager.png',
      },
    },
    {
      id: '3',
      type: 'deal',
      title: 'Deal Updated',
      description:
        'Deal "Organic Veggies" has been updated',
      time: '45 min ago',
      user: {
        name: 'Store Manager',
        avatar: '/images/manager.png',
      },
    },
    {
      id: '4',
      type: 'order',
      title: 'Order Completed',
      description:
        'Order #12340 has been delivered',
      time: '1 hour ago',
      user: {
        name: 'Delivery Staff',
        avatar: '/images/delivery.png',
      },
      status: 'completed',
    },
    {
      id: '5',
      type: 'deal',
      title: 'Deal Pro Added',
      description:
        'Deal "Premium Meat Box" has been added as Deal Pro',
      time: '3 hours ago',
      user: {
        name: 'Market Admin',
        avatar: '/images/admin.png',
      },
    },
  ] as Activity[],
}

const MarketDashboardPage = () => {
  return (
    <div className='container mx-auto py-6'>
      <h1 className='mb-6 text-3xl font-bold'>
        Market Dashboard
      </h1>

      <Tabs
        defaultValue='overview'
        className='w-full'
      >
        <TabsList className='mb-6 grid w-full grid-cols-3'>
          <TabsTrigger value='overview'>
            Overview
          </TabsTrigger>
          <TabsTrigger value='orders'>
            Orders
          </TabsTrigger>
          <TabsTrigger value='deals'>
            Deals
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value='overview'
          className='space-y-6'
        >
          {/* Overview Cards using StatCard */}
          <div className='grid gap-4 md:grid-cols-4'>
            <StatCard
              title='Total Deals'
              value={
                mockData.stats
                  .totalDeals
              }
              icon={
                <Package className='h-5 w-5' />
              }
              description='All deals in the market'
              colors='green'
              trend={{
                value: 8,
                isPositive: true,
              }}
            />
            <StatCard
              title='Total Orders'
              value={
                mockData.stats
                  .totalOrders
              }
              icon={
                <ShoppingBag className='h-5 w-5' />
              }
              description='All orders processed'
              colors='blue'
              trend={{
                value: 12,
                isPositive: true,
              }}
            />
            <StatCard
              title='Deals Pro'
              value={
                mockData.stats
                  .totalDealsPro
              }
              icon={
                <Award className='h-5 w-5' />
              }
              description='Premium deal offerings'
              colors='purple'
              trend={{
                value: 5,
                isPositive: true,
              }}
            />
            <StatCard
              title='Revenue This Month'
              value={`$${mockData.stats.revenueThisMonth.toLocaleString()}`}
              icon={
                <DollarSign className='h-5 w-5' />
              }
              description='Current month earnings'
              colors='yellow'
              trend={{
                value: 15,
                isPositive: true,
              }}
            />
          </div>

          <div className='grid gap-6 md:grid-cols-2'>
            <OrderStatistics
              orderStatusData={
                mockData.orderStatusData
              }
              orderTrendData={
                mockData.orderTrendData
              }
              averageOrderValue={
                mockData.averageOrderValue
              }
              completionRate={
                mockData.completionRate
              }
            />
            <DealAnalytics
              popularDeals={
                mockData.popularDeals
              }
              dealCategories={
                mockData.dealCategories
              }
              dealPerformance={
                mockData.dealPerformance
              }
            />
          </div>
        </TabsContent>

        <TabsContent
          value='orders'
          className='space-y-6'
        >
          <div className='grid gap-4 md:grid-cols-3'>
            <StatCard
              title='Total Orders'
              value={
                mockData.stats
                  .totalOrders
              }
              icon={
                <ShoppingBag className='h-5 w-5' />
              }
              description='All orders processed'
              colors='blue'
            />
            <StatCard
              title='Average Order Value'
              value={`$${mockData.averageOrderValue.toFixed(2)}`}
              icon={
                <DollarSign className='h-5 w-5' />
              }
              description='Average order amount'
              colors='yellow'
            />
            <StatCard
              title='Completion Rate'
              value={`${mockData.completionRate}%`}
              icon={
                <Award className='h-5 w-5' />
              }
              description='Orders successfully delivered'
              colors='green'
            />
          </div>
          <OrderStatistics
            orderStatusData={
              mockData.orderStatusData
            }
            orderTrendData={
              mockData.orderTrendData
            }
            averageOrderValue={
              mockData.averageOrderValue
            }
            completionRate={
              mockData.completionRate
            }
          />
          <OperationalMetrics
            deliveryPerformanceData={
              mockData.deliveryPerformanceData
            }
            cancellationRate={
              mockData.cancellationRate
            }
            averageDeliveryTime={
              mockData.averageDeliveryTime
            }
          />
        </TabsContent>

        <TabsContent
          value='deals'
          className='space-y-6'
        >
          <div className='grid gap-4 md:grid-cols-3'>
            <StatCard
              title='Total Deals'
              value={
                mockData.stats
                  .totalDeals
              }
              icon={
                <Package className='h-5 w-5' />
              }
              description='All deals in the market'
              colors='green'
            />
            <StatCard
              title='Deals Pro'
              value={
                mockData.stats
                  .totalDealsPro
              }
              icon={
                <Award className='h-5 w-5' />
              }
              description='Premium deal offerings'
              colors='purple'
            />
            <StatCard
              title='Revenue from Deals'
              value={`$${mockData.stats.revenueThisMonth.toLocaleString()}`}
              icon={
                <DollarSign className='h-5 w-5' />
              }
              description='Earnings from all deals'
              colors='yellow'
            />
          </div>
          <DealAnalytics
            popularDeals={
              mockData.popularDeals
            }
            dealCategories={
              mockData.dealCategories
            }
            dealPerformance={
              mockData.dealPerformance
            }
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default MarketDashboardPage
