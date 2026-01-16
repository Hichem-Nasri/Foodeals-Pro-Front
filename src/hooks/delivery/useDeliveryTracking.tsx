/**
 * Real-time delivery tracking hooks using WebSocket
 * 
 * These hooks enable:
 * - Delivery man position updates in real-time
 * - Manager dashboard live tracking
 * - Automatic reconnection on connection loss
 */

import { useEffect, useState, useCallback } from 'react'
import { useWebSocket } from '@/context/UseSocket'
import { DeliveryStatus } from '@/hooks/delivery/queries/delivery-men-queries'

export type DeliveryPosition = {
  latitude: number
  longitude: number
}

export type DeliveryPositionUpdate = {
  deliveryId: string
  orderId: string
  deliveryManId: number
  deliveryManName: string
  coordinates: DeliveryPosition
  status: DeliveryStatus
  estimatedArrivalMinutes?: number
  hasTakenOrderFromStore?: boolean
  timestamp?: string
}

/**
 * Hook for tracking a delivery man position updates
 * Subscribe to: `/topic/position/{orderId}/{deliveryManId}`
 * 
 * @param orderId - The order being delivered
 * @param deliveryManId - The delivery man ID
 * @param enabled - Whether to subscribe (default: true)
 */
export function useDeliveryTracking(
  orderId: string | null | undefined,
  deliveryManId: string | null | undefined,
  enabled: boolean = true
) {
  const [position, setPosition] = useState<DeliveryPosition | null>(null)
  const [status, setStatus] = useState<DeliveryStatus | null>(null)
  const [estimatedArrival, setEstimatedArrival] = useState<number | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [isSubscribed, setIsSubscribed] = useState(false)
  
  const { subscribe, isConnected } = useWebSocket()

  useEffect(() => {
    if (!enabled || !isConnected || !orderId || !deliveryManId) {
      setIsSubscribed(false)
      return
    }

    const channel = `/topic/position/${orderId}/${deliveryManId}`
    console.log('[useDeliveryTracking] Subscribing to:', channel)

    const unsubscribe = subscribe<DeliveryPositionUpdate>(
      channel,
      (message) => {
        console.log('[useDeliveryTracking] Received update:', message)
        setPosition(message.coordinates)
        setStatus(message.status)
        setEstimatedArrival(message.estimatedArrivalMinutes || null)
        setLastUpdate(new Date())
      }
    )

    setIsSubscribed(true)

    return () => {
      console.log('[useDeliveryTracking] Unsubscribing from:', channel)
      unsubscribe()
      setIsSubscribed(false)
    }
  }, [orderId, deliveryManId, enabled, isConnected, subscribe])

  return {
    position,
    status,
    estimatedArrival,
    lastUpdate,
    isSubscribed,
    isConnected,
  }
}

/**
 * Hook for manager to track all deliveries for an organization
 * Subscribe to: `/topic/deliveries/{organizationId}`
 * 
 * @param organizationId - The organization ID
 * @param enabled - Whether to subscribe (default: true)
 */
export function useManagerDeliveryTracking(
  organizationId: string | null | undefined,
  enabled: boolean = true
) {
  const [deliveries, setDeliveries] = useState<Map<string, DeliveryPositionUpdate>>(
    new Map()
  )
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [isSubscribed, setIsSubscribed] = useState(false)
  
  const { subscribe, isConnected } = useWebSocket()

  const updateDeliveryPosition = useCallback((update: DeliveryPositionUpdate) => {
    setDeliveries((prev) => {
      const newMap = new Map(prev)
      newMap.set(update.deliveryId, update)
      return newMap
    })
    setLastUpdate(new Date())
  }, [])

  useEffect(() => {
    if (!enabled || !isConnected || !organizationId) {
      setIsSubscribed(false)
      return
    }

    const channel = `/topic/deliveries/${organizationId}`
    console.log('[useManagerDeliveryTracking] Subscribing to:', channel)

    const unsubscribe = subscribe<DeliveryPositionUpdate>(
      channel,
      (message) => {
        console.log('[useManagerDeliveryTracking] Received update:', message)
        updateDeliveryPosition(message)
      }
    )

    setIsSubscribed(true)

    return () => {
      console.log('[useManagerDeliveryTracking] Unsubscribing from:', channel)
      unsubscribe()
      setIsSubscribed(false)
    }
  }, [organizationId, enabled, isConnected, subscribe, updateDeliveryPosition])

  return {
    deliveries,
    getDelivery: (deliveryId: string) => deliveries.get(deliveryId),
    getAllDeliveries: () => Array.from(deliveries.values()),
    lastUpdate,
    isSubscribed,
    isConnected,
  }
}

/**
 * Hook to send position updates from delivery man
 * Sends to: `/app/updatePosition`
 * 
 * @param deliveryId - The delivery ID
 * @param orderId - The order ID
 * @param deliveryManId - The delivery man ID
 * @param partnerId - The partner/organization ID
 */
export function useSendPositionUpdate(
  deliveryId: string | null | undefined,
  orderId: string | null | undefined,
  deliveryManId: number | null | undefined,
  partnerId: string | null | undefined
) {
  const { sendMessage, isConnected } = useWebSocket()

  const sendPosition = useCallback(
    (coordinates: DeliveryPosition, status?: DeliveryStatus) => {
      if (!deliveryId || !orderId || !deliveryManId || !isConnected) {
        console.warn('[useSendPositionUpdate] Cannot send - missing data or not connected')
        return false
      }

      const payload = {
        deliveryId,
        orderId,
        deliveryManId,
        partnerId: partnerId || undefined,
        coordinates,
        status,
      }

      console.log('[useSendPositionUpdate] Sending position:', payload)
      sendMessage('/app/updatePosition', payload)
      return true
    },
    [deliveryId, orderId, deliveryManId, partnerId, isConnected, sendMessage]
  )

  return {
    sendPosition,
    isConnected,
  }
}
