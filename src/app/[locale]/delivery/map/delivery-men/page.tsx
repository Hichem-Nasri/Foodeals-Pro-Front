'use client'
import { DeliveryRoutes } from '@/lib/routes'
import {
  useEffect,
  useState,
} from 'react'
import { useWebSocket } from '@/context/UseSocket'
import { useUserRole } from '@/context/UserRoleContext'
import {
  DeliveryManT,
  usePositionAll,
} from '@/hooks/delivery/queries/delivery-men-queries'
import { MapPos } from '@/lib/delivery-classes'
import { useDeliveryStore } from '@/context/StoreDelivery'
import LoadingPageSpinner from '@/components/custom/LoadingPageSpinner'
import { TopTabsLinks } from '@/components/custom/TopTabs'
import { Roles } from '@/types/GlobalType'
import {
  DeliveryManDetailsDrawer,
  PartnerDetailsDrawer,
} from '../../components/Drawers'
import MapComp from '../../components/MapComp'
import MapCompManager from '../../components/MapCompManager'
import SubPageHeader from '../../components/SubPageHeader'
import { useDeliveryTranslations } from '@/hooks/useTranslations'
import React from 'react'
import { usePermissions } from '@/context/PermissionContext'

type RouteStep = {
  distance: number // in meters
  duration: number // in seconds
  instruction: string // e.g., "Turn left onto Main St"
  geometry: {
    coordinates: [number, number][] // Array of [longitude, latitude] points
  }
}

type RouteResponse = {
  steps: RouteStep[] // Array of steps
  totalDistance: number // Total distance in meters
  totalDuration: number // Total duration in seconds
}

/**
 * Get the route steps between two positions using OSRM API.
 * @param start - Starting position (MapPos)
 * @param end - Destination position (MapPos)
 * @returns Promise<RouteResponse> - Route steps, total distance, and duration
 */
