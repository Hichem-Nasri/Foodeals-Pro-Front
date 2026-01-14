import DLCProduct from '@/types/DlcProduct'

export function ProductDlcExtract(item: any): DLCProduct {
  const { productResponse, timeRemaining } = item
  const souhaitable = productResponse?.pickupConditions?.find(
    (condition: any) => condition?.conditionName === 'Valorisation souhaitable'
  )
  const bientot = productResponse?.pickupConditions?.find(
    (condition: any) => condition?.conditionName === 'A consommer bientôt'
  )
  const exigee = productResponse?.pickupConditions?.find(
    (condition: any) => condition?.conditionName === 'Valorisation exigée'
  )
  return {
    id: item?.id || '',
    product_id: productResponse?.id || '',
    name: productResponse?.name || '',
    brand: productResponse?.brand || '',
    title: productResponse?.title || '',
    imageUrl:
      'http://localhost:8080/photos/' + (productResponse?.imageUrl || ''),
    quantity: item?.quantity || 0,
    description: productResponse?.description || '',
    creationDate: productResponse?.creationDate || '',
    barCode: productResponse?.barcode || '',
    life_time: item?.timeRemaining || '',
    category: {
      id: productResponse?.category?.id || '',
      name: productResponse?.category?.name || '',
      slug: productResponse?.category?.slug || '',
    },
    price: productResponse?.price,
    subCategory: {
      id: productResponse?.subCategory?.id || '',
      name: productResponse?.subCategory?.name || '',
      slug: productResponse?.subCategory?.slug || '',
    },
    rayon: productResponse?.rayon || '',
    unity: 'Unit',
    dateFraiche: (() => {
      if (souhaitable)
        return new Date(
          new Date().getTime() +
            (souhaitable?.daysBeforePickup || 0) * 24 * 60 * 60 * 1000
        )
          .toDateString()
          .toString()
      return new Date().toDateString()
    })(),
    dateAConsommerBientot: (() => {
      if (bientot)
        return new Date(
          new Date().getTime() +
            (bientot?.daysBeforePickup || 0) * 24 * 60 * 60 * 1000
        )
          .toDateString()
          .toString()
      return new Date().toDateString()
    })(),
    dateEncoreFraiche: (() => {
      if (exigee)
        return new Date(
          new Date().getTime() +
            (exigee?.daysBeforePickup || 0) * 24 * 60 * 60 * 1000
        )
          .toDateString()
          .toString()
      return new Date().toDateString()
    })(),
    prgEncoreFraiche: (exigee?.discountPercentage || '').toString(),
    prgFraiche: (souhaitable?.discountPercentage || '').toString(),
    prgAConsommerBientot: (bientot?.discountPercentage || '').toString(),
    type: (() => {
      if (timeRemaining) {
        const [days, hours] = timeRemaining
          .split('/')
          .map((part: string) => parseInt(part))
        console.log('after split', days, hours)
        if (days >= 21) {
          return 'souhaitable'
        } else if (days >= 11) {
          return 'exigée'
        }
      }
      return 'urgente'
    })(),
  }
}
