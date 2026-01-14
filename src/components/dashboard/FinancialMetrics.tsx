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

interface FinancialMetricsProps {
  revenueByPaymentMethod: {
    name: string
    value: number
  }[]
  commissionRevenue: number
  revenueTrendData: {
    name: string
    revenue: number
  }[]
}

const FinancialMetrics: React.FC<
  FinancialMetricsProps
> = ({
  revenueByPaymentMethod,
  commissionRevenue,
  revenueTrendData,
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
            Revenue by Payment Method
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='h-[300px]'>
            <ResponsiveContainer
              width='100%'
              height='100%'
            >
              <BarChart
                data={
                  revenueByPaymentMethod
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
                  formatter={(
                    value
                  ) => [
                    `$${value.toLocaleString()}`,
                    'Revenue',
                  ]}
                  contentStyle={{
                    backgroundColor:
                      colors.lynch[700],
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                  }}
                />
                <Legend />
                <Bar
                  dataKey='value'
                  fill={colors.primary}
                  name='Revenue'
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      <Card className='col-span-2'>
        <CardHeader>
          <CardTitle>
            Revenue Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='h-[200px]'>
            <ResponsiveContainer
              width='100%'
              height='100%'
            >
              <LineChart
                data={revenueTrendData}
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
                  formatter={(
                    value
                  ) => [
                    `$${value.toLocaleString()}`,
                    'Revenue',
                  ]}
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
                  dataKey='revenue'
                  stroke={
                    colors.amethyst[500]
                  }
                  name='Revenue'
                  strokeWidth={2}
                  dot={{
                    fill: colors
                      .amethyst[500],
                    strokeWidth: 2,
                  }}
                  activeDot={{
                    r: 6,
                    fill: colors
                      .amethyst[500],
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

export default FinancialMetrics
