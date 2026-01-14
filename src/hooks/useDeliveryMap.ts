// hooks/useDeliveryMap.ts
import { useEffect, useState } from 'react'
import { DeliveryMapC, MapPos } from '@/lib/delivery-classes'

export const useDeliveryMap = (deliveryMap?: DeliveryMapC) => {
  const [version, setVersion] = useState(0)

  useEffect(() => {
    if (!deliveryMap) return

    const unsubscribe = deliveryMap.subscribe(() => {
      setVersion((v) => v + 1)
    })

    return unsubscribe
  }, [deliveryMap])

  return {
    deliveryMap,
    version,
    updatePosition: (position: MapPos) => deliveryMap?.update({ position }),
    updateStatus: (status: Partial<DeliveryMapC>) =>
      deliveryMap?.update(status),
  }
}
