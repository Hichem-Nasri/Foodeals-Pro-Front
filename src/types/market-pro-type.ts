import {
  DealProSchema,
  DealSchema,
  SupplementSchema,
} from '@/schemas/pro-market/offers-schema'
import { z } from 'zod'
import { PriceType } from './GlobalType'

export interface CartType {
  deals: Deal[]
  totalOfProducts: number
  priceHt: PriceType
  priceTva: PriceType
  priceTotalTTc: PriceType
  commissionFoodeals: PriceType
}

export interface Deal {
  id: string
  titleDeal: string
  description: string
  dateDeal: string
  hourOfDeal: string
  organizationName: string
  organizationAvatar: string
  price: PriceType
  quantity: number
  orderDate: string
  modalityPayment: string
  modalityTypes: string[]
  deliveryAdress: string
}
export type BasketItem = {
  id: string
  Store: {
    name: string
    image: string
    products: number
  }
  date: string
  price: number
  orders: {
    name: string
    image: string
    description: string
    quantity: number
    price: number
  }[]
  dateDeal: string
  hourOfDeal: string
  modalityPayment: string
  modalityTypes: string[]
  deliveryAdress: string
}

export type OrderStatusT = 'IN_PROGRESS' | 'DELIVERED' | 'CANCELED'
export type OrderSourceT =
  | 'DEAL_PRO'
  | 'PRO_MARKET'
  | 'DONATE_CLIENT'
  | 'PRO_DLC'

export type OrderDealType = {
  id: string
  type: string
  status: OrderStatusT
  orderSource: OrderSourceT
  client: string
  clientProAvatar?: string
  clientProActivity?: string
  photosProducts: string[]
  title: string
  description: string
  quantity: number
  orderDate: Date
  priceOrder: PriceType
  oldPrice: PriceType
  seen: boolean
  affected: boolean
}

export type DealType = z.infer<typeof DealSchema>
export const defaultDeal: DealType = {
  productImages: [''],
  title: '',
  category: '',
  description: '',
  type: '',
  supplements: [],
  unity: '',
  quantity: 0,
  sauces: [],
  sodas: [],
  barCode: '',
  consumptionMethods: [],
  deliveryCost: 0,
  initialPrice: 0,
  reductionPercentage: 0,
  startDate: new Date(),
  endDate: new Date(),
  startTime: '',
  endTime: '',
  expirationDate: new Date(),
  paymentMethod: 'CARD',
}

export const defaultDealPro: DealProType = {
  defaultUnity: {
    unity: '',
    x30: 0,
    x60: 0,
    x120: 0,
  },
  typeProduct: 'product',
  customUnity: {
    unity: '',
    global: {
      quantity: 0,
      price: 0,
    },
    min: {
      quantity: 0,
      price: 0,
    },
  },
  prixLot: 0,
  ...defaultDeal,
}

export type SupplementType = z.infer<typeof SupplementSchema>
export type DealProType = z.infer<typeof DealProSchema>

export const Suda: SupplementType[] = [
  {
    name: 'Soda 1',
    price: 2,
    image: '/images/soda.png',
  },
  {
    name: 'Soda 2',
    price: 3,
    image: '/images/soda.png',
  },
  {
    name: 'Soda 3',
    price: 4,
    image: '/images/soda.png',
  },
]

export const Sauces: SupplementType[] = [
  {
    name: 'Sauce 1',
    price: 1,
    image: '/images/sauce-1.png',
  },
  {
    name: 'Sauce 2',
    price: 2,
    image: '/images/sauce-2.png',
  },
  {
    name: 'Sauce 3',
    price: 3,
    image: '/images/sauce-1.png',
  },
]

// export const basketItems: BasketItem[] = [
//   {
//     Store: {
//       name: 'Store 1',
//       image: '/marjane_logo.png',
//       products: 10,
//     },
//     date: '2022-01-01',
//     price: 20,
//     orders: [
//       {
//         name: 'Product 1',
//         image: 'pizza.png',
//         description:
//           'Lorem ipsum, dolor sit amet consectetur adipisicing elit.Hic, facilis incidunt. Quas qui dolorum magni, adipiscicupiditate laborum nostrum ducimus perferendis distinctio beatae quos tenetur facere molestias doloremque fuga voluptates? 3',
//         quantity: 2,
//         price: 10,
//       },
//       {
//         name: 'Product 2',
//         image: 'jus.jpg',
//         description:
//           'Lorem ipsum, dolor sit amet consectetur adipisicing elit.Hic, facilis incidunt. Quas qui dolorum magni, adipiscicupiditate laborum nostrum ducimus perferendis distinctio beatae quos tenetur facere molestias doloremque fuga voluptates? 3',
//         quantity: 1,
//         price: 5,
//       },
//     ],
//   },
//   {
//     Store: {
//       name: 'Store 2',
//       image: 'marjane_logo.png',
//       products: 5,
//     },
//     date: '2022-01-02',
//     price: 15,
//     orders: [
//       {
//         name: 'Product 3',
//         image: 'cheddar.png',
//         description:
//           'Lorem ipsum, dolor sit amet consectetur adipisicing elit.Hic, facilis incidunt. Quas qui dolorum magni, adipiscicupiditate laborum nostrum ducimus perferendis distinctio beatae quos tenetur facere molestias doloremque fuga voluptates? 3',
//         quantity: 3,
//         price: 5,
//       },
//     ],
//   },
// ]
