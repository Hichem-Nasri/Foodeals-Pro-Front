// context/delivery-store.tsx
'use client'

import { createContext, useContext, useEffect, useRef } from 'react'
import { DeliveryC, DeliveryMapC, MapPos } from '@/lib/delivery-classes'
import { useWebSocket } from './UseSocket'

export interface DeliveryItem {
  id: string
  position?: MapPos
  update: (data: Partial<DeliveryItem>) => void
}

export interface ExpectedDeliveryType {
  orderId: string
  deliveries: DeliveryItem[]
}

type DeliveryStore = {
  deliveries: Map<string, DeliveryC>
  getDelivery: (orderId: string) => DeliveryC | undefined
  updateDeliveryPosition: (
    orderId: string,
    deliveryId: string,
    position: MapPos
  ) => void
  addDlivery: (orderId: string, delivery: DeliveryMapC) => void
  addOrder: (delivery: DeliveryC) => void

  getDeliveryTracking: (
    orderId: string,
    deliveryId: string
  ) => DeliveryC | undefined
}

const DeliveryStoreContext = createContext<DeliveryStore>({
  deliveries: new Map(),
  getDelivery: () => undefined,
  updateDeliveryPosition: () => {},
  addDlivery: () => {},
  addOrder: () => {},
  getDeliveryTracking: () => undefined,
})

export const DeliveryProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const deliveriesRef = useRef<Map<string, DeliveryC>>(new Map())

  // useEffect(() => {
  //   const unsubPosition = subscribe<{
  //     orderId: string
  //     deliveryId: string
  //     position: MapPos
  //   }>('/update/position', ({ orderId, deliveryId, position }) => {
  //     const delivery = deliveriesRef.current.get(orderId)
  //     if (delivery) {
  //       const deliveryMap = delivery.deliverys.find((d) => d.id === deliveryId)
  //       if (deliveryMap) {
  //         deliveryMap.position = position
  //         deliveryMap.update({ position }) // Trigger observable update
  //       }
  //     }
  //   })

  //   const unsubStatus = subscribe<{
  //     orderId: string
  //     status: Partial<DeliveryMapC>
  //   }>('/topic/status', ({ orderId, status }) => {
  //     const delivery = deliveriesRef.current.get(orderId)
  //     if (delivery) {
  //       const deliveryMap = delivery.deliverys.find((d) => d.id === status.id)
  //       if (deliveryMap) {
  //         deliveryMap.update(status) // Trigger observable update
  //       }
  //     }
  //   })

  //   return () => {
  //     unsubPosition()
  //     unsubStatus()
  //   }
  // }, [])

  const store: DeliveryStore = {
    deliveries: deliveriesRef.current,
    getDelivery: (orderId) => deliveriesRef.current.get(orderId),
    updateDeliveryPosition: (orderId, deliveryId, position) => {
      const delivery = deliveriesRef.current.get(orderId)
      if (delivery) {
        const deliveryMap = delivery.deliverys.find((d) => d.id === deliveryId)
        if (deliveryMap) {
          deliveryMap.position = position
          deliveryMap.update({ position })
        }
      }
    },
    addDlivery: (orderId, delivery) => {
      const current = deliveriesRef.current.get(orderId)
      if (current) {
        current.addDelivery(delivery)
      }
    },
    addOrder: (delivery) => {
      const current = deliveriesRef.current.get(delivery.orderId)
      if (current) {
        current.addDelivery(delivery.deliverys?.[0])
      } else {
        deliveriesRef.current.set(delivery.orderId, delivery)
      }
    },

    getDeliveryTracking(orderId: string, id: string) {
      const delivery = deliveriesRef.current.get(orderId)
      if (delivery) {
        const deliveryMap = delivery.deliverys?.find(
          (d: DeliveryMapC) => d.id == id
        )
        deliveryMap?.update({ active: true })
        return new DeliveryC(
          delivery.storeLocation,
          delivery.clientLocation,
          orderId,
          [deliveryMap!]
        ) // Return the specific delivery instead of an object
      }
      return undefined
    },
  }

  return (
    <DeliveryStoreContext.Provider value={store}>
      {children}
    </DeliveryStoreContext.Provider>
  )
}

export const useDeliveryStore = () => useContext(DeliveryStoreContext)
