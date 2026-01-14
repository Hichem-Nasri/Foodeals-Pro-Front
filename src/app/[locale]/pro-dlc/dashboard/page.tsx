'use client'
import { Layout } from '@/components/layout/Layout'
import React from 'react'
import { StatCard } from '@/components/dashboard/OverviewCards'
import RealTimeActivity, {
  Activity,
} from '@/components/dashboard/RealTimeActivity'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from 'recharts'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Package,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Leaf,
} from 'lucide-react'

// Mock data for the DLC dashboard
const mockData = {
  // Overview metrics
  stats: {
    totalProducts: 1280,
    productsPriority: {
      urgent: 350,
      desirable: 580,
      regular: 350,
    },
    foodSavedKg: 3450,
  },

  // Product trends
  productTrendData: [
    { name: 'Jan', products: 210 },
    { name: 'Feb', products: 230 },
    { name: 'Mar', products: 205 },
    { name: 'Apr', products: 280 },
    { name: 'May', products: 290 },
    { name: 'Jun', products: 320 },
  ],

  // Product category data
  productCategoryData: [
    { name: 'Produce', value: 40 },
    { name: 'Bakery', value: 25 },
    { name: 'Dairy', value: 15 },
    { name: 'Meat', value: 12 },
    {
      name: 'Prepared Foods',
      value: 8,
    },
  ],

  // Collection point types
  collectionTypeData: [
    { name: 'Drive-thru', value: 65 },
    { name: 'Store Pickup', value: 25 },
    { name: 'Local Hub', value: 10 },
  ],

  // Top collection locations
  topLocations: [
    {
      name: 'Central Market Hub',
      productCount: 245,
      pickupRate: 92,
    },
    {
      name: 'Eastside Drive-thru',
      productCount: 185,
      pickupRate: 88,
    },
    {
      name: 'West Mall Location',
      productCount: 165,
      pickupRate: 95,
    },
    {
      name: 'Downtown Pickup Point',
      productCount: 140,
      pickupRate: 86,
    },
  ],

  // Environmental impact
  environmentalImpact: {
    co2Saved: 5250, // kg of CO2 equivalent
    waterSaved: 1450000, // liters of water
    landSaved: 2200, // square meters
  },

  // Monthly food saved data
  foodSavedData: [
    { name: 'Jan', amount: 450 },
    { name: 'Feb', amount: 520 },
    { name: 'Mar', amount: 490 },
    { name: 'Apr', amount: 580 },
    { name: 'May', amount: 620 },
    { name: 'Jun', amount: 790 },
  ],

  // Product priority over time
  priorityTrendData: [
    {
      name: 'Jan',
      urgent: 80,
      desirable: 110,
      regular: 100,
    },
    {
      name: 'Feb',
      urgent: 95,
      desirable: 120,
      regular: 105,
    },
    {
      name: 'Mar',
      urgent: 85,
      desirable: 105,
      regular: 95,
    },
    {
      name: 'Apr',
      urgent: 110,
      desirable: 150,
      regular: 120,
    },
    {
      name: 'May',
      urgent: 105,
      desirable: 155,
      regular: 130,
    },
    {
      name: 'Jun',
      urgent: 120,
      desirable: 170,
      regular: 140,
    },
  ],

  // Real-time activity
  activities: [
    {
      id: '1',
      type: 'order',
      title: 'New Product Added',
      description:
        'Fresh bread products added to urgent collection',
      time: '5 min ago',
      user: {
        name: 'Store Manager',
        avatar: '/images/manager.png',
      },
    },
    {
      id: '2',
      type: 'store',
      title: 'New Collection Point',
      description:
        'Southside Drive-thru point has been added',
      time: '1 hour ago',
      user: {
        name: 'Admin',
        avatar: '/images/admin.png',
      },
    },
    {
      id: '3',
      type: 'order',
      title: 'Products Collected',
      description:
        'Batch #12375 has been picked up',
      time: '3 hours ago',
      user: {
        name: 'Collection Driver',
        avatar: '/images/delivery.png',
      },
    },
    {
      id: '4',
      type: 'deal',
      title: 'Milestone Achieved',
      description:
        '1000 urgent products saved this month!',
      time: '1 day ago',
      user: {
        name: 'System',
        avatar: '/images/system.png',
      },
    },
  ],
}

// Custom colors for charts
const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#A569BD',
]