async function getRouteSteps(
  start: MapPos,
  end: MapPos
): Promise<RouteResponse> {
  // Construct OSRM API URL
  const coordsString = `${start.longitude},${start.latitude};${end.longitude},${end.latitude}`
  const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${coordsString}?overview=full&steps=true&geometries=geojson`

  try {
    const response =
      await fetch(osrmUrl)
    const data = await response.json()

    // Validate response
    if (
      !data.routes?.[0]?.legs?.[0]
        ?.steps
    ) {
      throw new Error(
        'Invalid route response from OSRM'
      )
    }

    const steps =
      data.routes[0].legs[0].steps.map(
        (step: any) => ({
          distance: step.distance,
          duration: step.duration,
          instruction:
            step.maneuver.instruction,
          geometry: {
            coordinates:
              step.geometry.coordinates, // Array of [longitude, latitude]
          },
        })
      )

    return {
      steps,
      totalDistance:
        data.routes[0].distance,
      totalDuration:
        data.routes[0].duration,
    }
  } catch (error) {
    console.error(
      'Failed to fetch route steps:',
      error
    )
    throw error // Re-throw for caller to handle
  }
}

export default function MapDeliveryMen({
  searchParams,
}: {
  searchParams: Promise<{
    orderId: string
    deliveryManId: string
  }>
}) {
  const { orderId, deliveryManId } =
    React.use(searchParams)
  const [openPickup, setOpenPickup] =
    useState(false)
  const [typeOpen, setTypeOpen] =
    useState('')

  const {
    stompClient,
    isConnected,
    subscribe,
    sendMessage,
  } = useWebSocket()
  useEffect(() => {
    if (!isConnected) return
    if (!navigator.geolocation) {
      console.log(
        'Geolocation is not supported by this browser'
      )
      return
    }
    // Set up interval to send position every 5 seconds
    const intervalId = setInterval(
      () => {
        console.log(
          'Sending position...'
        )
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const payload = {
              deliveryId: deliveryManId,
              orderId: orderId,
              deliveryManId: parseInt(deliveryManId),
              partnerId: null,
              coordinates: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              },
              status: null,
            }

            sendMessage(
              '/app/updatePosition',
              JSON.stringify(payload)
            )
            console.log(
              'Position sent:',
              payload
            )
          },
          (error) => {
            console.error(
              'Error getting location:',
              error
            )
            switch (error.code) {
              case error.PERMISSION_DENIED:
                console.error(
                  'User denied geolocation permission'
                )
                break
              case error.POSITION_UNAVAILABLE:
                console.error(
                  'Location information unavailable'
                )
                break
              case error.TIMEOUT:
                console.error(
                  'Location request timed out'
                )
                break
              default:
                console.error(
                  'Unknown error occurred'
                )
                break
            }
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          }
        )
      },
      5000
    )

    // Clean up interval on component unmount
    return () =>
      clearInterval(intervalId)
  }, [isConnected])

  useEffect(() => {
    if (!isConnected) return
    const dest = ` /topic/position/${orderId}/${deliveryManId}`
    console.log('Subscribing to', dest)
    stompClient?.subscribe(
      dest,
      (message) => {
        console.log(
          'Received position update:',
          message
        )
      }
    )
  }, [isConnected, orderId])
  
  // Get user role from PermissionContext
  const { user } = usePermissions()
  const role = user?.role || null
  
  const {
    deliveries,
    getDelivery,
    updateDeliveryPosition,
    addDlivery,
    getDeliveryTracking,
    addOrder,
  } = useDeliveryStore()

  const { isLoading, error, data } =
    usePositionAll({ orderId })
  if (deliveries.size === 0) {
    if (isLoading)
      return <LoadingPageSpinner />
    if (error)
      return (
        <div>
          Error: {error.message}
        </div>
      )
    if (!data) return <div>No data</div>
    addOrder(data)
  }
  return (
    <>
      <div className='flex h-full flex-col'>
        <SubPageHeader
          title='Géolocalisation'
          href={
            orderId
              ? `${DeliveryRoutes.livreurs}?${new URLSearchParams({ orderId }).toString()}`
              : DeliveryRoutes.livreurs
          }
        />
        <div className='flex-1'>
          {role ===
          Roles.DELIVERY_MAN ? (
            <MapComp
              affectation={true}
              delivery={
                !deliveryManId
                  ? getDelivery(
                      orderId
                    )!
                  : getDeliveryTracking(
                      orderId,
                      deliveryManId
                    )!
              }
              orderId={orderId}
              deliveryId={deliveryManId}
              handleOpenPickup={(
                value
              ) => {
                setOpenPickup(
                  value !== ''
                )
                setTypeOpen(value)
              }}
              role={role as Roles}
            >
              
            </MapComp>
          ) : (
            <MapCompManager
              delivery={
                !deliveryManId
                  ? getDelivery(
                      orderId
                    )!
                  : getDeliveryTracking(
                      orderId,
                      deliveryManId
                    )!
              }
              affectation={
                !deliveryManId
              }
              handleOpenPickup={
                setOpenPickup
              }
              role={role as Roles}
              orderId={orderId}
              deliveryId={deliveryManId}
            >
              <TopTabsLinks
                tabs={[
                  {
                    label: 'Livreurs',
                    href: orderId
                      ? `${DeliveryRoutes.livreurs}?${new URLSearchParams({ orderId }).toString()}`
                      : DeliveryRoutes.livreurs,
                    isActive: false,
                  },
                  {
                    label:
                      'Localisations',
                    href: orderId
                      ? `/delivery/map/delivery-men?${new URLSearchParams({ orderId }).toString()}`
                      : '/delivery/map/delivery-men',
                    isActive: true,
                  },
                ]}
                activeColor='purple'
              />
            </MapCompManager>
          )}
          {role !==
            Roles.DELIVERY_MAN &&
            deliveryManId ? (
            <DeliveryManDetailsDrawer
              deliveryMan={(() => {
                const delivery =
                  getDeliveryTracking(
                    orderId,
                    deliveryManId
                  )?.toJSON()
                
                if (!delivery?.deliverys) {
                  return null
                }
                
                const deliveryBoy =
                  delivery.deliverys.find(
                    (d) =>
                      d?.id ==
                      deliveryManId
                  )
                
                if (!deliveryBoy) {
                  return null
                }
                
                return {
                  id: deliveryManId,
                  position:
                    deliveryBoy.position,
                  deliveryBoyAvailable:
                    deliveryBoy.active,
                  hasTakenOrderFromStore:
                    deliveryBoy.hasTakenOrderFromStore,
                  hasDeliveredOrderToClient:
                    deliveryBoy.hasDeliveredOrderToClient,
                  delivery: delivery,
                  phone:
                    deliveryBoy.delivery
                      .phone,
                  email:
                    deliveryBoy.delivery
                      .email,
                  name: deliveryBoy
                    .delivery.name,
                  distanceOfDeliveryBoy: 0,
                } as DeliveryManT
              })()}
              orderId={orderId}
              selected={
                deliveryManId === ''
              }
              open={openPickup}
              setOpen={setOpenPickup}
            />
          ) : role === Roles.DELIVERY_MAN ? (
            <PartnerDetailsDrawer
              selected={
                deliveryManId !== ''
              }
              description={''}
              orderId={orderId}
              title={
                'Confirmation de la récupération'
              }
              type={typeOpen as any}
              open={openPickup}
              setOpen={setOpenPickup}
            />
          ) : null}
        </div>
      </div>
    </>
  )
}
