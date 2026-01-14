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
} from 'recharts'

interface GeographicInsightsProps {
  ordersByRegionData: {
    name: string
    value: number
  }[]
  storeDistributionData: {
    name: string
    value: number
  }[]
}

const GeographicInsights: React.FC<
  GeographicInsightsProps
> = ({
  ordersByRegionData,
  storeDistributionData,
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
      <Card>
        <CardHeader>
          <CardTitle>
            Orders by Region
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
                  ordersByRegionData
                }
                margin={{
                  top: 20,
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
                <Bar
                  dataKey='value'
                  name='Orders'
                  fill={colors.primary}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Store Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='h-[300px]'>
            <ResponsiveContainer
              width='100%'
              height='100%'
            >
              <PieChart>
                <Pie
                  data={
                    storeDistributionData
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
                  fill={colors.primary}
                  dataKey='value'
                >
                  {storeDistributionData.map(
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
                    `${value}`,
                    'Stores',
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

export default GeographicInsights
