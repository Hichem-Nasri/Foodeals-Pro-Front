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
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'

export interface Activity {
  id: string
  type:
    | 'order'
    | 'store'
    | 'deal'
    | 'user'
  title: string
  description: string
  time: string
  user?: {
    name: string
    avatar: string
  }
  status?:
    | 'pending'
    | 'completed'
    | 'canceled'
}

interface RealTimeActivityProps {
  activities: Activity[]
}

const RealTimeActivity: React.FC<
  RealTimeActivityProps
> = ({ activities }) => {
  const getStatusColor = (
    status?: string
  ) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500'
      case 'completed':
        return 'bg-green-500'
      case 'canceled':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getActivityIcon = (
    type: string
  ) => {
    switch (type) {
      case 'order':
        return '🛒'
      case 'store':
        return '🏪'
      case 'deal':
        return '🏷️'
      case 'user':
        return '👤'
      default:
        return '📌'
    }
  }

  return (
    <Card className='h-full'>
      <CardHeader>
        <CardTitle>
          Real-Time Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className='h-[400px] pr-4'>
          <div className='space-y-4'>
            {activities.map(
              (activity) => (
                <div
                  key={activity.id}
                  className='flex items-start space-x-4'
                >
                  <div className='bg-muted flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full'>
                    {getActivityIcon(
                      activity.type
                    )}
                  </div>
                  <div className='flex-1 space-y-1'>
                    <div className='flex items-center justify-between'>
                      <p className='text-sm font-medium'>
                        {activity.title}
                      </p>
                      <span className='text-muted-foreground text-xs'>
                        {activity.time}
                      </span>
                    </div>
                    <p className='text-muted-foreground text-sm'>
                      {
                        activity.description
                      }
                    </p>
                    <div className='flex items-center justify-between'>
                      {activity.user && (
                        <div className='flex items-center space-x-2'>
                          <Avatar className='h-6 w-6'>
                            <AvatarImage
                              src={
                                activity
                                  .user
                                  .avatar
                              }
                              alt={
                                activity
                                  .user
                                  .name
                              }
                            />
                            <AvatarFallback>
                              {activity.user.name.charAt(
                                0
                              )}
                            </AvatarFallback>
                          </Avatar>
                          <span className='text-xs'>
                            {
                              activity
                                .user
                                .name
                            }
                          </span>
                        </div>
                      )}
                      {activity.status && (
                        <Badge
                          variant='outline'
                          className={`${getStatusColor(activity.status)} text-white`}
                        >
                          {
                            activity.status
                          }
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

export default RealTimeActivity
