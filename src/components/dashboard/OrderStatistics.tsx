import React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
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
} from 'recharts'

interface OrderStatisticsProps {
  orderStatusData: {
    name: string
    value: number
    color: string
  }[]
  orderTrendData: {
    name: string
    orders: number
  }[]
  averageOrderValue: number
  completionRate: number
}

const OrderStatistics: React.FC<
  OrderStatisticsProps
> = ({
  orderStatusData,
  orderTrendData,
  averageOrderValue,
  completionRate,
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
            Order Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue='status'
            className='w-full'
          >
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='status'>
                Order Status
              </TabsTrigger>
              <TabsTrigger value='trend'>
                Order Trend
              </TabsTrigger>
            </TabsList>
            <TabsContent
              value='status'
              className='mt-4'
            >
              <div className='h-[300px]'>
                <ResponsiveContainer
                  width='100%'
                  height='100%'
                >
                  <PieChart>
                    <Pie
                      data={
                        orderStatusData
                      }
                      cx='50%'
                      cy='50%'
                      labelLine={false}
                      label={({
                        name,
                        percent,
                      }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill={
                        colors.primary
                      }
                      dataKey='value'
                    >
                      {orderStatusData.map(
                        (
                          entry,
                          index
                        ) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              entry.color ||
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
                        `${value} orders`,
                        'Count',
                      ]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent
              value='trend'
              className='mt-4'
            >
              <div className='h-[300px]'>
                <ResponsiveContainer
                  width='100%'
                  height='100%'
                >
                  <BarChart
                    data={
                      orderTrendData
                    }
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
                        colors
                          .lynch[300]
                      }
                    />
                    <XAxis
                      dataKey='name'
                      stroke={
                        colors
                          .lynch[500]
                      }
                    />
                    <YAxis
                      stroke={
                        colors
                          .lynch[500]
                      }
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor:
                          colors
                            .lynch[700],
                        border: 'none',
                        borderRadius:
                          '8px',
                        color: 'white',
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey='orders'
                      fill={
                        colors.primary
                      }
                      name='Orders'
                      radius={[
                        4, 4, 0, 0,
                      ]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Average Order Value
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-3xl font-bold text-primary'>
            $
            {averageOrderValue.toFixed(
              2
            )}
          </div>
          <p className='text-muted-foreground mt-2 text-xs'>
            The average amount spent per
            order
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Order Completion Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-3xl font-bold text-primary'>
            {completionRate}%
          </div>
          <p className='text-muted-foreground mt-2 text-xs'>
            Percentage of orders
            successfully delivered
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default OrderStatistics
