/**
 * Manager Dashboard - Real-time Active Deliveries View
 * Shows all active deliveries with live position updates via WebSocket
 */

'use client'

import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { createQueryFn } from '@/utils/createQueryFn'
import { useManagerDeliveryTracking } from '@/hooks/delivery/useDeliveryTracking'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Package, User, Clock, Navigation } from 'lucide-react'
import LoadingPageSpinner from '@/components/custom/LoadingPageSpinner'
import { useUserRole } from '@/context/UserRoleContext'

type ActiveDelivery = {
  deliveryId: string
  orderId: string
  deliveryManId: number
  deliveryManName: string
  status: string
  hasTakenOrderFromStore: boolean
}

export default function ManagerDashboardPage() {
  const { organizationId } = useUserRole() // Assuming this hook provides org ID
  
  // Fetch active deliveries from API
  const { data: activeDeliveries, isLoading, refetch } = useQuery({
    queryKey: ['active-deliveries', { organizationId }],
    queryFn: createQueryFn<ActiveDelivery[]>(
      `/deliveries/active?organizationId=${organizationId || 'default'}`
    ),
    enabled: !!organizationId,
    refetchInterval: 15000, // Refresh every 15 seconds as fallback
  })

  // Subscribe to real-time WebSocket updates
  const { 
    deliveries: liveDeliveries, 
    getAllDeliveries,
    lastUpdate,
    isSubscribed 
  } = useManagerDeliveryTracking(organizationId)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ASSIGNED':
        return 'bg-blue-100 text-blue-800'
      case 'ON_THE_WAY':
        return 'bg-amethyst-100 text-amethyst-800'
      case 'DELIVERED':
        return 'bg-success-100 text-success-800'
      default:
        return 'bg-lynch-100 text-lynch-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ASSIGNED':
        return <Package className='h-4 w-4' />
      case 'ON_THE_WAY':
        return <Navigation className='h-4 w-4' />
      case 'DELIVERED':
        return <MapPin className='h-4 w-4' />
      default:
        return <Clock className='h-4 w-4' />
    }
  }

  if (isLoading) {
    return <LoadingPageSpinner />
  }

  const displayDeliveries = activeDeliveries || []

  return (
    <div className='container mx-auto space-y-6 p-4'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-lynch-900'>Active Deliveries</h1>
          <p className='mt-1 text-sm text-lynch-600'>
            Real-time tracking of all deliveries
            {isSubscribed && (
              <span className='ml-2 inline-flex items-center gap-1 text-success-600'>
                <span className='inline-block h-2 w-2 animate-pulse rounded-full bg-success-500' />
                Live
              </span>
            )}
          </p>
        </div>
        <Badge variant='outline' className='text-lg'>
          {displayDeliveries.length} Active
        </Badge>
      </div>

      {/* Deliveries Grid */}
      {displayDeliveries.length === 0 ? (
        <Card>
          <CardContent className='flex flex-col items-center justify-center py-12'>
            <Package className='h-16 w-16 text-lynch-300' />
            <h3 className='mt-4 text-lg font-semibold text-lynch-900'>
              No Active Deliveries
            </h3>
            <p className='mt-2 text-sm text-lynch-600'>
              All deliveries have been completed or none are assigned yet
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {displayDeliveries.map((delivery) => {
            // Check if we have real-time update for this delivery
            const liveUpdate = liveDeliveries.get(delivery.deliveryId)
            const currentStatus = liveUpdate?.status || delivery.status
            const hasPickedUp = liveUpdate?.hasTakenOrderFromStore ?? delivery.hasTakenOrderFromStore

            return (
              <Card key={delivery.deliveryId} className='hover:shadow-lg transition-shadow'>
                <CardHeader className='pb-3'>
                  <div className='flex items-start justify-between'>
                    <div>
                      <CardTitle className='text-lg'>
                        Order #{delivery.orderId.slice(0, 8)}
                      </CardTitle>
                      <p className='mt-1 text-sm text-lynch-600'>
                        ID: {delivery.deliveryId.slice(0, 8)}
                      </p>
                    </div>
                    <Badge className={getStatusColor(currentStatus)}>
                      {getStatusIcon(currentStatus)}
                      <span className='ml-1'>{currentStatus}</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className='space-y-3'>
                  {/* Delivery Man */}
                  <div className='flex items-center gap-2'>
                    <User className='h-4 w-4 text-lynch-400' />
                    <span className='text-sm font-medium'>{delivery.deliveryManName}</span>
                  </div>

                  {/* Pickup Status */}
                  <div className='flex items-center gap-2'>
                    <Package className='h-4 w-4 text-lynch-400' />
                    <span className='text-sm'>
                      {hasPickedUp ? (
                        <span className='text-success-600'>✓ Picked up from store</span>
                      ) : (
                        <span className='text-amber-600'>En route to store</span>
                      )}
                    </span>
                  </div>

                  {/* Live Position Indicator */}
                  {liveUpdate && (
                    <div className='flex items-center gap-2 rounded-md bg-amethyst-50 px-2 py-1'>
                      <MapPin className='h-4 w-4 text-amethyst-600' />
                      <span className='text-xs text-amethyst-900'>
                        Live position: {liveUpdate.coordinates.latitude.toFixed(4)}, {liveUpdate.coordinates.longitude.toFixed(4)}
                      </span>
                    </div>
                  )}

                  {/* Last Update Time */}
                  {liveUpdate && (
                    <p className='text-xs text-lynch-500'>
                      Updated: {new Date(liveUpdate.timestamp || Date.now()).toLocaleTimeString()}
                    </p>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* WebSocket Status Footer */}
      <div className='rounded-lg border border-lynch-200 bg-lynch-50 p-4'>
        <div className='flex items-center justify-between'>
          <div className='text-sm text-lynch-600'>
            <p className='font-medium'>Real-time Updates</p>
            <p className='mt-1 text-xs'>
              {isSubscribed
                ? `Connected • Last update: ${lastUpdate ? lastUpdate.toLocaleTimeString() : 'Never'}`
                : 'Connecting to live feed...'}
            </p>
          </div>
          <div className='text-sm text-lynch-600'>
            {getAllDeliveries().length} live positions tracked
          </div>
        </div>
      </div>
    </div>
  )
}
