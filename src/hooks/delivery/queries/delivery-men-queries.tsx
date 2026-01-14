import { DeliveryC, DeliveryMapC, MapPos } from '@/lib/delivery-classes'
import { Name } from '@/types/GlobalType'
import { createQueryFn } from '@/utils/createQueryFn'
import { useQuery, useMutation } from '@tanstack/react-query'
import api from '@/utils/api'

export type DeliveryManT = {
  id: string
  avatarPath?: string
  name: Name
  email: string
  phone: string
  deliveryBoyAvailable: boolean
  distanceOfDeliveryBoy: number
  position?: {
    latitude: number
    longitude: number
  }
}

export type DeliveryStatus = 'PENDING' | 'ASSIGNED' | 'ON_THE_WAY' | 'DELIVERED' | 'CANCELLED'

export const useGetDeliveryManList = ({
  latitude,
  longitude,
  enabled = true,
}: {
  latitude: number
  longitude: number
  enabled?: boolean
}) => {
  return useQuery({
    queryKey: ['delivery-men-list', { latitude, longitude }],
    queryFn: createQueryFn<DeliveryManT[]>(
      `/deliveries/byPartner?latitude=${latitude}&longitude=${longitude}`
    ),
    enabled,
    select: (data) => {
      return data.map((d) => ({
        value: d.id.toString(),
        label: `${d.name.firstName} ${d.name.lastName}`,
        image: d.avatarPath,
      }))
    },
  })
}

export const usePositionAll = ({ orderId }: { orderId: string }) => {
  const fn: (data: any) => DeliveryC = (data) => {
    // Extract store and client locations from API response
    const storeLocation = data.storeLocation || {
      longitude: 0,
      latitude: 0,
    }
    const clientLocation = data.clientLocation || {
      longitude: 0,
      latitude: 0,
    }

    const delivery: DeliveryC = new DeliveryC(
      storeLocation,
      clientLocation,
      orderId,
      data.boys.map((boy: any) => {
        const deliveryBoy: DeliveryMapC = new DeliveryMapC(
          boy.id,
          {
            name: boy.name,
            phone: boy.phone,
            email: boy.email,
          },
          // Use actual position from API data instead of mock data
          boy.position || { latitude: 0, longitude: 0 },
          boy.status !== 'ACTIVE'
        )
        return deliveryBoy
      })
    )
    return delivery
  }
  return useQuery({
    queryKey: ['delivery-men'],
    queryFn: createQueryFn<DeliveryC>(
      `/deliveries/getAllDeliveryManPositions/${orderId}`,
      fn
    ),
  })
}

export const useGetDeliveryManListByStatus = ({
  latitude,
  longitude,
}: {
  latitude: number
  longitude: number
}) => {
  return useQuery({
    queryKey: ['delivery-men-list', { latitude, longitude }],
    queryFn: createQueryFn<DeliveryManT[]>(
      `/deliveries/byPartner?latitude=${latitude}&longitude=${longitude}`
    ),
    select: (data) => {
      return [
        {
          category: 'Disponible',
          members: data.filter((d) => d.deliveryBoyAvailable),
        },
        {
          category: 'A planifier',
          members: data.filter((d) => !d.deliveryBoyAvailable),
        },
      ]
    },
  })
}

export const useGetDeliveryManDetails = ({
  orderId,
  deliveryManId,
  enabled = true,
}: {
  orderId: string
  deliveryManId: string
  enabled?: boolean
}) => {
  return useQuery({
    queryKey: ['delivery-man-details', { orderId, deliveryManId }],
    queryFn: createQueryFn<DeliveryManT>(
      `/deliveries/detailsDeliveryBoy/${orderId}/${deliveryManId}`
    ),
    enabled: enabled && !!orderId && !!deliveryManId,
  })
}

export const useAssignDeliveryMan = () => {
  return useMutation({
    mutationFn: async ({
      deliveryId,
      status = 'ASSIGNED',
    }: {
      deliveryId: string
      status?: string
    }) => {
      const response = await api.put(
        `/deliveries/${deliveryId}?status=${status}`
      )
      return response.data
    },
  })
}
