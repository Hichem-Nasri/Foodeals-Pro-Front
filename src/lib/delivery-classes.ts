import { ContactType } from '@/types/GlobalType'

export type MapPos = {
  latitude: number
  longitude: number
}

type Subscriber = () => void

export class DeliveryMapC {
  id: string
  delivery: ContactType & {
    avatar?: string
  }
  position: MapPos
  active: boolean
  hasTakenOrderFromStore: boolean
  hasDeliveredOrderToClient: boolean
  distance: number

  private subscribers: Subscriber[] = []

  constructor(
    id: string,
    delivery: ContactType,
    position: MapPos,
    active = false
  ) {
    this.id = id
    this.delivery = delivery
    this.position = position
    this.active = active
    this.hasTakenOrderFromStore = false
    this.hasDeliveredOrderToClient =
      false
    this.distance = 0
  }

  update(props: Partial<DeliveryMapC>) {
    Object.assign(this, props)
    this.notify()
  }

  subscribe(callback: Subscriber) {
    this.subscribers.push(callback)
    return () => {
      this.subscribers =
        this.subscribers.filter(
          (sub) => sub !== callback
        )
    }
  }

  private notify() {
    this.subscribers.forEach((cb) =>
      cb()
    )
  }

  // Utility methods
  markAsTakenFromStore() {
    this.hasTakenOrderFromStore = true
    this.notify()
  }

  markAsDeliveredToClient() {
    this.hasDeliveredOrderToClient =
      true
    this.notify()
  }

  toggleActive() {
    this.active = !this.active
    this.notify()
  }

  // Serialize for sending over WebSocket
  toJSON() {
    return {
      id: this.id,
      delivery: this.delivery,
      position: this.position,
      active: this.active,
      hasTakenOrderFromStore:
        this.hasTakenOrderFromStore,
      hasDeliveredOrderToClient:
        this.hasDeliveredOrderToClient,
    }
  }
}

// lib/delivery-classes.ts
export class DeliveryC {
  storeLocation: MapPos
  clientLocation: MapPos
  orderId: string
  deliverys: DeliveryMapC[]

  private subscribers: Subscriber[] = []

  constructor(
    storeLocation: MapPos,
    clientLocation: MapPos,
    orderId: string,
    deliverys: DeliveryMapC[] = []
  ) {
    this.storeLocation = storeLocation
    this.clientLocation = clientLocation
    this.orderId = orderId
    this.deliverys = deliverys
  }

  // Add a new delivery map
  addDelivery(delivery: DeliveryMapC) {
    this.deliverys.push(delivery)
    this.notify()
  }

  // Remove a delivery map by ID
  removeDelivery(deliveryId: string) {
    this.deliverys =
      this.deliverys.filter(
        (d) => d.id !== deliveryId
      )
    this.notify()
  }

  // Update a specific delivery map
  updateDelivery(
    deliveryId: string,
    update: Partial<DeliveryMapC>
  ) {
    const delivery =
      this.deliverys.find(
        (d) => d.id === deliveryId
      )
    if (delivery) {
      delivery.update(update)
      this.notify()
    }
  }

  // Find a delivery map by ID
  getDelivery(
    deliveryId: string
  ): DeliveryMapC | undefined {
    return this.deliverys.find(
      (d) => d.id === deliveryId
    )
  }

  // Observable pattern: Subscribe to changes
  subscribe(callback: Subscriber) {
    this.subscribers.push(callback)
    return () => {
      this.subscribers =
        this.subscribers.filter(
          (sub) => sub !== callback
        )
    }
  }

  // Notify all subscribers of changes
  private notify() {
    this.subscribers.forEach((cb) =>
      cb()
    )
  }

  // Serialize for sending over WebSocket
  toJSON() {
    return {
      storeLocation: this.storeLocation,
      clientLocation:
        this.clientLocation,
      orderId: this.orderId,
      deliverys: this.deliverys.map(
        (d) => d && d.toJSON()
      ),
    }
  }

  // Utility methods
  getAllActiveDeliveries(): DeliveryMapC[] {
    return this.deliverys.filter(
      (d) => d.active
    )
  }

  getDeliveriesByStatus(
    hasTakenOrder: boolean,
    hasDeliveredOrder: boolean
  ): DeliveryMapC[] {
    return this.deliverys.filter(
      (d) =>
        d.hasTakenOrderFromStore ===
          hasTakenOrder &&
        d.hasDeliveredOrderToClient ===
          hasDeliveredOrder
    )
  }
}