const DlcDashboardPage = () => {
  return (
    <div className='container mx-auto py-6'>
      <h1 className='mb-6 text-3xl font-bold'>
        DLC Dashboard
      </h1>

      {/* Overview Cards using StatCard */}
      <div className='mb-6 grid gap-4 md:grid-cols-4'>
        <StatCard
          title='Total Products'
          value={
            mockData.stats.totalProducts
          }
          icon={
            <Package className='h-5 w-5' />
          }
          description='All time products'
          colors='blue'
          trend={{
            value: 8,
            isPositive: true,
          }}
        />
        <StatCard
          title='Urgent Products'
          value={
            mockData.stats
              .productsPriority.urgent
          }
          icon={
            <AlertTriangle className='h-5 w-5' />
          }
          description='High priority items'
          colors='red'
          trend={{
            value: 12,
            isPositive: true,
          }}
        />
        <StatCard
          title='Desirable Products'
          value={
            mockData.stats
              .productsPriority
              .desirable
          }
          icon={
            <CheckCircle2 className='h-5 w-5' />
          }
          description='Medium priority items'
          colors='yellow'
          trend={{
            value: 5,
            isPositive: true,
          }}
        />
        <StatCard
          title='Food Saved (kg)'
          value={
            mockData.stats.foodSavedKg
          }
          icon={
            <Leaf className='h-5 w-5' />
          }
          description='Total food rescued'
          colors='green'
          trend={{
            value: 10,
            isPositive: true,
          }}
        />
      </div>

      {/* Main content */}
      <div className='grid gap-6 md:grid-cols-2'>
        {/* Product Trends Chart */}
        <Card>
          <CardHeader>
            <CardTitle>
              Product Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='h-80'>
              <ResponsiveContainer
                width='100%'
                height='100%'
              >
                <BarChart
                  data={
                    mockData.productTrendData
                  }
                >
                  <XAxis dataKey='name' />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey='products'
                    fill='#8884d8'
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Food Saved Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>
              Food Saved (kg)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='h-80'>
              <ResponsiveContainer
                width='100%'
                height='100%'
              >
                <BarChart
                  data={
                    mockData.foodSavedData
                  }
                >
                  <XAxis dataKey='name' />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey='amount'
                    fill='#82ca9d'
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Priority Trends */}
        <Card>
          <CardHeader>
            <CardTitle>
              Product Priority Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='h-80'>
              <ResponsiveContainer
                width='100%'
                height='100%'
              >
                <LineChart
                  data={
                    mockData.priorityTrendData
                  }
                >
                  <XAxis dataKey='name' />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type='monotone'
                    dataKey='urgent'
                    stroke='#FF8042'
                    activeDot={{
                      r: 8,
                    }}
                  />
                  <Line
                    type='monotone'
                    dataKey='desirable'
                    stroke='#FFBB28'
                  />
                  <Line
                    type='monotone'
                    dataKey='regular'
                    stroke='#00C49F'
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Product Categories */}
        {/* <Card>
          <CardHeader>
            <CardTitle>
              Product Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='h-80'>
              <ResponsiveContainer
                width='100%'
                height='100%'
              >
                <PieChart>
                  <Pie
                    data={
                      mockData.productCategoryData
                    }
                    cx='50%'
                    cy='50%'
                    labelLine={true}
                    outerRadius={80}
                    fill='#8884d8'
                    dataKey='value'
                    label={({
                      name,
                      percent,
                    }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {mockData.productCategoryData.map(
                      (
                        entry,
                        index
                      ) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            COLORS[
                              index %
                                COLORS.length
                            ]
                          }
                        />
                      )
                    )}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card> */}

        {/* Collection Types */}
        <Card>
          <CardHeader>
            <CardTitle>
              Collection Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='h-80'>
              <ResponsiveContainer
                width='100%'
                height='100%'
              >
                <PieChart>
                  <Pie
                    data={
                      mockData.collectionTypeData
                    }
                    cx='50%'
                    cy='50%'
                    labelLine={true}
                    outerRadius={80}
                    fill='#8884d8'
                    dataKey='value'
                    label={({
                      name,
                      percent,
                    }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {mockData.collectionTypeData.map(
                      (
                        entry,
                        index
                      ) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            COLORS[
                              index %
                                COLORS.length
                            ]
                          }
                        />
                      )
                    )}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Collection Locations */}
        <Card>
          <CardHeader>
            <CardTitle>
              Top Collection Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {mockData.topLocations.map(
                (location, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between border-b pb-2'
                  >
                    <div>
                      <p className='font-medium'>
                        {location.name}
                      </p>
                      <p className='text-muted-foreground text-sm'>
                        {
                          location.pickupRate
                        }
                        % pickup rate
                      </p>
                    </div>
                    <div className='text-right'>
                      <p className='font-medium'>
                        {
                          location.productCount
                        }
                      </p>
                      <p className='text-muted-foreground text-sm'>
                        products
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>

        {/* Environmental Impact */}
        <Card>
          <CardHeader>
            <CardTitle>
              Environmental Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-3 gap-4'>
              <div className='rounded-lg bg-green-50 p-4 text-center'>
                <p className='text-2xl font-bold text-green-600'>
                  {
                    mockData
                      .environmentalImpact
                      .co2Saved
                  }
                </p>
                <p className='text-sm text-green-800'>
                  kg CO2 saved
                </p>
              </div>
              <div className='rounded-lg bg-blue-50 p-4 text-center'>
                <p className='text-2xl font-bold text-blue-600'>
                  {(
                    mockData
                      .environmentalImpact
                      .waterSaved / 1000
                  ).toFixed(0)}
                </p>
                <p className='text-sm text-blue-800'>
                  kL water saved
                </p>
              </div>
              <div className='rounded-lg bg-amber-50 p-4 text-center'>
                <p className='text-2xl font-bold text-amber-600'>
                  {
                    mockData
                      .environmentalImpact
                      .landSaved
                  }
                </p>
                <p className='text-sm text-amber-800'>
                  m² land saved
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DlcDashboardPage
