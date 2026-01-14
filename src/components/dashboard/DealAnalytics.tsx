import React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts'

interface Deal {
  id: string
  title: string
  category: string
  orders: number
  views: number
}

interface DealAnalyticsProps {
  popularDeals: Deal[]
  dealCategories: {
    name: string
    value: number
  }[]
  dealPerformance: {
    name: string
    orders: number
    views: number
  }[]
}

const DealAnalytics: React.FC<
  DealAnalyticsProps
> = ({
  popularDeals,
  dealCategories,
  dealPerformance,
}) => {
  // Colors from tailwind config
  const colors = {
    primary: '#34D39E',
    tulip: {
      400: '#FAC215',
      500: '#EAB308',
      600: '#CA9A04',
    },
    coral: {
      300: '#FCA5A5',
      500: '#EF4444',
    },
    scooter: {
      500: '#06B6D4',
      700: '#0E7D90',
    },
    amethyst: {
      500: '#A855F7',
    },
    mountain: {
      400: '#34D39E',
      500: '#10B981',
    },
    lynch: {
      300: '#B1BBC8',
      400: '#8695AA',
      500: '#64748B',
      700: '#434E61',
    },
  }

  // Color palette for charts
  const colorPalette = [
    colors.primary,
    colors.tulip[400],
    colors.coral[300],
    colors.scooter[500],
    colors.amethyst[500],
    colors.mountain[400],
    colors.lynch[300],
  ]

  return (
    <div className='grid gap-4 md:grid-cols-2'>
      <Card className='col-span-2'>
        <CardHeader>
          <CardTitle>
            Popular Deals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {popularDeals.map(
              (deal) => (
                <div
                  key={deal.id}
                  className='flex items-center justify-between'
                >
                  <div>
                    <p className='text-sm font-medium'>
                      {deal.title}
                    </p>
                    <p className='text-muted-foreground text-xs'>
                      {deal.category}
                    </p>
                  </div>
                  <div className='flex items-center space-x-4'>
                    <div className='text-sm'>
                      <span className='font-medium text-primary'>
                        {deal.orders}
                      </span>{' '}
                      orders
                    </div>
                    <div className='text-sm'>
                      <span className='font-medium text-scooter-500'>
                        {deal.views}
                      </span>{' '}
                      views
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Deal Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='h-[200px]'>
            <ResponsiveContainer
              width='100%'
              height='100%'
            >
              <PieChart>
                <Pie
                  data={dealCategories}
                  cx='50%'
                  cy='50%'
                  labelLine={false}
                  label={({
                    name,
                    percent,
                  }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={70}
                  fill={colors.primary}
                  dataKey='value'
                >
                  {dealCategories.map(
                    (entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          colorPalette[
                            index %
                              colorPalette.length
                          ]
                        }
                      />
                    )
                  )}
                </Pie>
                <Tooltip
                  formatter={(
                    value
                  ) => [
                    `${value} deals`,
                    'Count',
                  ]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Deal Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='h-[200px]'>
            <ResponsiveContainer
              width='100%'
              height='100%'
            >
              <LineChart
                data={dealPerformance}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid
                  strokeDasharray='3 3'
                  stroke={
                    colors.lynch[300]
                  }
                />
                <XAxis
                  dataKey='name'
                  stroke={
                    colors.lynch[500]
                  }
                />
                <YAxis
                  stroke={
                    colors.lynch[500]
                  }
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor:
                      colors.lynch[700],
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                  }}
                />
                <Legend />
                <Line
                  type='monotone'
                  dataKey='orders'
                  stroke={
                    colors.primary
                  }
                  name='Orders'
                  strokeWidth={2}
                  dot={{
                    fill: colors.primary,
                    strokeWidth: 2,
                  }}
                  activeDot={{
                    r: 6,
                    fill: colors.primary,
                  }}
                />
                <Line
                  type='monotone'
                  dataKey='views'
                  stroke={
                    colors.scooter[500]
                  }
                  name='Views'
                  strokeWidth={2}
                  dot={{
                    fill: colors
                      .scooter[500],
                    strokeWidth: 2,
                  }}
                  activeDot={{
                    r: 6,
                    fill: colors
                      .scooter[500],
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DealAnalytics
