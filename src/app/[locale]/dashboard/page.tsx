'use client'
import { Layout } from '@/components/layout/Layout'
import React from 'react'
import OverviewCards from '@/components/dashboard/OverviewCards'
import OrderStatistics from '@/components/dashboard/OrderStatistics'
import StorePerformance from '@/components/dashboard/StorePerformance'
import DealAnalytics from '@/components/dashboard/DealAnalytics'
import UserInsights from '@/components/dashboard/UserInsights'
import FinancialMetrics from '@/components/dashboard/FinancialMetrics'
import OperationalMetrics from '@/components/dashboard/OperationalMetrics'
import SolutionMetrics from '@/components/dashboard/SolutionMetrics'
import RealTimeActivity, {
  Activity,
} from '@/components/dashboard/RealTimeActivity'
import GeographicInsights from '@/components/dashboard/GeographicInsights'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { useDashboardTranslations, useCommonTranslations } from '@/hooks/useTranslations'

// Mock data for the dashboard
const mockData = {
  // Overview cards data
  stats: {
    totalOrders: 1250,
    totalRevenue: 45678,
    activeStores: 45,
    activeDeals: 78,
  },

  // Order statistics data
  orderStatusData: [
    {
      name: 'In Progress',
      value: 30,
      color: '#FFBB28',
    },
    {
      name: 'Delivered',
      value: 60,
      color: '#00C49F',
    },
    {
      name: 'Canceled',
      value: 10,
      color: '#FF8042',
    },
  ],
  orderTrendData: [
    { name: 'Mon', orders: 20 },
    { name: 'Tue', orders: 30 },
    { name: 'Wed', orders: 25 },
    { name: 'Thu', orders: 40 },
    { name: 'Fri', orders: 35 },
    { name: 'Sat', orders: 50 },
    { name: 'Sun', orders: 45 },
  ],
  averageOrderValue: 36.54,
  completionRate: 85,

  // Store performance data
  topStores: [
    {
      id: '1',
      name: 'Store A',
      avatarPath: '/images/store-a.png',
      orders: 120,
      revenue: 4500,
    },
    {
      id: '2',
      name: 'Store B',
      avatarPath: '/images/store-b.png',
      orders: 95,
      revenue: 3800,
    },
    {
      id: '3',
      name: 'Store C',
      avatarPath: '/images/store-c.png',
      orders: 80,
      revenue: 3200,
    },
  ],
  storeGrowth: 5,
  storeStatusData: [
    { name: 'Active', value: 35 },
    { name: 'Inactive', value: 8 },
    { name: 'Archived', value: 2 },
  ],

  // Deal analytics data
  popularDeals: [
    {
      id: '1',
      title: 'Pizza Deal',
      category: 'Food',
      orders: 45,
      views: 120,
    },
    {
      id: '2',
      title: 'Burger Combo',
      category: 'Food',
      orders: 38,
      views: 95,
    },
    {
      id: '3',
      title: 'Dessert Special',
      category: 'Dessert',
      orders: 30,
      views: 80,
    },
  ],
  dealCategories: [
    {
      name: 'Fruis & Legumes',
      value: 45,
    },
    {
      name: 'Meat & Poultry',
      value: 20,
    },
    { name: 'Dairy & Eggs', value: 15 },
    { name: 'Bakery', value: 10 },
    { name: 'Other', value: 10 },
  ],
  dealPerformance: [
    {
      name: 'Fruis & Legumes',
      orders: 45,
      views: 120,
    },
    {
      name: 'Meat & Poultry',
      orders: 38,
      views: 95,
    },
    {
      name: 'Dairy & Eggs',
      orders: 30,
      views: 80,
    },
    {
      name: 'Bakery',
      orders: 25,
      views: 70,
    },
    {
      name: 'Other',
      orders: 20,
      views: 60,
    },
  ],

  // User insights data
  userGrowthData: [
    { name: 'Jan', users: 20 },
    { name: 'Feb', users: 30 },
    { name: 'Mar', users: 25 },
    { name: 'Apr', users: 40 },
    { name: 'May', users: 35 },
    { name: 'Jun', users: 50 },
  ],
  userActivityData: [
    { name: 'Mon', active: 120 },
    { name: 'Tue', active: 130 },
    { name: 'Wed', active: 125 },
    { name: 'Thu', active: 140 },
    { name: 'Fri', active: 135 },
    { name: 'Sat', active: 150 },
    { name: 'Sun', active: 145 },
  ],

  // Financial metrics data
  revenueByPaymentMethod: [
    { name: 'Card', value: 35000 },
    { name: 'Cash', value: 10678 },
  ],
  commissionRevenue: 4567,
  revenueTrendData: [
    { name: 'Jan', revenue: 3000 },
    { name: 'Feb', revenue: 3500 },
    { name: 'Mar', revenue: 3200 },
    { name: 'Apr', revenue: 4000 },
    { name: 'May', revenue: 3800 },
    { name: 'Jun', revenue: 4500 },
  ],

  // Operational metrics data
  deliveryPerformanceData: [
    { name: 'Mon', time: 25 },
    { name: 'Tue', time: 28 },
    { name: 'Wed', time: 22 },
    { name: 'Thu', time: 30 },
    { name: 'Fri', time: 27 },
    { name: 'Sat', time: 35 },
    { name: 'Sun', time: 32 },
  ],
  cancellationRate: 8,
  averageDeliveryTime: 28,

  // Solution metrics data
  solutionAdoptionData: [
    { name: 'Market Pro', value: 60 },
    { name: 'DLC Pro', value: 25 },
    { name: 'Donate Pro', value: 15 },
  ],
  solutionPerformanceData: [
    {
      name: 'Market Pro',
      orders: 800,
      revenue: 32000,
    },
    {
      name: 'DLC Pro',
      orders: 300,
      revenue: 12000,
    },
    {
      name: 'Donate Pro',
      orders: 150,
      revenue: 1678,
    },
  ],

  // Real-time activity data
  activities: [
    {
      id: '1',
      type: 'order',
      title: 'New Order',
      description:
        'Order #12345 has been placed',
      time: '2 min ago',
      user: {
        name: 'John Doe',
        avatar: '/images/user-1.png',
      },
      status: 'pending',
    },
    {
      id: '2',
      type: 'store',
      title: 'New Store',
      description:
        'Store "Fresh Foods" has been added',
      time: '15 min ago',
      user: {
        name: 'Admin',
        avatar: '/images/admin.png',
      },
    },
    {
      id: '3',
      type: 'deal',
      title: 'Deal Updated',
      description:
        'Deal "Pizza Special" has been updated',
      time: '30 min ago',
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
        name: 'Delivery Guy',
        avatar: '/images/delivery.png',
      },
      status: 'completed',
    },
    {
      id: '5',
      type: 'user',
      title: 'New User',
      description:
        'User "Jane Smith" has registered',
      time: '2 hours ago',
    },
  ] as Activity[],

  // Geographic insights data
}

