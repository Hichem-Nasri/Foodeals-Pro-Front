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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts'

interface SolutionMetricsProps {
  solutionAdoptionData: {
    name: string
    value: number
  }[]
  solutionPerformanceData: {
    name: string
    value: number
  }[]
}

const SolutionMetrics: React.FC<
  SolutionMetricsProps
> = ({
  solutionAdoptionData,
  solutionPerformanceData,
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
    colors.scooter[500],
    colors.coral[300],
    colors.amethyst[500],
    colors.mountain[400],
    colors.lynch[300],
  ]

  return (
    <div className='grid gap-4 md:grid-cols-2'>
      <Card>
        <CardHeader>
          <CardTitle>
            Solution Adoption
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
                    solutionAdoptionData
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
                  {solutionAdoptionData.map(
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
                    `${value}%`,
                    'Adoption',
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
            Solution Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='h-[300px]'>
            <ResponsiveContainer
              width='100%'
              height='100%'
            >
              <RadarChart
                cx='50%'
                cy='50%'
                outerRadius='80%'
                data={
                  solutionPerformanceData
                }
              >
                <PolarGrid
                  stroke={
                    colors.lynch[300]
                  }
                />
                <PolarAngleAxis
                  dataKey='name'
                  stroke={
                    colors.lynch[500]
                  }
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  stroke={
                    colors.lynch[500]
                  }
                />
                <Radar
                  name='Performance'
                  dataKey='value'
                  stroke={
                    colors.primary
                  }
                  fill={colors.primary}
                  fillOpacity={0.6}
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
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SolutionMetrics
