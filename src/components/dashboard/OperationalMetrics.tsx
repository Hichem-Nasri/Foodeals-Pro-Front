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
  LineChart,
  Line,
} from 'recharts'

interface OperationalMetricsProps {
  deliveryPerformanceData: {
    name: string
    time: number
  }[]
  cancellationRate: number
  averageDeliveryTime: number
}

const OperationalMetrics: React.FC<
  OperationalMetricsProps
> = ({
  deliveryPerformanceData,
  cancellationRate,
  averageDeliveryTime,
}) => {
  return (
    <div className='grid gap-4 md:grid-cols-2'>
      <Card className='col-span-2'>
        <CardHeader>
          <CardTitle>
            Delivery Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='h-[300px]'>
            <ResponsiveContainer
              width='100%'
              height='100%'
            >
              <LineChart
                data={
                  deliveryPerformanceData
                }
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='name' />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type='monotone'
                  dataKey='time'
                  stroke='#8884d8'
                  name='Delivery Time (min)'
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Cancellation Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-3xl font-bold'>
            {cancellationRate}%
          </div>
          <p className='text-muted-foreground mt-2 text-xs'>
            Percentage of orders that
            are canceled
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Average Delivery Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-3xl font-bold'>
            {averageDeliveryTime} min
          </div>
          <p className='text-muted-foreground mt-2 text-xs'>
            Average time to deliver an
            order
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default OperationalMetrics
