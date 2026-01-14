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
import { cn } from '@/lib/utils'
import { DeliveryManDetailsDrawer } from './Drawers'
import { useNotification } from '@/context/NotifContext'
import { SuccessDialog } from './Dialogs'
import { useRouter } from 'next/navigation'
import { DeliveryManDetailsDialogDrawer } from './DeliveryManDetailsDialogDrawer'
import { useDeliveryStore } from '@/context/StoreDelivery'
import {
  DeliveryC,
  DeliveryMapC,
  MapPos,
} from '@/lib/delivery-classes'
import { DeliveryRoutes } from '@/lib/routes'

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

const osrmUrl = `https://router.project-osrm.org/route/v1/driving/:startLong,:startLat;:endLong,:endLat?overview=full&geometries=geojson`

type RouteLeg = {
  distance: number // in meters
  duration: number // in seconds
}

/**
 * Calculate route legs between coordinates using OSRM API.
 * @param first - Starting point (MapPos)
 * @param second - Second point (or end point if `third` is undefined)
 * @param third - Optional third point (to split into two legs)
 * @returns Promise<RouteLeg[]> - Array of legs with distance/duration
 */
async function calculateRouteLeg(
  first: MapPos,
  second: MapPos,
  third?: MapPos
): Promise<RouteLeg> {
  // Build coordinates array (2 or 3 points)
  const coordinates = [first, second]
  if (third) coordinates.push(third)

  // Construct OSRM API URL
  const coordsString = coordinates
    .map(
      (coord) =>
        `${coord.longitude},${coord.latitude}`
    )
    .join(';')

  const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${coordsString}?overview=full&geometries=geojson`

  try {
    const response =
      await fetch(osrmUrl)
    const data = await response.json()

    // Validate response structure
    if (!data.routes?.[0]?.legs) {
      throw new Error(
        'Invalid route response from OSRM'
      )
    }

    const legs: RouteLeg[] =
      data.routes[0].legs

    // Case 1: Third point provided → sum two legs
    if (third) {
      if (legs.length !== 2) {
        throw new Error(
          `Expected 2 legs for 3 points, got ${legs.length}`
        )
      }
      return {
        distance:
          legs[0].distance +
          legs[1].distance,
        duration:
          legs[0].duration +
          legs[1].duration,
      }
    }

    // Case 2: Only two points → return single leg
    if (legs.length !== 1) {
      throw new Error(
        `Expected 1 leg for 2 points, got ${legs.length}`
      )
    }
    return legs[0]
  } catch (error) {
    console.error(
      'Routing calculation failed:',
      error
    )
    throw error // Re-throw for caller to handle
  }
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

export default function MapCompManager({
  children,
  handleOpenPickup,
  role,
  affectation,
  delivery,
  orderId,
  deliveryId,
}: {
  affectation: boolean
  children?: React.ReactNode
  handleOpenPickup: (
    value: boolean
  ) => void
  role: Roles
  delivery: DeliveryC
  orderId: string
  deliveryId: string
}) {
  const {
    deliveries,
    getDelivery,
    getDeliveryTracking,
  } = useDeliveryStore()
  console.log(
    'deliveries: ',
    deliveries
  )
  console.log(
    'delivery: ',
    getDelivery(orderId)
  )

  const [
    deliverySelected,
    setDeliverySelected,
  ] = useState<DeliveryC | null>(() =>
    !affectation ? delivery : null
  )
  const [
    isSuccessDialogOpen,
    setIsSuccessDialogOpen,
  ] = useState(false)
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
  const [distance, setDistance] =
    useState<number | null>(null)
  const geoControlRef =
    useRef<maplibregl.GeolocateControl | null>(
      null
    )
  const router = useRouter()
  console.log(
    'afffectation: ',
    affectation
  )
  console.log(
    'selected Delivery: ',
    deliverySelected
  )
  useEffect(() => {
    if (
      !mapInstance ||
      !deliverySelected
    )
      return
    console.log(
      '+++++++==============',
      deliverySelected
    )
    if (
      deliverySelected.getAllActiveDeliveries()
        .length
    ) {
      console.log('+/+++++++++/+/')
      const storeCoords =
        deliverySelected.storeLocation
      const clientCoords =
        deliverySelected.clientLocation

      let deliveryCoords =
        deliverySelected.deliverys[0]
          .position

      const end = orderPicked
        ? clientCoords
        : storeCoords

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
                  data.routes[0]
                    .duration,
              }, // Store duration
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
    } else {
      calculateRouteLeg(
        deliverySelected.deliverys[0]
          .position,
        deliverySelected.storeLocation,
        deliverySelected.clientLocation
      )
        .then((estimation) => {
          setDistance(
            estimation.distance
          )
          setRemainingTime(
            parseDuration(
              estimation.duration
            ) || null
          )
        })
        .catch(console.error)
    }
  }, [
    orderPicked,
    mapInstance,
    deliverySelected,
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
    deliveries,
  ])

  useEffect(() => {
    if (!mapInstance) return

    // Update the route layer's line-color based on the orderPicked state
    mapInstance.setPaintProperty(
      'route',
      'line-color',
      orderPicked
        ? '#a855f7'
        : '#06b6d4'
    )
  }, [orderPicked, mapInstance])
  if (!delivery) return null
  return (
    <Map
      id='map'
      initialViewState={{
        longitude:
          (affectation
            ? delivery?.storeLocation
                ?.longitude
            : delivery?.clientLocation
                ?.longitude) || 0,
        latitude:
          (affectation
            ? delivery?.storeLocation
                ?.latitude
            : delivery?.clientLocation
                ?.latitude) || 0,
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
      {affectation && (
        <div className='sticky left-0 m-2 lg:m-0'>
          {children}
        </div>
      )}
      {!affectation && (
        <div className='absolute bottom-4 right-11 flex flex-col gap-4'>
          <CustomButton
            label=''
            IconRight={Phone}
            className='h-14 w-14 rounded-full bg-primary text-white transition-all hover:bg-mountain-100 hover:text-primary [&>.icon]:m-0'
            onClick={() => {}}
          />
          <CustomButton
            label=''
            IconRight={MessageCircle}
            className='h-14 w-14 rounded-full bg-amethyst-500 text-white transition-all hover:bg-amethyst-100 hover:text-amethyst-500 [&>.icon]:m-0'
            onClick={() => {}}
          />
          {/* {children} */}
        </div>
      )}
      <button
        onClick={() =>
          setOrderPicked(!orderPicked)
        }
        className='absolute bottom-20 left-4 z-10 rounded bg-white p-2 shadow-lg'
      >
        {orderPicked
          ? 'Order Picked'
          : 'Pick Order'}
      </button>

      <GeolocateControl
        ref={geoControlRef}
        position='bottom-right'
      />
      <Layer {...parkLayer} />
      {affectation === true &&
        delivery?.deliverys.map(
          (deliveryMan) => (
            <Button
              key={deliveryMan.id}
              disabled={
                deliveryMan.active
              }
              onClick={() => {
                if (deliveryMan.active)
                  return
                setDeliverySelected(
                  getDeliveryTracking(
                    orderId,
                    deliveryMan.id
                  )!
                )
                console.log(
                  'clicked on delivery'
                )
              }}
              className='rounded-full hover:bg-scooter-700'
              // onBlur={() => setDeliverySelected(null)}
            >
              <CustomMarker
                longitude={
                  deliveryMan.position
                    .longitude
                }
                latitude={
                  deliveryMan.position
                    .latitude
                }
                type='delivery_man'
                active={
                  deliveryMan.active
                }
              />
            </Button>
          )
        )}
      {!affectation &&
        delivery?.deliverys.length >
          0 && (
          <Button
            key={
              delivery?.deliverys?.[0]
                ?.id
            }
            disabled={
              delivery?.deliverys?.[0]
                ?.active
            }
            onClick={() => {
              if (
                delivery?.deliverys[0]
                  .active
              )
                return
              setDeliverySelected(
                getDeliveryTracking(
                  orderId,
                  delivery?.deliverys[0]
                    .id
                )!
              )
              console.log(
                'clicked on delivery'
              )
            }}
            className='rounded-full hover:bg-scooter-700'
            // onBlur={() => setDeliverySelected(null)}
          >
            <CustomMarker
              longitude={
                delivery?.deliverys[0]
                  ?.position?.longitude
              }
              latitude={
                delivery?.deliverys[0]
                  ?.position?.latitude
              }
              type='delivery_man'
              active={
                delivery?.deliverys[0]
                  ?.active
              }
            />
          </Button>
        )}
      {/* Store and Client Markers - Always visible */}
      <>
        <Button
          onClick={() => {
            if (!affectation) {
              handleOpenPickup(true)
              console.log('clicked on client')
            }
          }}
          className='cursor-pointer'
        >
          <CustomMarker
            longitude={delivery.clientLocation.longitude}
            latitude={delivery.clientLocation.latitude}
            type='client'
            animation={orderPicked && !affectation}
          />
        </Button>
        <Button
          onClick={() => {
            if (!affectation) {
              handleOpenPickup(true)
              console.log('clicked on partner')
            }
          }}
          className='cursor-pointer'
        >
          <CustomMarker
            latitude={delivery.storeLocation.latitude}
            longitude={delivery.storeLocation.longitude}
            type='partner'
            active={!orderPicked || affectation}
            animation={(!orderPicked && !affectation) || (affectation && !!deliverySelected)}
          />
        </Button>
      </>
      {/* Show drawer when delivery man is selected during affectation */}
      {affectation && deliverySelected && (
          <DeliveryManDetailsDialogDrawer
            deliveryMan={
              deliverySelected
                .deliverys[0]
            }
            open={!!deliverySelected}
            setOpen={(open) => {
              if (!open) {
                setDeliverySelected(
                  null
                )
              }
            }}
            distance={distance!}
            estimation={remainingTime!}
            orderId={orderId}
            selected={affectation}
            deliveryPos={
              deliverySelected
                .deliverys[0].position
            }
            showSuccessDialog={() => {
              setIsSuccessDialogOpen(
                true
              )
              deliverySelected.deliverys[0].update(
                { active: true }
              )
              router.push(
                `${DeliveryRoutes.deliveryMap}?orderId=${orderId}&deliveryManId=${deliverySelected.deliverys[0].id}`
              )
            }}
          />
        )}
      <SuccessDialog
        isOpen={isSuccessDialogOpen}
        setIsOpen={
          setIsSuccessDialogOpen
        }
        content='La commande a été affecté avec succès'
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
