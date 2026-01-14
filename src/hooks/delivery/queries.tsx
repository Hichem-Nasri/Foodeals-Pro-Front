import {
  Name,
  PriceType,
} from '@/types/GlobalType'
import { createQueryFn } from '@/utils/createQueryFn'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'

export type OrderT = {
  id: string
  productName: string
  price: PriceType
  description: string
  quantity: number
  creationDate: {
    date: string
    time: string
  }
  imageUrl: string
  client: {
    name: Name
    avatarPath?: string
  }
  subEntityResponse?: {
    avatarPath?: string
    name: string
  }
  orderSource:
    | 'DEAL_PRO'
    | 'PRO_MARKET'
    | 'DONATE_CLIENT'
  delivery: string | null
}
export const useGetOrders = () => {
  return useQuery({
    queryKey: ['not-affected-orders'],
    queryFn: createQueryFn<any[]>(
      '/orders/not-affected',
      (data) => data
    ),
    select: (data) => {
      return data.map((order) => {
        const {
          offer,
          client,
          SubEntityResponse,
        } = order
        const { deal } = offer
        const { product } = deal

        return {
          id: order.id,
          productName: product.name,
          price: offer.salePrice,
          description:
            product.description,
          quantity: deal.quantity,
          imageUrl: product.imageUrl,
          creationDate: {
            date: format(
              product.creationDate,
              'dd/MM/yyyy'
            ),
            time: format(
              product.creationDate,
              "HH'h' mm"
            ),
          },
          client: {
            name: client.name,
            avatarPath:
              client.avatarPath,
          },
          subEntityResponse: {
            name: SubEntityResponse.name,
            avatarPath:
              SubEntityResponse.avatarPath,
          },
          orderSource:
            order.orderSource,
          delivery: order.delivery,
        } as OrderT
      })
    },
  })
}

export const useGetOrderById = (
  id: string
) => {
  return useQuery({
    queryKey: ['order-by-id', { id }],
    queryFn: createQueryFn<any>(
      `/orders/${id}`
    ),
    select: (data) => {
      return {
        id: data.id,
      } as OrderT
    },
  })
}
