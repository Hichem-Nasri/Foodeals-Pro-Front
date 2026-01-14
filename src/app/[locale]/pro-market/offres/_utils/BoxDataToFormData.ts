import api from '@/utils/api'
import { AxiosError } from 'axios'
import {
  BoxNormalFormType,
  BoxSurpriseFormType,
} from '../../components/common-form-steps/CommonFormSchema'

type BoxDataToFormDataProps =
  | {
      type: 'normal'
      data: BoxNormalFormType
    }
  | {
      type: 'surprise'
      data: BoxSurpriseFormType
    }

export function boxDataToFormData({
  type = 'surprise',
  data,
}: BoxDataToFormDataProps): FormData {
  const formData = new FormData()

  const dataToSend = {
    title: data.title,
    description: data.description,
    type: type === 'surprise' ? 'MYSTERY_BOX' : 'NORMAL_BOX',
    price: {
      amount: data.initialPrice,
      currency: 'MAD',
    },
    reduction: data.reductionPercentage,
    quantity: data.quantity,
    openTimes: [
      {
        date: data.startDate.toISOString(),
        from: data.startTime,
        to: null,
      },
      {
        date: data.endDate.toISOString(),
        form: null,
        to: data.endTime,
      },
    ],
    modalityTypes: data.consumptionMethods,
    modalityPaiement: data.paymentMethod,
    deliveryFee: data.deliveryCost,
    publishAs: 'RESTAURANTS_HOTELS_CATERERS', // todo: this should be dynamic
    // category: 'FAST_FOOD', // todo: this should be dynamic
    category: 'DAIRY_PRODUCTS', // todo: this should be dynamic
  }

  const blob = new Blob([JSON.stringify(dataToSend)], {
    type: 'application/json',
  })

  formData.append('box', blob)

  if (type === 'normal') {
    if ((data as BoxNormalFormType)?.image?.[0]) {
      formData.append('photoBox', (data as BoxNormalFormType)?.image?.[0] || '')
    }
  }
  return formData
}

const BOX_TYPES = {
  normal: 'box-normal',
  surprise: 'box-surprise',
} as const

type BoxType = 'normal' | 'surprise'

type BaseBoxProps = {
  formData: FormData
  type: BoxType
}

type PostBoxProps = {
  method: 'POST'
  id?: string
}

type UpdateBoxProps = {
  method: 'PUT'
  id: string
}

type PostUpdateBoxProps = BaseBoxProps & (PostBoxProps | UpdateBoxProps)

export async function postUpdateBoxApiCall({
  formData,
  type,
  method,
  id = '',
}: PostUpdateBoxProps) {
  if (!formData || formData.entries().next().done) {
    throw new Error('FormData cannot be empty')
  }

  const boxType = BOX_TYPES[type]
  let url = `/boxs/${boxType}`

  if (method === 'PUT') {
    if (!id) throw new Error('ID is required for PUT requests')

    url = `/boxs/update/${boxType}/${id}`
  }

  try {
    const response = await api({
      url,
      method,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        `Failed to ${method === 'POST' ? 'create' : 'update'} ${type} box: ${error.message}`
      )
    }
    throw error
  }
}
