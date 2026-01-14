import React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ShoppingBag,
  Store,
  TrendingUp,
  DollarSign,
  UserPlus2,
} from 'lucide-react'
import {
  ColorsT,
  getActiveColorClassName,
} from '@/utils/getActiveColorClassName'

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  description?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  colors?: ColorsT
}

export const StatCard: React.FC<
  StatCardProps
> = ({
  title,
  value,
  icon,
  description,
  trend,
  colors = 'green',
}) => {
  const color = getActiveColorClassName(
    colors,
    'text'
  )
  return (
    <Card className='overflow-hidden'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>
          {title}
        </CardTitle>
        <div
          className={`h-8 w-8 rounded-full bg-primary/10 p-1.5 ${color}`}
        >
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>
          {value}
        </div>
        {description && (
          <p className='text-muted-foreground text-xs'>
            {description}
          </p>
        )}
        {trend && (
          <div className='mt-2 flex items-center text-xs'>
            <span
              className={`mr-1 ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}
            >
              {trend.isPositive
                ? '↑'
                : '↓'}{' '}
              {Math.abs(trend.value)}%
            </span>
            <span className='text-muted-foreground'>
              vs last month
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface OverviewCardsProps {
  stats: {
    totalOrders: number
    totalRevenue: number
    activeStores: number
    activeDeals: number
    totalsCollaborators?: number
  }
  isSubentity?: boolean
}

const OverviewCards: React.FC<
  OverviewCardsProps
> = ({
  stats,
  isSubentity = false,
}) => {
  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
      <StatCard
        title='Total Orders'
        value={stats.totalOrders}
        icon={
          <ShoppingBag className='h-5 w-5' />
        }
        colors={'green'}
        description='All time orders'
        trend={{
          value: 12,
          isPositive: true,
        }}
      />
      <StatCard
        title='Total Revenue'
        value={`$${stats.totalRevenue.toLocaleString()}`}
        icon={
          <DollarSign className='h-5 w-5' />
        }
        colors='yellow'
        description='All time revenue'
        trend={{
          value: 8,
          isPositive: true,
        }}
      />
      {isSubentity ? (
        <StatCard
          title='Total Collaborators'
          value={
            stats.totalsCollaborators ||
            0
          }
          icon={
            <UserPlus2 className='h-5 w-5' />
          }
          colors='blue'
          description='Total collaborators'
          trend={{
            value: 2,
            isPositive: false,
          }}
        />
      ) : (
        <StatCard
          title='Active Stores'
          value={stats.activeStores}
          icon={
            <Store className='h-5 w-5' />
          }
          colors='blue'
          description='Currently active stores'
          trend={{
            value: 5,
            isPositive: true,
          }}
        />
      )}
      <StatCard
        title='Active Deals'
        value={stats.activeDeals}
        icon={
          <TrendingUp className='h-5 w-5' />
        }
        colors='purple'
        description='Currently active deals'
        trend={{
          value: 3,
          isPositive: false,
        }}
      />
    </div>
  )
}

export default OverviewCards