const DashboardPage = () => {
  const t = useDashboardTranslations();
  const common = useCommonTranslations();
  const isSubentity = true
  return (
    <Layout>
      <div className='px-2 py-6'>
        <h1 className='mb-6 text-3xl font-bold'>
          {t('title')}
        </h1>

        <Tabs
          defaultValue='overview'
          className='w-full'
        >
          <TabsList
            className={cn(
              'mb-6 grid w-full grid-cols-4',
              {
                'grid-cols-3':
                  isSubentity,
              }
            )}
          >
            <TabsTrigger value='overview'>
              {t('overview')}
            </TabsTrigger>
            <TabsTrigger value='orders'>
              {common('orders')}
            </TabsTrigger>
            {!isSubentity && (
              <TabsTrigger value='stores'>
                {common('stores')}
              </TabsTrigger>
            )}
            <TabsTrigger value='deals'>
              {common('deals')}
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value='overview'
            className='space-y-6'
          >
            <OverviewCards
              stats={mockData.stats}
              isSubentity={isSubentity}
            />
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
              {!isSubentity && (
                <StorePerformance
                  topStores={
                    mockData.topStores
                  }
                  storeGrowth={
                    mockData.storeGrowth
                  }
                  storeStatusData={
                    mockData.storeStatusData
                  }
                />
              )}
              <FinancialMetrics
                revenueByPaymentMethod={
                  mockData.revenueByPaymentMethod
                }
                commissionRevenue={
                  mockData.commissionRevenue
                }
                revenueTrendData={
                  mockData.revenueTrendData
                }
              />
              <RealTimeActivity
                activities={
                  mockData.activities
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
              <SolutionMetrics
                solutionAdoptionData={
                  mockData.solutionAdoptionData
                }
                solutionPerformanceData={mockData.solutionPerformanceData.map(
                  (val) => ({
                    name: val.name,
                    value: val.revenue,
                  })
                )}
              />
            </div>
          </TabsContent>

          <TabsContent
            value='orders'
            className='space-y-6'
          >
            <OverviewCards
              stats={mockData.stats}
            />
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
            value='stores'
            className='space-y-6'
          >
            <OverviewCards
              stats={mockData.stats}
            />
            {!isSubentity && (
              <StorePerformance
                topStores={
                  mockData.topStores
                }
                storeGrowth={
                  mockData.storeGrowth
                }
                storeStatusData={
                  mockData.storeStatusData
                }
              />
            )}
            <SolutionMetrics
              solutionAdoptionData={
                mockData.solutionAdoptionData
              }
              solutionPerformanceData={mockData.solutionPerformanceData.map(
                (val) => ({
                  name: val.name,
                  value: val.revenue,
                })
              )}
            />
          </TabsContent>

          <TabsContent
            value='deals'
            className='space-y-6'
          >
            <OverviewCards
              stats={mockData.stats}
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
            <FinancialMetrics
              revenueByPaymentMethod={
                mockData.revenueByPaymentMethod
              }
              commissionRevenue={
                mockData.commissionRevenue
              }
              revenueTrendData={
                mockData.revenueTrendData
              }
            />
            <SolutionMetrics
              solutionAdoptionData={
                mockData.solutionAdoptionData
              }
              solutionPerformanceData={mockData.solutionPerformanceData.map(
                (val) => ({
                  name: val.name,
                  value: val.revenue,
                })
              )}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  )
}

export default DashboardPage
