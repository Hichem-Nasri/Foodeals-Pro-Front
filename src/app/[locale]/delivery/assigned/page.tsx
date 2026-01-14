/**
 * Assigned Orders View for Delivery Man
 * Shows current assigned delivery and allows starting the delivery
 */

'use client'

import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { createQueryFn, createMutationFn } from '@/utils/createQueryFn'
import { useMutation } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, Package, User, Clock, Navigation, AlertCircle, CheckCircle2 } from 'lucide-react'
import LoadingPageSpinner from '@/components/custom/LoadingPageSpinner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

type AssignedDeliveryResponse = {
  hasActiveDelivery: boolean
  deliveryId?: string
  orderId?: string
  status?: string
  hasTakenOrderFromStore?: boolean
  orderDetails?: {
    clientName: string
    clientAddress: string
  }
}

export default function AssignedOrdersPage() {
  const router = useRouter()
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt' | null>(null)

  // Fetch assigned delivery
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['my-current-delivery'],
    queryFn: createQueryFn<AssignedDeliveryResponse>('/deliveries/myCurrentDelivery'),
    refetchInterval: 10000, // Refresh every 10 seconds
  })

  // Start delivery mutation
  const startDeliveryMutation = useMutation({
    mutationFn: createMutationFn<{ success: boolean; status: string }>(
      data?.deliveryId ? `/deliveries/${data.deliveryId}/start` : '',
      'PUT'
    ),
    onSuccess: () => {
      // Navigate to map view
      if (data?.deliveryId && data?.orderId) {
        router.push(`/delivery/map/delivery-men?orderId=${data.orderId}&deliveryManId=${data.deliveryId}`)
      }
    },
  })

  // Check location permission on mount
  useEffect(() => {
    if ('permissions' in navigator) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setLocationPermission(result.state as 'granted' | 'denied' | 'prompt')
        
        result.addEventListener('change', () => {
          setLocationPermission(result.state as 'granted' | 'denied' | 'prompt')
        })
      })
    }
  }, [])

  const handleStartDelivery = async () => {
    // Request location permission first
    if (locationPermission !== 'granted') {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject)
        })
        setLocationPermission('granted')
      } catch (error) {
        setLocationPermission('denied')
        alert('Location access is required to start delivery. Please enable location in your browser settings.')
        return
      }
    }

    // Start the delivery
    startDeliveryMutation.mutate()
  }

  if (isLoading) {
    return <LoadingPageSpinner />
  }

  if (error) {
    return (
      <div className='flex h-screen items-center justify-center p-4'>
        <Alert variant='destructive' className='max-w-md'>
          <AlertCircle className='h-4 w-4' />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load assigned deliveries. Please try again.
          </AlertDescription>
          <Button onClick={() => refetch()} variant='outline' className='mt-4'>
            Retry
          </Button>
        </Alert>
      </div>
    )
  }

  // No active delivery
  if (!data?.hasActiveDelivery) {
    return (
      <div className='flex h-screen items-center justify-center p-4'>
        <Card className='max-w-md'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Package className='h-5 w-5' />
              No Active Delivery
            </CardTitle>
            <CardDescription>
              You don't have any assigned deliveries at the moment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className='text-sm text-lynch-600'>
              Check back later or contact your manager for new assignments.
            </p>
            <Button onClick={() => refetch()} variant='outline' className='mt-4 w-full'>
              Refresh
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Has active delivery
  return (
    <div className='container mx-auto max-w-2xl space-y-6 p-4'>
      {/* Status Banner */}
      <Alert className='bg-amethyst-50 border-amethyst-200'>
        <CheckCircle2 className='h-4 w-4 text-amethyst-600' />
        <AlertTitle className='text-amethyst-900'>Delivery Assigned</AlertTitle>
        <AlertDescription className='text-amethyst-700'>
          Status: <span className='font-semibold'>{data.status}</span>
          {data.hasTakenOrderFromStore && ' • Order picked up from store'}
        </AlertDescription>
      </Alert>

      {/* Order Details Card */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Package className='h-5 w-5 text-amethyst-500' />
            Order Details
          </CardTitle>
          <CardDescription>Delivery ID: {data.deliveryId}</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          {/* Client Info */}
          <div className='flex items-start gap-3'>
            <User className='mt-1 h-5 w-5 text-lynch-400' />
            <div>
              <p className='font-medium text-lynch-900'>Client</p>
              <p className='text-sm text-lynch-600'>{data.orderDetails?.clientName}</p>
            </div>
          </div>

          {/* Delivery Address */}
          <div className='flex items-start gap-3'>
            <MapPin className='mt-1 h-5 w-5 text-lynch-400' />
            <div>
              <p className='font-medium text-lynch-900'>Delivery Address</p>
              <p className='text-sm text-lynch-600'>{data.orderDetails?.clientAddress}</p>
            </div>
          </div>

          {/* Status */}
          <div className='flex items-start gap-3'>
            <Clock className='mt-1 h-5 w-5 text-lynch-400' />
            <div>
              <p className='font-medium text-lynch-900'>Current Status</p>
              <p className='text-sm text-lynch-600'>
                {data.status === 'ASSIGNED' ? 'Ready to start' : 'In progress'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location Permission Warning */}
      {locationPermission === 'denied' && (
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertTitle>Location Access Required</AlertTitle>
          <AlertDescription>
            Please enable location access in your browser settings to start delivery tracking.
          </AlertDescription>
        </Alert>
      )}

      {locationPermission === 'prompt' && (
        <Alert className='bg-amber-50 border-amber-200'>
          <AlertCircle className='h-4 w-4 text-amber-600' />
          <AlertTitle className='text-amber-900'>Location Permission Needed</AlertTitle>
          <AlertDescription className='text-amber-700'>
            You'll be asked to allow location access when you start the delivery.
          </AlertDescription>
        </Alert>
      )}

      {/* Action Buttons */}
      <div className='space-y-3'>
        {data.status === 'ASSIGNED' && (
          <Button
            onClick={handleStartDelivery}
            disabled={startDeliveryMutation.isPending }
            className='w-full bg-scooter-500 hover:bg-scooter-600'
            size='lg'
          >
            <Navigation className='mr-2 h-5 w-5' />
            {startDeliveryMutation.isPending ? 'Starting...' : 'Start Delivery'}
          </Button>
        )}

        {data.status === 'ON_THE_WAY' && (
          <Button
            onClick={() => router.push(`/delivery/map/delivery-men?orderId=${data.orderId}&deliveryManId=${data.deliveryId}`)}
            className='w-full bg-amethyst-500 hover:bg-amethyst-600'
            size='lg'
          >
            <MapPin className='mr-2 h-5 w-5' />
            Continue to Map
          </Button>
        )}

        <Button
          onClick={() => refetch()}
          variant='outline'
          className='w-full'
          disabled={isLoading}
        >
          Refresh Status
        </Button>
      </div>
    </div>
  )
}
