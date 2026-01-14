import { postUpdateBoxApiCall } from '@/app/[locale]/pro-market/offres/_utils/BoxDataToFormData'
import { useNotification } from '@/context/NotifContext'
import { MarketRoutes } from '@/lib/routes'
import { NotificationType, PriceType } from '@/types/GlobalType'
import api from '@/utils/api'
import { createQueryFn } from '@/utils/createQueryFn'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'

export type OfferStatusT = 'AVAILABLE' | 'EXPIRED' | 'UNAVAILABLE'

export type DealType = {
  id: string
  productName: string
  productDescription: string
  productPhotoPath: string
  creationDate: string
  numberOfOrders: number
  numberOfItems: number
  dealStatus?: OfferStatusT
  type: 'deal'
}
export type BoxType = {
  id: string
  titleBox: string
  descriptionBox: string
  photoBox: string
  creationDate: string
  numberOfOrders: number
  numberOfItems: number
  boxStatus?: OfferStatusT
  boxType: 'NORMAL_BOX' | 'MYSTERY_BOX'
  type: 'box'
}

export type OfferT = DealType | BoxType
export type OffersResponse = {
  totalPages: number
  content: OfferT[]
}

type FetchOffersProps = {
  pageNum?: number
  pageSize?: number
  isHistory?: boolean
}

export const useGetAllDeals = ({
  pageNum = 0,
  pageSize = 10,
  isHistory = false,
}: FetchOffersProps) => {
  const url = isHistory
    ? `/deals/history?page=${pageNum}&size=${pageSize}`
    : `/deals?pageNum=${pageNum}&pageSize=${pageSize}`

  return useQuery({
    queryKey: ['get-all-deals', { pageNum, pageSize, isHistory }],
    queryFn: createQueryFn<OffersResponse>(url),
  })
}

export const useGetAllBoxNormal = ({
  pageNum = 0,
  pageSize = 10,
  isHistory = false,
}: FetchOffersProps) => {
  const url = isHistory
    ? `/boxs/history/box-normal?page=${pageNum}&size=${pageSize}`
    : `/boxs/all/normal?pageNum=${pageNum}&pageSize=${pageSize}`

  return useQuery({
    queryKey: ['get-all-box-normal', { pageNum, pageSize, isHistory }],
    queryFn: createQueryFn<OffersResponse>(url),
  })
}

export const useGetAllBoxSurprise = ({
  pageNum = 0,
  pageSize = 10,
  isHistory = false,
}: FetchOffersProps) => {
  const url = isHistory
    ? `/boxs/history/box-surprise?page=${pageNum}&size=${pageSize}`
    : `/boxs/all/surprise?pageNum=${pageNum}&pageSize=${pageSize}`

  return useQuery({
    queryKey: ['get-all-box-surprise', { pageNum, pageSize, isHistory }],
    queryFn: createQueryFn<OffersResponse>(url),
  })
}

export function useGetOffersBySelectedTab({
  pageNum,
  pageSize,
  isHistory,
}: FetchOffersProps) {
  const searchParamsTab = useSearchParams()?.get('tab') || 'deals'

  // Determine which query to run based on the selected tab
  const queryMap = {
    deals: useGetAllDeals,
    box_normal: useGetAllBoxNormal,
    box_surprise: useGetAllBoxSurprise,
  }

  // Fallback to the "deals" query if the tab is unknown
  const useQueryFn =
    queryMap[searchParamsTab as keyof typeof queryMap] || useGetAllDeals

  const {
    data: offers = { content: [], totalPages: 0 },
    isLoading,
    error,
    isRefetching,
    refetch,
  } = useQueryFn({ pageNum, pageSize, isHistory })
  console.log('offers: ', offers)
  return {
    isLoading,
    error,
    filteredOffers: offers,
    isRefetching,
    refetch,
  }
}

export type OfferBoxByIdRes = {
  id: string
  photoPath: string
  title: string
  publishAs: string
  category: string
  openTime: { date: Date; from: string; to: string }[]
  description: string
  quantity: number
  modalityTypes: string[]
  modalityPayment: 'CASH' | 'CARD'
  initialPrice: PriceType
  reduction: number
  salePrice: PriceType
  deliveryFee: number
}
export const useGetOfferBoxById = (id: string, type: 'normal' | 'surprise') => {
  return useQuery({
    queryKey: ['offer-box-by-id', { id }],
    queryFn: createQueryFn<OfferBoxByIdRes>(`/boxs/box-${type}/${id}`),
  })
}

export function usePostUpdateBox(type: 'normal' | 'surprise' = 'surprise') {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: postUpdateBoxApiCall,
    onSuccess: (data) => {
      queryClient.invalidateQueries({})

      setTimeout(() => {
        router.push(`${MarketRoutes.offres}/box-${type}/${data.id}`)
      }, 1000)
    },
    onError: (error) => {
      console.error(`Error posting box ${type}`, error)
    },
  })
}

async function deleteBoxById(id: string) {
  const response = await api.delete(`/boxs/${id}`)

  return response.data
}

export const useDeleteBox = (type: 'normal' | 'surprise') => {
  const { notify } = useNotification()
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: deleteBoxById,
    onSuccess: () => {
      const redirectUrl = `${MarketRoutes.offres}?tab=${type === 'surprise' ? 'box_surprise' : 'box_normal'}`

      queryClient.invalidateQueries()

      notify(NotificationType.SUCCESS, 'Box supprimée avec succès')
      setTimeout(() => {
        router.push(redirectUrl)
      }, 1000)
    },
    onError: (error) => {
      console.error('Failed to delete the box:', error)
      notify(NotificationType.ERROR, "Quelque chose s'est mal passé")
    },
  })
}

async function relaunchBoxById(id: string) {
  const response = await api.put(`/boxs/relaunch/${id}`)

  return response.data
}
export function useRelaunchBox(type: 'normal' | 'surprise') {
  const { notify } = useNotification()
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: relaunchBoxById,
    onSuccess: () => {
      const redirectUrl = `${MarketRoutes.offres}?tab=${type === 'surprise' ? 'box_surprise' : 'box_normal'}`

      queryClient.invalidateQueries()

      setTimeout(() => {
        router.push(redirectUrl)
      }, 1000)
    },
    onError: (error) => {
      console.error('Failed to relaunch the box:', error)
      notify(NotificationType.ERROR, "Quelque chose s'est mal passé")
    },
  })
}

type RelaunchEditHistoryRes = {
  organizationNameRelaunch: string | null
  relaunchDate: Date | string | null
  organizationNameModifiy: string | null
  modifiyDate: Date | string | null
}
export function useGetRelaunchEditHistory(id: string) {
  return useQuery({
    queryKey: ['relaunch-edit-box-history', { id }],
    queryFn: createQueryFn<RelaunchEditHistoryRes>(
      `/boxs/relaunch-modifiy-history/${id}`
    ),
  })
}
