import { Name, PaymentMethodEnum, PriceType } from '@/types/GlobalType'
import { createQueryFn } from '@/utils/createQueryFn'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'

type ProductType = {
  id: string
  name: string
  description: string
  imageUrl: string
  creationDate: string
}

type DealType = {
  type: 'DEAL'
  box: null
  deal: {
    id: string
    quantity: number
    price: PriceType
    product: ProductType
  }
}
type BoxType = {
  type: 'BOX'
  deal: null
  box: {
    id: string
    title: string
    description: string
    quantity: number
    items: {
      price: PriceType
      quantity: number
      product: ProductType
    }[]
  }
}

// export const BoxPlaceholder: BoxType = {
//     type: 'BOX',
//     deal: null,
//     box: {
//         id: 'somoeransdf',
//         title: 'Pack of fast food',
//         description: 'Some fresh and good looking food',
//         items: [
//             {
//                 price: {
//                     amount: 244,
//                     currency: 'MAD',
//                 },
//                 quantity: 2,
//                 product: {
//                     id: 'somepssrodclsjdaf',
//                     creationDate: new Date().toISOString(),
//                     name: 'Sandwich',
//                     description: 'some good description',
//                     imageUrl: '/images/fromages.png',
//                 },
//             },
//             {
//                 price: {
//                     amount: 244,
//                     currency: 'MAD',
//                 },
//                 quantity: 2,
//                 product: {
//                     id: 'someprodclsjdasgsdf',
//                     creationDate: String(new Date()),
//                     name: 'Sandwich',
//                     description: 'some good description',
//                     imageUrl: '/images/pizza.png',
//                 },
//             },
//             {
//                 price: {
//                     amount: 244,
//                     currency: 'MAD',
//                 },
//                 quantity: 2,
//                 product: {
//                     id: 'someprogdasdclsjdaf',
//                     creationDate: String(new Date()),
//                     name: 'Sandwich',
//                     description: 'some good description',
//                     imageUrl: '/images/cheddar.png',
//                 },
//             },
//         ],
//     },
// }

// {
//   "id": "d8126cc6-8bd0-4884-b1b2-fc0f3844e2cd",
//   "type": "PICKUP",
//   "status": "IN_PROGRESS",
//   "orderSource": "DEAL_PRO",
//   "client": "Marjane Market Casa",
//   "clientProAvatar": "market_logo.png",
//   "clientProActivity": "PATTESERIES",
//   "photosProducts": [
//       "fromages.jpg"
//   ],
//   "barCode": null,
//   "title": "Fromage au lait",
//   "description": "Fromage au lait fabriqué à partir de lait entier",
//   "quantity": null,
//   "orderDate": "2025-01-10T00:13:25.101+00:00",
//   "priceOrder": {
//       "amount": 250.00,
//       "currency": "MAD"
//   },
//   "seen": false,
//   "affected": true
// }

export type OrderStatus = 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED'
export interface OrderDealProType {
  id: string
  idDealPro: string
  type: string
  status: OrderStatus
  orderSource: string
  client: string
  clientProAvatar: string
  clientProActivity: string
  photosProducts: string[]
  title: string
  barCode: string | null
  description: string
  quantity: number
  orderDate: string
  priceOrder: PriceType
  offerCreatorName: string | null
  offerCreatorAvatar: string | null
  seen: boolean
  affected: boolean
}

export type OrderType = {
  id: string
  idDealPro: string | null
  // type:
  status: 'IN_PROGRESS' | 'DELIVERED' | 'CANCELED'
  client: {
    id: number
    avatarPath?: string | null
    name: Name
    phone: string | null
    email: string | null
    address: string | null
  }

  offer: {
    id: string
    price: PriceType
    salePrice: PriceType
  } & (DealType | BoxType)

  address: {
    address: string
    city: { name: string }
  }
  quantity: number
  transaction: {
    id: string
    price: PriceType
    type: 'CARD' | 'CASH'
    createdDate: string
  }

  // orderSource: 'DEAL_PRO' | 'PRO_MARKET' | 'DONATE_CLIENT'

  // SubEntityResponse: {
  //     id: string
  //     name: string
  //     phone: string | null
  //     email: string | null
  //     avatarPath: string
  //     activities: { name: string }[]
  // }
} & (
  | {
      orderSource: 'DEAL_PRO'
      SubEntityResponse: {
        id: string
        name: string
        phone: string | null
        email: string | null
        avatarPath: string
        activities: { name: string }[]
      }
    }
  | { orderSource: 'PRO_MARKET' | 'DONATE_CLIENT'; SubEntityResponse: null }
) & {
    solutionType?: 'DELIVERY' | 'MARKETPRO'
    statusProduct?: {
      read: boolean
      processed: boolean
    }
  }

export type OrderDetailsType = {
  id: string
  quantity: number
  orderDate: string
  hourOfOrder: string
  photosProducts: string[]
  title: string
  description: string
  priceOrder: PriceType
  quantityOfOrder: number
  client: Name
  clientAvatar: string | null
  phoneClient: string
  emailClient: string
  clientActivity: string | null
  sellerName: string
  sellerAvatar: string
  sellerActivity: string | null
  typePayment: PaymentMethodEnum
  deliveryPartenerName: string | null
  deliveryDate: string | null
  hourOfDelivet: string | null
  DeliveryBoyName: string | null
  deliveryBoyPhone: string | null
  deliveryBoyEmail: string | null
  deliveryAdress: string
  orderStatus: 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED'
  cancellationReason: string | null
  cancellationSubject: string | null
  attechementFile: string | null
  modality: string[]
}

export const useGetDelivOrders = () => {
  return useQuery({
    queryKey: ['not-affected-orders'],
    // queryFn: createQueryFn<OrderDealProType[]>('/orders/not-affected'),
    queryFn: createQueryFn<OrderDealProType[]>('/orders/not-affected'),
  })
}

export const useGetDelivOrderById = (id: string) => {
  return useQuery({
    queryKey: ['delivery-order-by-id', { id }],
    queryFn: createQueryFn<OrderDetailsType>(`/orders/${id}`),
  })
}
