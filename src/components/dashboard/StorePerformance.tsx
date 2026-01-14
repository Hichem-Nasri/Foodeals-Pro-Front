import React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
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

interface Store {
  id: string
  name: string
  avatarPath: string
  orders: number
  revenue: number
}

interface StorePerformanceProps {
  topStores: Store[]
  storeGrowth: number
  storeStatusData: {
    name: string
    value: number
  }[]
}

const StorePerformance: React.FC<
  StorePerformanceProps
> = ({
  topStores,
  storeGrowth,
  storeStatusData,
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
            Top Performing Stores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {topStores.map((store) => (
              <div
                key={store.id}
                className='flex items-center justify-between'
              >
                <div className='flex items-center space-x-4'>
                  <Avatar>
                    <AvatarImage
                      src={
                        store.avatarPath
                      }
                      alt={store.name}
                    />
                    <AvatarFallback>
                      {store.name
                        .substring(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className='text-sm font-medium'>
                      {store.name}
                    </p>
                    <p className='text-muted-foreground text-xs'>
                      {store.orders}{' '}
                      orders
                    </p>
                  </div>
                </div>
                <div className='text-sm font-medium text-primary'>
                  $
                  {store.revenue.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Store Growth
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-3xl font-bold text-primary'>
            +{storeGrowth}
          </div>
          <p className='text-muted-foreground mt-2 text-xs'>
            New stores added this month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Store Status Distribution
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
                  data={storeStatusData}
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
                  {storeStatusData.map(
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
                    `${value} stores`,
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

export default StorePerformance
