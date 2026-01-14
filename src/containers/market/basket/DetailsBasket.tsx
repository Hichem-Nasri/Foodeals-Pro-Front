import IconAndText from '@/app/[locale]/pro-market/components/IconAndText'
import { Label } from '@/components/custom/Label'
import { Separator } from '@/components/ui/separator'
import { AvatarAndRole } from '@/components/utils/AvatarAndRole'
import {
  Calendar,
  Clock,
  Coins,
  CreditCard,
  Icon,
  MapPin,
  Pin,
  Timer,
  Truck,
} from 'lucide-react'
import React from 'react'
import { useBasketTranslations } from '@/hooks/useTranslations'

interface DetailsBasketProps {
  dateDeal: string
  hourOfDeal: string
  modalityPayment: string
  modalityTypes: string[]
  deliveryAdress: string
}

const DetailsBasket: React.FC<DetailsBasketProps> = ({
  dateDeal,
  hourOfDeal,
  modalityPayment,
  modalityTypes,
  deliveryAdress,
}) => {
  const bt = useBasketTranslations()
  
  return (
    <div className='item-center flex w-full flex-col gap-3 rounded-[30px] bg-white p-4'>
      <div className='grid grid-cols-2 grid-rows-3 gap-2 rounded-[18px] bg-lynch-50 p-3'>
        <Label label={bt('details.date')} />
        <Label label={bt('details.paymentBy')} />
        <IconAndText
          text={new Date(dateDeal).toLocaleDateString()}
          IconLeft={Calendar}
          size={24}
          className='text-sm text-lynch-500'
        />
        <IconAndText
          text={modalityPayment == 'CARD' ? bt('details.cardPayment') : bt('details.cashPayment')}
          size={24}
          className='text-sm text-lynch-500'
          IconLeft={modalityPayment == 'CARD' ? CreditCard : Coins}
        />
        <IconAndText
          text={hourOfDeal?.split(':').slice(0, 2).join('h:')}
          size={24}
          className='text-sm text-lynch-500'
          IconLeft={Timer}
        />
      </div>
      <div className='flex w-full flex-col justify-center gap-3 rounded-[18px] bg-lynch-50 p-3'>
        <AvatarAndRole
          avatar='/icons/foodeals-icon.svg'
          role={bt('details.deliveryService')}
          name={bt('details.foodealsDelivery')}
        />
        <Separator className='h-[0.5px] bg-lynch-200' />
        <h1 className='text-sm font-medium text-lynch-950'>
          {bt('details.consumptionMode')}
        </h1>
        <IconAndText
          text={modalityTypes.includes('DELIVERY') ? bt('details.delivery') : bt('details.onSite')}
          IconLeft={modalityTypes.includes('DELIVERY') ? Truck : MapPin}
          size={24}
          className='text-sm text-lynch-500'
        />
        <h1 className='text-sm font-medium text-lynch-950'>
          {bt('details.deliveryAddress')}
        </h1>
        <IconAndText
          text={deliveryAdress}
          IconLeft={Pin}
          size={24}
          className='text-sm text-lynch-500'
        />
      </div>
    </div>
  )
}

export default DetailsBasket
