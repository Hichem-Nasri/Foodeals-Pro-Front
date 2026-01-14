import React, { useEffect } from 'react'
import Image from 'next/image'
import {
  Badge,
  Box,
  CalendarDays,
  Clock,
  Clock2,
  Eye,
  EyeOff,
  Sandwich,
  UserCheck,
  Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

import { format } from 'date-fns'
import { DeliveryRoutes, MarketRoutes } from '@/lib/routes'
import DealBadge from '@/components/custom/DealBadge'
import { AvatarAndName } from '@/components/tools/AvatarAndName'
import ShowDateTime from '@/components/tools/ShowDateTime'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import OldAndNewPrice from '../components/OldAndNewPrice'
import test from 'node:test'
import { OrderDealType } from '@/types/market-pro-type'
import { useMarketTranslations } from '@/hooks/useTranslations'

const testPhotosProducts = [
  'jus.jpg',
  'fromages.jpg',
  'pizza.png',
  'soda.png',
  'sauce-1.png',
  'sauce-2.png',
  'sauce-2.png',
]
export default function OrderCard({
  id,
  type,
  status,
  orderSource,
  client,
  photosProducts,
  title,
  description,
  quantity,
  orderDate,
  priceOrder,
  oldPrice,
  seen,
  affected,
}: OrderDealType) {
  const t = useMarketTranslations()
  
  return (
    <Link
      href={MarketRoutes.marketDetails.replace(':id', id)}
      className='flex w-full min-w-72 max-w-lg flex-col gap-[10px] rounded-[20px] bg-white p-3 transition-all hover:shadow lg:max-w-full'
    >
      <header className='flex items-center justify-between'>
        {/* <AvatarName name={name} avatarImgSrc={avatarImgSrc} /> */}
        <AvatarAndName
          name={`${client}`}
          avatar={client || ''}
          classNameAvatar='size-[46px]'
          classNameName='max-w-[90px] line-clamp-none aspert-[329/247]'
        />
        {orderSource && <DealBadge badgeVariant={orderSource as any} />}
      </header>

      <div className='relative flex items-center overflow-hidden rounded-xl'>
        <div className='absolute bottom-5 left-0.5 z-10 gap-1.5 flex-center'>
          {!seen && (
            <span className='gap-1.5 rounded-full border-[1.5px] border-white bg-coral-500 px-2 py-1 text-xs font-semibold text-white flex-center'>
              <EyeOff size={12} /> {t('dashboard.orderCard.notSeen')}
            </span>
          )}
          <span
            className={cn(
              'w-fit gap-1.5 whitespace-nowrap rounded-full border-[1.5px] border-mountain-500 bg-mountain-50 px-2 py-1 text-xs font-semibold text-mountain-500 flex-center',
              !affected && 'border-coral-500 bg-coral-100 text-coral-500'
            )}
          >
            <UserCheck size={16} />
            {affected ? t('dashboard.orderCard.assigned') : t('dashboard.orderCard.notAssigned')}
          </span>
        </div>
        <div
          className={cn(
            'grid flex-1 auto-cols-max grid-flow-dense grid-cols-3 gap-3',
            `${photosProducts?.length >= 3 ? 'grid-cols-3' : photosProducts?.length == 3 ? 'grid-rows-2' : photosProducts?.length == 2 ? 'grid-cols-2' : 'grid-cols-1'}`
          )}
        >
          {photosProducts?.slice(0, 6).map((item, index) => (
            <div
              key={item}
              className={cn(
                'relative aspect-[33/25] h-fit overflow-hidden rounded-[11px] bg-red-200',
                `${photosProducts?.length == 3 && index === 0 ? 'col-span-2 row-span-2' : ''}`
              )}
            >
              <Image
                className='relative z-0 object-cover'
                src={`/images/${item}`}
                alt={`${title} image`}
                fill
                sizes='100%'
              />
              {index === 5 && photosProducts?.length > 6 && (
                <div className='absolute inset-0 flex flex-col items-center justify-center bg-[#EFEEEE] bg-opacity-90 text-sm font-semibold text-mountain-500'>
                  <Box />
                  <span>{t('dashboard.orderCard.viewMore')}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className='flex justify-between text-sm'>
        <div className='flex flex-col gap-1'>
          <p className='text-lynch-900'>{title!}</p>
          <p className='text-xs text-lynch-400'>{description!}</p>
        </div>
        <div className='text-lynch-500'>x{quantity}</div>
      </div>

      <Separator className='block h-[1px] w-full bg-lynch-100' />

      <div className='flex items-center justify-between text-lynch-500'>
        <div className='flex items-center gap-3 text-sm'>
          <div className='flex items-center gap-1'>
            <CalendarDays size={16} />
            <span>{format(orderDate, 'dd/MM/yyyy')}</span>
          </div>
          <div className='flex items-center gap-1'>
            <Clock size={16} />
            <span>{format(orderDate, "HH'h' mm")}</span>
          </div>
        </div>

        {/*  */}
        {/*  */}
        <OldAndNewPrice
          color='green'
          oldPrice={oldPrice}
          newPrice={priceOrder}
        />
      </div>
      {/*  */}
      {/* {delivery && <AffecteButton />} */}
    </Link>
  )
}

function AffecteButton() {
  const t = useMarketTranslations()
  
  return (
    <Button
      className='flex w-full gap-3 bg-amethyst-500 text-sm uppercase hover:bg-amethyst-500/90'
      asChild
    >
      <Link href='#'>
        <p>{t('dashboard.orderCard.assign')}</p>
        <Users />
      </Link>
    </Button>
  )
}
