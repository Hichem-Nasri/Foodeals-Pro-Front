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
  AreaChart,
  Area,
} from 'recharts'

interface UserInsightsProps {
  userGrowthData: {
    name: string
    users: number
  }[]
  userActivityData: {
    name: string
    active: number
  }[]
  userTypesData: {
    name: string
    value: number
  }[]
}

const UserInsights: React.FC<
  UserInsightsProps
> = ({
  userGrowthData,
  userActivityData,
  userTypesData,
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
            User Growth
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='h-[300px]'>
            <ResponsiveContainer
              width='100%'
              height='100%'
            >
              <AreaChart
                data={userGrowthData}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient
                    id='colorUsers'
                    x1='0'
                    y1='0'
                    x2='0'
                    y2='1'
                  >
                    <stop
                      offset='5%'
                      stopColor={
                        colors.primary
                      }
                      stopOpacity={0.8}
                    />
                    <stop
                      offset='95%'
                      stopColor={
                        colors.primary
                      }
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
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
                <Area
                  type='monotone'
                  dataKey='users'
                  stroke={
                    colors.primary
                  }
                  fillOpacity={1}
                  fill='url(#colorUsers)'
                  name='Users'
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            User Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='h-[200px]'>
            <ResponsiveContainer
              width='100%'
              height='100%'
            >
              <LineChart
                data={userActivityData}
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
                  dataKey='active'
                  stroke={
                    colors.scooter[500]
                  }
                  name='Active Users'
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

      <Card>
        <CardHeader>
          <CardTitle>
            User Types
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
                  data={userTypesData}
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
                  {userTypesData.map(
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
                    `${value} users`,
                    'Count',
                  ]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default UserInsights
