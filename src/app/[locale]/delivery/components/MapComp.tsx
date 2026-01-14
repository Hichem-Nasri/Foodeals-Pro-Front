'use client'
import {
  Map,
  useMap,
  GeolocateControl,
  Layer,
  Marker,
} from '@vis.gl/react-maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import type { FillLayer } from '@vis.gl/react-maplibre'
import '@maplibre/maplibre-gl-inspect/dist/maplibre-gl-inspect.css'
import maplibregl, {
  LineLayerSpecification,
  Map as MapType,
} from 'maplibre-gl'
import {
  useEffect,
  useState,
  useRef,
} from 'react'
import {
  Building,
  ChartBar,
  MessageCircle,
  Phone,
  UserSearch,
} from 'lucide-react'
import { MdOutlineDeliveryDining } from 'react-icons/md'
import RemainingTimeBadge from './RemainingTimeBadge'
import { format } from 'date-fns'
import { CustomButton } from '@/components/custom/CustomButton'
import { Button } from '@/components/ui/button'
import { Roles } from '@/types/GlobalType'
import { distance } from 'framer-motion'
import {
  DeliveryC,
  DeliveryMapC,
} from '@/lib/delivery-classes'
import { useDeliveryStore } from '@/context/StoreDelivery'
import { get } from 'http'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useSendPositionUpdate } from '@/hooks/delivery/useDeliveryTracking'
import { useUserRole } from '@/context/UserRoleContext'
import { PickupConfirmationDialog } from '@/components/delivery/PickupConfirmationDialog'
import { DeliveryConfirmationDialog } from '@/components/delivery/DeliveryConfirmationDialog'

const parkLayer: FillLayer = {
  id: 'landuse_park',
  type: 'fill',
  source: 'vector',
  'source-layer': 'landuse',
  filter: ['==', 'class', 'park'],
  paint: {
    'fill-color': '#4E3FC8',
  },
}

export const colors = {
  snapline: '#34343f',
  altRouteline: '#9e91be',
  routelineFoot: '#3665ff',
  routelineBike: '#63c4ff',
  routeline: '#7b51f8',
  congestionLow: '#42c74c',
  congestionHigh: '#d72359',
  hoverpoint: '#30a856',
  snappoint: '#cb3373',
  snappointHighlight: '#e50d3f',
  waypointFoot: '#3665ff',
  waypointFootHighlight: '#0942ff',
  waypointBike: '#63c4ff',
  waypointBikeHighlight: '#0bb8ff',
  waypoint: '#7b51f8',
  waypointHighlight: '#6d26d7',
}

const routelineColor: NonNullable<
  LineLayerSpecification['paint']
>['line-color'] = [
  'case',
  [
    '==',
    [
      'get',
      'profile',
      [
        'get',
        'arriveSnappointProperties',
      ],
    ],
    'foot',
  ],
  colors.routelineFoot,
  [
    '==',
    [
      'get',
      'profile',
      [
        'get',
        'arriveSnappointProperties',
      ],
    ],
    'bike',
  ],
  colors.routelineBike,
  [
    'interpolate-hcl',
    ['linear'],
    ['get', 'congestion'],
    0,
    '#06b6d4',
    1,
    '#cff7fe',
    100,
    '#06b6d4',
  ],
]

function parseDuration(
  duration: number | string
) {
  if (typeof duration === 'number') {
    const hours = Math.floor(
      duration / 3600
    )
    const minutes = Math.floor(
      (duration % 3600) / 60
    )
    const seconds = Math.round(
      duration % 60
    )
    return `${hours}h ${minutes}m ${seconds}s`
  } else if (
    typeof duration === 'string'
  ) {
    return duration
  }
}

