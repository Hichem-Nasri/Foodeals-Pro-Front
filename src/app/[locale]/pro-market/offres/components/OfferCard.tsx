import ShowDateTime from '@/components/tools/ShowDateTime'
import { Separator } from '@/components/ui/separator'
import { CalendarX, Info, Store } from 'lucide-react'
import { FiShoppingBag } from 'react-icons/fi'
import { LuSalad } from 'react-icons/lu'
import Image from 'next/image'
import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import DealBadge, { BadgeType } from '@/components/custom/DealBadge'
import {
  BoxType,
  // OfferRes,
  OfferStatusT,
  OfferT,
} from '@/hooks/pro-market/queries/offrers-queries'
import { DealType } from '@/types/market-pro-type'
import { useOffersTranslations } from '@/hooks/useTranslations'

type OfferCardType = {
  offerType: 'normal' | 'surprise'
  title: string
  description: string
  orderQuantity: number
  totalQuantity: number
  href: string
  status?: OfferStatusT
  dealType?: BadgeType
  creationDate: string
  imageUrl?: string
}

export default function OfferCard({
  offerType,
  title,
  description,
  orderQuantity,
  totalQuantity,
  href,
  status,
  dealType,
  creationDate,
  imageUrl,
}: OfferCardType) {
  const t = useOffersTranslations()
  
  return (
    <Link
      href={href}
      className={cn(
        'col-span-1 flex flex-col gap-4 rounded-[30px] border-2 border-white bg-white p-4',
        {
          'border-coral-500': status === 'UNAVAILABLE',
          'border-amethyst-500': status === 'EXPIRED',
        }
      )}
    >
      <div className='flex gap-3'>
        {offerType === 'normal' && (
          <div className='relative h-[74px] w-[88px] overflow-hidden rounded-[11px]'>
            <Image
              className='absolute object-cover'
              src={imageUrl || ''}
              alt='image tacos'
              fill
            />
          </div>
        )}

        {offerType === 'surprise' && (
          <div className='flex size-[62px] items-center justify-center rounded-full bg-mountain-500 text-white'>
            <Store size={30} />
          </div>
        )}

        {/* title descripton section */}
        <div className='flex flex-1 flex-col gap-[7px] font-medium'>
          <h2 className='text-lg'>{title}</h2>
          <p className='text-sm text-lynch-400'>{description}</p>
          {status && <Status status={status} />}
        </div>
      </div>

      <Separator className='bg-lynch-100' />

      <div className='flex items-center justify-between'>
        <ShowDateTime date={creationDate} className='font-medium' />
        {dealType && <DealBadge badgeVariant={dealType} />}
      </div>

      <Separator className='bg-lynch-100' />

      <div className='flex gap-3'>
        <div className='flex items-center gap-1.5 rounded-[100px] bg-lynch-100 px-3 py-2 text-lynch-700'>
          <FiShoppingBag size={14} />
          <p className='text-[10px] font-bold uppercase'>
            {t('card.order')} :{' '}
            <span className='text-mountain-500'>{orderQuantity}</span>
          </p>
        </div>

        <div className='flex items-center gap-1.5 rounded-[100px] bg-lynch-100 px-3 py-2 text-lynch-700'>
          <LuSalad size={14} />
          <p className='text-[10px] font-bold uppercase'>
            {t('card.items')} :{' '}
            <span className='text-mountain-500'>x{totalQuantity}</span>
          </p>
        </div>
      </div>
    </Link>
  )
}

function Status({ status }: { status: OfferStatusT }) {
  const t = useOffersTranslations()
  
  return (
    <>
      {status === 'UNAVAILABLE' && (
        <div className='flex items-center justify-end gap-2 text-sm font-medium text-coral-500'>
          <Info size={16} />
          <span>{t('card.unavailable')}</span>
        </div>
      )}
      {status === 'EXPIRED' && (
        <div className='flex items-center justify-end gap-2 text-sm font-medium text-amethyst-500'>
          <CalendarX size={16} />
          <span>{t('card.expired')}</span>
        </div>
      )}
    </>
  )
}

export function OfferCardSkelaton() {
  return (
    <div className='flex flex-col gap-4 rounded-[30px] bg-white p-4'>
      <div className='flex gap-3'>
        <Skeleton className='size-[62px] rounded-full bg-lynch-200' />
        <div className='flex flex-1 flex-col gap-[7px] font-medium'>
          <Skeleton className='h-5 w-2/3 bg-lynch-200' />
          <Skeleton className='h-3 w-3/4 bg-lynch-200' />
          <Skeleton className='h-3 w-1/3 bg-lynch-200' />
        </div>
      </div>

      <Separator className='bg-lynch-100' />

      <div className='flex gap-3'>
        <Skeleton className='h-4 w-[100px] bg-lynch-200' />
        <Skeleton className='h-4 w-[100px] bg-lynch-200' />
      </div>

      <Separator className='bg-lynch-100' />

      <div className='flex gap-3'>
        <Skeleton className='w-[120px] gap-1.5 rounded-[100px] bg-lynch-200 px-3 py-3' />
        <Skeleton className='w-[120px] gap-1.5 rounded-[100px] bg-lynch-200 px-3 py-3' />
      </div>
    </div>
  )
}

export const getCardProps = (
  // offer: OfferRes,
  offer: OfferT,
  history = false
): OfferCardType => {
  return {
    title: offer.type === 'deal' ? offer.productName : offer.titleBox,
    description:
      offer.type === 'deal' ? offer.productDescription : offer.descriptionBox,
    orderQuantity: offer.numberOfOrders || 0,
    totalQuantity: offer.numberOfItems || 0,
    creationDate: offer.creationDate,

    offerType:
      offer.type === 'deal' ||
      (offer.type === 'box' && offer.boxType === 'NORMAL_BOX')
        ? 'normal'
        : 'surprise',
    imageUrl: `/images/${
      offer.type === 'deal' ? offer.productPhotoPath : offer.photoBox
    }`,
    status: offer.type === 'deal' ? offer.dealStatus : offer.boxStatus,
    href:
      offer.type === 'deal'
        ? `/pro-market/${history ? 'historique/' : ''}offres/deal/${offer.id}`
        : `/pro-market/${history ? 'historique/' : ''}offres/box-${
            offer.boxType === 'NORMAL_BOX' ? 'normal' : 'surprise'
          }/${offer.id}`,
  }
}
