'use server'
import { cancelOrderSchema } from '@/schemas/pro-market/market-schema'
import {
  ContactDto,
  Name,
  PaymentMethodEnum,
  PriceType,
} from '@/types/GlobalType'
import {
  DealProType,
  DealType,
  defaultDeal,
  defaultDealPro,
  OrderDealType,
} from '@/types/market-pro-type'
import api from '@/utils/api'
import { z } from 'zod'

//! * Deal Part
export const getDeals = async (
  currentPage: number,
  pageSize: number,
  archive: boolean
) => {
  let url = ''

  url = `/deals?pageSize=${pageSize}&pageNum=${currentPage}`
  console.log('url: ', url)
  try {
    const response = await api.get(url)
    if (response.status !== 200) {
      throw new Error('Error: getting deals failed')
    }
    return {
      status: 200,
      data: {
        totalElements: response.data?.totalElements,
        totalPages: response.data?.totalPages,
        content: response.data?.content.map((deal: any) => ({})),
      },
    }
  } catch (error) {
    return { status: 500, data: null }
  }
}

const extractDataDeal = (data: any) => {
  console.log('data: ', data)
  try {
    const newData: DealType = {
      id: data?.id || '',
      title: data?.produtDealResponse?.title || '',
      description: data?.produtDealResponse?.description || '',
      category: data?.category || '',
      type: data?.publishAs || '',
      productImages: [
        '/images/' + data?.produtDealResponse?.productImagePath || '',
      ],
      supplements: data?.supplements || [],
      reductionPercentage: data?.reduction || 0,
      deliveryCost: data?.deliveryFee || 0,
      initialPrice: data?.price || 0,
      quantity: data?.quantity || 0,
      unity: '',
      paymentMethod: data?.modalityPaiement || '',
      consumptionMethods: data?.modalityTypes || '',

      startDate:
        data?.openTime?.length > 0
          ? new Date(data?.openTimes[0]?.date || '')
          : new Date(),
      endDate:
        data?.openTime?.length > 1
          ? new Date(data?.openTimes[1]?.date || '')
          : new Date(),
      startTime:
        (data?.openTime?.length > 1 &&
          data?.openTime[0].from.replace(':', 'h')) ||
        '',
      endTime:
        (data?.openTime?.length > 1 &&
          data?.openTime[1].to.replace(':', 'h')) ||
        '',
      expirationDate: new Date(data?.produtDealResponse?.expirationDate || ''),
      barCode: data?.produtDealResponse?.barcode || '',
    }
    console.log('newData', newData)
    return newData
  } catch (error) {
    console.error('Error extracting data:', error)
    return null
  }
}
export const getDeal = async (id: string): Promise<DealType | null> => {
  if (id == 'create') {
    return defaultDeal
  }
  try {
    const res = await api.get(`/deals/${id}`).catch((error) => {
      console.error('Error fetching deal:', error)
      return { status: 500, data: null }
    })
    if (res.status !== 200) {
      return null
    }
    return extractDataDeal(res.data)
  } catch (error) {
    return null
  }
  // return
}
//****************************** */

//! * Orders Part

//************** */ Get Orders */
export const getOrders = async (
  currentPage: number,
  pageSize: number,
  archive: boolean,
  state: string
): Promise<{
  status: number
  data: {
    totalElements: number
    totalPages: number
    content: OrderDealType[]
  } | null
}> => {
  let url = ''
  switch (state) {
    case 'pending':
      url = `/orders/today/IN_PROGRESS`
      break
    case 'valid':
      url = `/orders/today/COMPLETED`
      break
    case 'cancel':
      url = `/orders/today/CANCELED`
      break
    default:
      url = `/orders`
      break
  }
  console.log('url: ', url)
  try {
    const response = await api.get(
      url + `?pageSize=${pageSize}&pageNum=${currentPage}`
    )
    if (response.status !== 200) {
      throw new Error('Error: getting orders failed')
    }
    return {
      status: 200,
      data: {
        totalElements: response.data.length,
        totalPages: 0,
        content: response.data,
      },
    }
  } catch (error) {
    return { status: 500, data: null }
  }
}

