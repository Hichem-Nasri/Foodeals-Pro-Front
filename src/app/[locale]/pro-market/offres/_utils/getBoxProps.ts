import { OfferBoxByIdRes } from '@/hooks/pro-market/queries/offrers-queries'
import { BoxNormalFormType } from '../../components/common-form-steps/CommonFormSchema'

export function getBoxProps(data: OfferBoxByIdRes): {
  defaultValues: BoxNormalFormType
  image: string
  currancy: string
} {
  return {
    defaultValues: {
      image: null,
      title: data.title,
      publishAs: data.publishAs,
      categorie: data.category,
      description: data.description,
      unitType: 'Box',
      quantity: data.quantity || 0,
      consumptionMethods: data.modalityTypes,
      deliveryCost: data.deliveryFee,
      initialPrice: data.initialPrice.amount,
      reductionPercentage: data.reduction,
      startDate: new Date(data.openTime[0].date),
      endDate: new Date(data.openTime[1].date),
      startTime: data.openTime[0].from.replace(':', 'h'),
      endTime: data.openTime[1].to.replace(':', 'h'),
      expirationDate: new Date('2023-11-01'),
      paymentMethod: data.modalityPayment,
    },
    image: `/images/${data.photoPath}`,
    currancy: data.initialPrice.currency,
  }
}