export default function MapComp({
  children,
  delivery,
  handleOpenPickup,
  role,
  affectation,
  orderId,
  deliveryId,
}: {
  affectation: boolean
  children?: React.ReactNode
  delivery: DeliveryC
  handleOpenPickup: (
    value: string
  ) => void
  role: Roles
  orderId: string
  deliveryId: string
}) {
  const [mapInstance, setMapInstance] =
    useState<MapType | null>(null)
  const [orderPicked, setOrderPicked] =
    useState(false)
  const [routeData, setRouteData] =
    useState<any>(null)
  const [
    remainingTime,
    setRemainingTime,
  ] = useState<string | null>('')
  const [showPickupDialog, setShowPickupDialog] = useState(false)
  const [showDeliveryDialog, setShowDeliveryDialog] = useState(false)
  
  // Safety check - if no delivery boys, show error or loading state
  if (!delivery?.deliverys || delivery.deliverys.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p>No delivery information available</p>
      </div>
    )
  }
  
  const [deliveryBoy] =
    useState<DeliveryMapC>(
      () => delivery.deliverys[0]
    )
  const { longitude, latitude } =
    (() => {
      const position = delivery.deliverys[0]?.position
      // Provide store location as default if position is undefined
      return position || delivery.storeLocation
    })()
  const geoControlRef =
    useRef<maplibregl.GeolocateControl | null>(
      null
    )
  const { getDelivery } =
    useDeliveryStore()
  const { userId } = useUserRole()
  
  // WebSocket position updates for delivery man
  const { sendPosition, isConnected: wsConnected } = useSendPositionUpdate(
    deliveryId,
    orderId,
    deliveryBoy?.id ? parseInt(deliveryBoy.id) : null,
    null // TODO: Get partnerId from user context
  )
  
  // Continuous location tracking for delivery man
  useEffect(() => {
    if (role !== Roles.DELIVERY_MAN || !deliveryId) return
    
    let watchId: number | null = null
    let intervalId: NodeJS.Timeout | null = null
    let lastPosition: { latitude: number; longitude: number } | null = null
    
    // Request location permission and start tracking
    if ('geolocation' in navigator) {
      console.log('[MapComp] Starting location tracking for delivery man')
      
      // Watch position continuously
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          lastPosition = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }
          console.log('[MapComp] Position updated:', lastPosition)
        },
        (error) => {
          console.error('[MapComp] Geolocation error:', error)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      )
      
      // Send position to server every 5 seconds
      intervalId = setInterval(() => {
        if (lastPosition && wsConnected) {
          const sent = sendPosition(lastPosition, undefined)
          if (sent) {
            console.log('[MapComp] Position sent to server:', lastPosition)
          }
        }
      }, 5000)
    } else {
      console.error('[MapComp] Geolocation not available')
    }
    
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId)
        console.log('[MapComp] Stopped location tracking')
      }
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [role, deliveryId, sendPosition, wsConnected])

  useEffect(() => {
    if (!mapInstance || !delivery)
      return

    let deliveryCoords =
      delivery.deliverys?.[0]?.position

    const end = orderPicked
      ? delivery?.clientLocation
      : delivery?.storeLocation

    // Validate coordinates before making API call
    if (!deliveryCoords || !end || 
        deliveryCoords.latitude === undefined || deliveryCoords.longitude === undefined ||
        end.latitude === undefined || end.longitude === undefined) {
      console.warn('Skipping route calculation - invalid coordinates', { deliveryCoords, end })
      return
    }

    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${deliveryCoords.longitude},${deliveryCoords.latitude};${end.longitude},${end.latitude}?overview=full&geometries=geojson`
    fetch(osrmUrl)
      .then((response) =>
        response.json()
      )
      .then((data) => {
        if (
          data.routes?.[0]?.geometry
        ) {
          setRouteData({
            type: 'Feature',
            properties: {
              duration:
                data.routes[0].duration,
              distance:
                data.routes[0].distance,
            },
            geometry:
              data.routes[0].geometry,
          })
        }
        if (
          data.routes?.[0]?.duration
        ) {
          const duration =
            parseDuration(
              data.routes[0].duration
            )
          setRemainingTime(
            duration || null
          )
        }
      })
      .catch(console.error)
  }, [
    orderPicked,
    delivery,
    mapInstance,
  ])

  useEffect(() => {
    if (!mapInstance || !routeData)
      return

    const source =
      mapInstance.getSource('route')
    if (source) {
      ;(
        source as maplibregl.GeoJSONSource
      ).setData(routeData)
    } else {
      mapInstance.addSource('route', {
        type: 'geojson',
        data: routeData,
      })
      mapInstance.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-width': 8,
          'line-opacity': 0.8,
          'line-color': orderPicked
            ? '#a855f7'
            : '#06b6d4', // Placeholder, will be overridden by the shader
        },
      })
    }
  }, [
    routeData,
    mapInstance,
    orderPicked,
  ])

  useEffect(() => {
    if (!mapInstance) return

    // Check if route layer exists before updating its style
    if (mapInstance.getLayer('route')) {
      // Update the route layer's line-color based on the orderPicked state
      mapInstance.setPaintProperty(
        'route',
        'line-color',
        orderPicked
          ? '#a855f7'
          : '#06b6d4'
      )
    }
  }, [orderPicked, mapInstance])

  return (
    <Map
      id='map'
      initialViewState={{
        longitude: longitude,
        latitude: latitude,
        zoom: 14,
      }}
      style={{
        width: '100%',
        height: '100%',
      }}
      mapStyle={
        '/map-styles/styles.json'
      }
      attributionControl={false}
      onLoad={({ target: map }) => {
        map.addControl(
          new maplibregl.NavigationControl(
            {}
          ),
          'bottom-right'
        )
        setMapInstance(map)
      }}
    >
      <div className='absolute left-4 right-4 top-4 flex w-[90%] items-center rounded-full bg-white p-1.5'>
        {routeData && (
          // <div className='ml-auto rounded bg-white p-2 shadow-lg'>
          //   Estimated time: {Math.round(routeData.properties.duration / 60)}{' '}
          //   minutes
          // </div>
          <RemainingTimeBadge
            color={
              orderPicked
                ? 'purple'
                : 'blue'
            }
            textNextToTime='estimation'
            timeRemaining={
              remainingTime
                ? remainingTime
                : '?? : ?? : ??'
            }
            timePassedPercentage={70}
          />
        )}
      </div>
      <div className='absolute bottom-4 right-11 flex flex-col gap-4'>
        <Link
          href={`tel:${deliveryBoy?.delivery?.phone}`}
        >
          <CustomButton
            label=''
            IconRight={Phone}
            className='h-14 w-14 rounded-full bg-primary text-white transition-all hover:bg-mountain-100 hover:text-primary [&>.icon]:m-0'
            onClick={() => {}}
          />
        </Link>
        <Link
          href={`mailto:${deliveryBoy?.delivery?.email}`}
        >
          <CustomButton
            label=''
            IconRight={MessageCircle}
            className='h-14 w-14 rounded-full bg-amethyst-500 text-white transition-all hover:bg-amethyst-100 hover:text-amethyst-500 [&>.icon]:m-0'
            onClick={() => {}}
          />
        </Link>
        {/* {children} */}
      </div>
      
      {/* Pickup/Delivery Action Buttons */}
      <div className='absolute bottom-20 left-4 z-10 flex flex-col gap-2'>
        {!orderPicked ? (
          /* Pickup Button - Opens QR Scanner */
          <Button
            onClick={() => setShowPickupDialog(true)}
            className='flex items-center gap-2 rounded-lg bg-scooter-500 px-4 py-3 font-semibold text-white shadow-lg transition-all hover:bg-scooter-600'
          >
            <Building />
            <span>Récupérer la commande</span>
          </Button>
        ) : (
          /* Delivery Button - Opens QR Scanner */
          <Button
            onClick={() => setShowDeliveryDialog(true)}
            className='flex items-center gap-2 rounded-lg bg-amethyst-500 px-4 py-3 font-semibold text-white shadow-lg transition-all hover:bg-amethyst-600'
          >
            <UserSearch />
            <span>Arrivé chez le client</span>
          </Button>
        )}
        <div className='rounded-lg bg-white px-3 py-2 text-xs font-medium text-lynch-600 shadow-sm'>
          {orderPicked
            ? '📍 En route vers le client'
            : '📍 En route vers le magasin'}
        </div>
      </div>

      {/* QR Code Dialogs */}
      <PickupConfirmationDialog
        open={showPickupDialog}
        onClose={() => setShowPickupDialog(false)}
        deliveryId={deliveryId}
        onSuccess={() => {
          setOrderPicked(true)
          handleOpenPickup('partner')
        }}
      />
      
      <DeliveryConfirmationDialog
        open={showDeliveryDialog}
        onClose={() => setShowDeliveryDialog(false)}
        deliveryId={deliveryId}
        onSuccess={() => {
          // Delivery completed
          handleOpenPickup('client')
        }}
      />

      <GeolocateControl
        ref={geoControlRef}
        position='bottom-right'
      />
      <Layer {...parkLayer} />
      <Button
        onClick={() => {
          if (
            delivery.deliverys[0]
              ?.hasTakenOrderFromStore
          )
            handleOpenPickup('client')
        }}
        className='cursor-pointer'
      >
        <CustomMarker
          longitude={
            delivery.clientLocation
              .longitude
          }
          latitude={
            delivery.clientLocation
              .latitude
          }
          type='client'
          animation={orderPicked}
        />
      </Button>
      <Button
        onClick={() => {
          handleOpenPickup('partner')
        }}
        className='cursor-pointer'
      >
        <CustomMarker
          latitude={
            delivery.storeLocation
              .latitude
          }
          longitude={
            delivery.storeLocation
              .longitude
          }
          type='partner'
          active={!orderPicked}
          animation={!orderPicked}
        />
      </Button>

      <CustomMarker
        longitude={longitude}
        latitude={latitude}
        type='delivery_man'
      />
    </Map>
  )
}
// #06b6d4
// #cff7fe
// Rest of your CustomMarker component remains the same
export function CustomMarker({
  longitude,
  latitude,
  type,
  active = true,
  animation = false,
}: {
  longitude: number
  latitude: number
  type:
    | 'delivery_man'
    | 'client'
    | 'partner'
  active?: boolean
  animation?: boolean
}) {
  if (type === 'client') {
    return (
      <Marker
        longitude={longitude}
        latitude={latitude}
        anchor='bottom'
      >
        <div
          className={`relative flex size-[62px] items-center justify-center rounded-full ${active ? 'bg-amethyst-500/20' : 'bg-lynch-500/20'}`}
        >
          {animation && (
            <div className='absolute size-[40px] animate-pingCircle rounded-full bg-amethyst-500/40' />
          )}
          <div className='flex size-[51.5px] items-center justify-center rounded-full bg-white'>
            <div
              className={`flex size-[39px] items-center justify-center rounded-full bg-amethyst-500 text-white`}
            >
              <UserSearch />
            </div>
          </div>
        </div>
      </Marker>
    )
  }

  if (type === 'partner') {
    return (
      <Marker
        longitude={longitude}
        latitude={latitude}
        anchor='bottom'
      >
        <div
          className={`relative flex size-[62px] items-center justify-center rounded-full ${active ? 'bg-scooter-500/20' : 'bg-lynch-500/20'}`}
        >
          {animation && (
            <div className='absolute size-[40px] animate-pingCircle rounded-full bg-scooter-500/40' />
          )}
          <div className='flex size-[51.5px] items-center justify-center rounded-full bg-white'>
            <div
              className={`flex size-[39px] items-center justify-center rounded-full ${active ? 'bg-scooter-500' : 'bg-lynch-500'} text-white`}
            >
              <Building />
            </div>
          </div>
        </div>
      </Marker>
    )
  }

  if (type === 'delivery_man') {
    return (
      <Marker
        longitude={longitude}
        latitude={latitude}
        anchor='bottom'
      >
        <div
          className={cn(
            'flex size-11 items-center justify-center rounded-full border-2 border-mountain-500 bg-white text-mountain-500'
          )}
        >
          {/* <UserSearch /> */}
          <MdOutlineDeliveryDining
            size={30}
          />
        </div>
      </Marker>
    )
  }
}