//************** */ Get Order Id */
export interface DealBackendType {
  id: string
  quantity: number
  orderDate: Date
  photosProducts: string[]
  title: string
  description: string
  priceOrder: PriceType
  client: Name
  phoneClient: any
  emailClient: string
  typePayment: PaymentMethodEnum
  deliveryPartenerName: any
  deliveryDate: any
  hourOfDelivet: any
  DeliveryBoyName: any
  deliveryBoyPhone: any
  deliveryBoyEmail: any
  deliveryAdress: string
  orderStatus: string
  cancellationReason: string | null
  cancellationSubject: string | null
  attechementFile: string | null
  modality: string
}

export const getOrderById = async (
  id: string
): Promise<DealBackendType | null> => {
  try {
    const response = await api.get(`/orders/${id}`)
    if (response.status !== 200) {
      throw new Error('Error: getting order failed')
    }
    return response.data
  } catch (error) {
    return null
  }
}

//* *****Cancel Orders */

type cancelOrder = {
  id: string
  data: z.infer<typeof cancelOrderSchema>
}

export const cancelOrder = async ({
  id,
  data,
}: cancelOrder): Promise<number> => {
  try {
    const { attachements, ...rest } = data
    const blob = new Blob(
      [
        JSON.stringify({
          reason: data.motif,
          suject: data.content,
        }),
      ],
      { type: 'application/json' }
    )
    const formData = new FormData()
    formData.append('attachment', attachements as Blob)
    formData.append('cancelRequest', blob)
    const response = await api.patch(`/orders/${id}/cancel`, formData)
    if (response.status !== 200) {
      throw new Error('Error: canceling order failed')
    }
    return response.status
  } catch (error) {
    return 500
  }
}

// {
// 	"id": "ae3f5bb6-3f51-4f40-9c7b-4d355c4819e1",
// 	"type": "PICKUP",
// 	"status": "IN_PROGRESS",
// 	"orderSource": "PRO_MARKET",
// 	"client": "Ali Salah",
// 	"photosProducts": [
// 			"tacos.jpg",
// 			"jus.jpg"
// 	],
// 	"title": null,
// 	"description": null,
// 	"quantity": null,
// 	"orderDate": "2025-01-03T22:05:18.436+00:00",
// 	"priceOrder": {
// 			"amount": 250.00,
// 			"currency": "MAD"
// 	},
// 	"oldPrice": {
// 			"amount": 150.00,
// 			"currency": "MAD"
// 	},
// 	"seen": false,
// 	"affected": true
// },

//***!DealPro */

const extractData = (data: any) => {
  console.log('data: ', data)
  try {
    const newData: DealProType = {
      id: data?.dealProId || '',
      title: data?.productResponse?.title || '',
      description: data?.productResponse?.description || '',
      category: data?.category || '',
      type: data?.publishAs || '',
      productImages: [
        '/images/' + data?.productResponse?.productImagePath || '',
      ],
      prixLot: data?.quntity,
      deliveryCost: data?.deliveryFee || 0,
      paymentMethod: data?.modalityPaiement || '',
      consumptionMethods: data?.modalityTypes || '',
      defaultUnity: {
        unity: '',
        x30: data?.defaultPrices[0]?.price?.amount || 0,
        x60: data?.defaultPrices[1]?.price?.amount || 0,
        x120: data?.defaultPrices[2]?.price?.amount || 0,
      },
      customUnity: {
        unity: '',
        global: {
          quantity: data?.customPrices[0]?.quantity || 0,
          price: data?.customPrices[0]?.price?.amount || 0,
        },
        min: {
          quantity: data?.customPrices[1]?.quantity || 0,
          price: data?.customPrices[1]?.price?.amount || 0,
        },
      },
      typeProduct: data?.dealProType == 'PRODUCT' ? 'product' : 'lots',
    }
    console.log('newData', newData)
    return newData
  } catch (error) {
    console.error('Error extracting data:', error)
    return null
  }
}
export const getDealPro = async (id: string): Promise<DealProType | null> => {
  if (id == 'create') {
    return defaultDealPro
  }
  try {
    const res = await api.get(`/deals/dealpro/${id}`)
    if (res.status !== 200) {
      return null
    }
    return extractData(res.data)
  } catch (error) {
    return null
  }
}
