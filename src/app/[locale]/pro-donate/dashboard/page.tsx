'use client'
import { Layout } from '@/components/layout/Layout'
import React from 'react'
import { StatCard } from '@/components/dashboard/OverviewCards'
import FinancialMetrics from '@/components/dashboard/FinancialMetrics'
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
} from 'recharts'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Gift,
  Users,
  ShoppingBag,
  HeartHandshake,
} from 'lucide-react'

// Mock data for the donation dashboard
const mockData = {
  // Overview metrics
  stats: {
    totalDonations: 1458,
    associationsCount: 47,
    foodSavedKg: 2850,
    peopleHelped: 3500,
  },

  // Donation trends
  donationTrendData: [
    { name: 'Jan', donations: 180 },
    { name: 'Feb', donations: 210 },
    { name: 'Mar', donations: 195 },
    { name: 'Apr', donations: 240 },
    { name: 'May', donations: 280 },
    { name: 'Jun', donations: 353 },
  ],

  // Food category data
  foodCategoryData: [
    { name: 'Produce', value: 35 },
    { name: 'Bakery', value: 25 },
    { name: 'Dairy', value: 15 },
    { name: 'Meat', value: 10 },
    {
      name: 'Prepared Foods',
      value: 15,
    },
  ],

  // Association distribution
  associationTypeData: [
    { name: 'Food Banks', value: 18 },
    {
      name: 'Homeless Shelters',
      value: 12,
    },
    {
      name: 'Community Centers',
      value: 9,
    },
    { name: 'Schools', value: 8 },
  ],

  // Top associations
  topAssociations: [
    {
      name: 'City Food Bank',
      donationsReceived: 215,
      peopleHelped: 450,
    },
    {
      name: 'Hope Shelter',
      donationsReceived: 180,
      peopleHelped: 375,
    },
    {
      name: 'Community Outreach',
      donationsReceived: 165,
      peopleHelped: 310,
    },
    {
      name: 'School Lunch Program',
      donationsReceived: 140,
      peopleHelped: 280,
    },
  ],

  // Environmental impact
  environmentalImpact: {
    co2Saved: 4250, // kg of CO2 equivalent
    waterSaved: 1250000, // liters of water
    landSaved: 1800, // square meters
  },

  // Monthly food saved data
  foodSavedData: [
    { name: 'Jan', amount: 350 },
    { name: 'Feb', amount: 420 },
    { name: 'Mar', amount: 380 },
    { name: 'Apr', amount: 480 },
    { name: 'May', amount: 520 },
    { name: 'Jun', amount: 700 },
  ],

  // Real-time activity
  activities: [
    {
      id: '1',
      type: 'order',
      title: 'New Donation',
      description:
        'Donation #12345 has been made by Market Fresh',
      time: '5 min ago',
      user: {
        name: 'Market Manager',
        avatar: '/images/manager.png',
      },
    },
    {
      id: '2',
      type: 'store',
      title: 'New Association',
      description:
        'Community Pantry has joined the platform',
      time: '1 hour ago',
      user: {
        name: 'Admin',
        avatar: '/images/admin.png',
      },
    },
    {
      id: '3',
      type: 'order',
      title: 'Donation Received',
      description:
        'City Food Bank received donation #12340',
      time: '3 hours ago',
      user: {
        name: 'Association Manager',
        avatar: '/images/manager.png',
      },
    },
    {
      id: '4',
      type: 'deal',
      title: 'Milestone Achieved',
      description:
        '1 ton of food waste saved this month!',
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

const DonateDashboardPage = () => {
  return (
    <div className='container mx-auto py-6'>
      <h1 className='mb-6 text-3xl font-bold'>
        Donation Dashboard
      </h1>

      {/* Overview Cards using StatCard */}
      <div className='mb-6 grid gap-4 md:grid-cols-4'>
        <StatCard
          title='Total Donations'
          value={
            mockData.stats
              .totalDonations
          }
          icon={
            <Gift className='h-5 w-5' />
          }
          description='All time donations'
          colors='green'
          trend={{
            value: 10,
            isPositive: true,
          }}
        />
        <StatCard
          title='Associations'
          value={
            mockData.stats
              .associationsCount
          }
          icon={
            <HeartHandshake className='h-5 w-5' />
          }
          description='Partner organizations'
          colors='blue'
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
            <ShoppingBag className='h-5 w-5' />
          }
          description='Total food rescued'
          colors='yellow'
          trend={{
            value: 12,
            isPositive: true,
          }}
        />
        <StatCard
          title='People Helped'
          value={
            mockData.stats.peopleHelped
          }
          icon={
            <Users className='h-5 w-5' />
          }
          description='Individuals supported'
          colors='purple'
          trend={{
            value: 8,
            isPositive: true,
          }}
        />
      </div>

      {/* Main content */}
      <div className='grid gap-6 md:grid-cols-2'>
        {/* Donation Trends Chart */}
        <Card>
          <CardHeader>
            <CardTitle>
              Donation Trends
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
                    mockData.donationTrendData
                  }
                >
                  <XAxis dataKey='name' />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey='donations'
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

        {/* Food Categories */}
        <Card>
          <CardHeader>
            <CardTitle>
              Food Categories
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
                      mockData.foodCategoryData
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
                    {mockData.foodCategoryData.map(
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

        {/* Association Types */}
        <Card>
          <CardHeader>
            <CardTitle>
              Association Types
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
                      mockData.associationTypeData
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
                    {mockData.associationTypeData.map(
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

        {/* Top Associations */}
        <Card>
          <CardHeader>
            <CardTitle>
              Top Associations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {mockData.topAssociations.map(
                (
                  association,
                  index
                ) => (
                  <div
                    key={index}
                    className='flex items-center justify-between border-b pb-2'
                  >
                    <div>
                      <p className='font-medium'>
                        {
                          association.name
                        }
                      </p>
                      <p className='text-muted-foreground text-sm'>
                        {
                          association.peopleHelped
                        }{' '}
                        people helped
                      </p>
                    </div>
                    <div className='text-right'>
                      <p className='font-medium'>
                        {
                          association.donationsReceived
                        }
                      </p>
                      <p className='text-muted-foreground text-sm'>
                        donations
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

export default DonateDashboardPage
