import React from 'react'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import Image from 'next/image'
import {
  Box,
  CalendarDays,
  Clock,
  Clock2,
  Eye,
  MapPin,
  Sandwich,
  Users,
} from 'lucide-react'
import { Separator } from '../ui/separator'
import { cn } from '@/lib/utils'
import { AvatarAndName } from '../tools/AvatarAndName'
import Link from 'next/link'
import DealBadge, { BadgeType } from '../custom/DealBadge'
import {
  OrderDealProType,
  OrderStatus,
  OrderType,
} from '@/hooks/delivery/queries/orders-queries'

import { DeliveryRoutes } from '@/lib/routes'
import ShowDateTime from '../tools/ShowDateTime'
import { PriceType, Roles } from '@/types/GlobalType'
import { OrderSourceT } from '@/types/market-pro-type'
import { Skeleton } from '../ui/skeleton'
import { useUserRole } from '@/context/UserRoleContext'
import RemainingTimeBadge from '@/app/[locale]/delivery/components/RemainingTimeBadge';

type ProductDetailCardProps = {
  id: string
  title: string
  description: string
  status: OrderStatus
  clientName: string
  orderSource: BadgeType
  clientProActivity: string | null
  clientProAvatar: string
  productImages: string[]
  orderedQuantity: number
  price: PriceType
  date: string
  offerCreatorName: string | null
  offerCreatorAvatar: string | null
  seen: boolean
  affected: boolean
}

export default function ProductDetailCard({
  id,
  clientName,
  orderSource,
  orderedQuantity,
  price,
  seen,
  affected,
  clientProActivity,
  clientProAvatar,
  date,
  description,
  offerCreatorAvatar,
  offerCreatorName,
  productImages,
  title,
}: ProductDetailCardProps) {
  const role = useUserRole()
  return (
    <div className='flex min-w-72 max-w-lg flex-1 flex-col gap-[10px] rounded-[20px] bg-white p-3'>
      <OrderCardHeader
        name={clientName}
        avatar={clientProAvatar}
        orderSource={orderSource}
      />
      <OrderCardProductPreview
        id={id}
        title={title}
        productImages={productImages}
        type='deal'
      />
      <OrderCardDetails
        title={title}
        description={description}
        orderedQuantity={orderedQuantity}
        creationDate={date}
        price={price}
      />
      <Separator className='block h-[1px] w-full bg-lynch-100 last:hidden' />
      {/* <OrderCardDeliveryManTime /> //todo: add props to this component */}
      <Separator className='my-1 block h-[1px] w-full bg-lynch-100 last:hidden' />
      <OrderCardOfferCreator
        name={offerCreatorName}
        avatar={offerCreatorAvatar}
        activity={clientProActivity}
      />
      {affected ? <LocalisationButton /> : <AffecteButton orderId={id} />}
    </div>
  )
}

function OrderCardHeader({
  name,
  avatar = '',
  orderSource,
}: {
  name: string
  avatar?: string
  orderSource: OrderSourceT
}) {
  return (
    <header className='flex items-start justify-between'>
      {/* <AvatarName name={name} avatarImgSrc={avatarImgSrc} /> */}
      <AvatarAndName
        name={name}
        avatar={avatar}
        classNameAvatar='size-[46px]'
        classNameName='max-w-[90px] line-clamp-none'
      />
      <DealBadge badgeVariant={orderSource} />
    </header>
  )
}

function OrderCardDetails({
  title,
  description,
  orderedQuantity,
  creationDate,
  price,
}: {
  title: string
  description: string
  orderedQuantity: number
  creationDate: string
  price: PriceType
}) {
  return (
    <>
      <div className='flex justify-between text-sm'>
        <div className='flex flex-col gap-1'>
          <p className='text-lynch-900'>{title}</p>
          <p className='text-xs text-lynch-400'>{description}</p>
        </div>
        <div className='text-lynch-500'>x{orderedQuantity}</div>
      </div>

      <Separator className='block h-[1px] w-full bg-lynch-100 last:hidden' />

      <div className='flex items-center justify-between text-lynch-500'>
        <ShowDateTime date={creationDate} />
        <div className='flex gap-1 text-lg font-semibold text-amethyst-500'>
          <span>{price.amount}</span>
          <span>{price.currency}</span>
        </div>
      </div>
    </>
  )
}

function OrderCardProductPreview({
  type,
  title,
  id,
  productImages,
  children,
}: {
  type: 'box' | 'deal'
  id: string
  productImages: string[]
  title: string
  children?: React.ReactNode
}) {
  if (type === 'deal')
    return (
      <div className='relative aspect-[33/25] overflow-hidden rounded-xl bg-amethyst-100'>
        <Link href={`/delivery/commande/${id}`}>
          <Image
            src={`/images/${productImages[0] || ''}`}
            alt={`${title} image`}
            fill
            className='object-cover'
          />
        </Link>
        {children}
      </div>
    )
  else if (type === 'box')
    return (
      <div className='relative flex items-center overflow-hidden rounded-xl lg:aspect-[33/25]'>
        <div className='relative grid flex-1 grid-cols-3 gap-3'>
          {productImages.slice(0, 5).map((img, i) => (
            <div
              key={i}
              className='relative aspect-[33/25] overflow-hidden rounded-[11px] bg-red-200'
            >
              <Image
                className='absolute object-cover'
                src={`/images/${img || ''}`}
                alt={`${title} image`}
                fill
                sizes='100%'
              />
            </div>
          ))}
          <Link
            href={`${DeliveryRoutes.commande}/${id}`}
            className='flex aspect-[33/25] flex-col items-center justify-center gap-2 rounded-[11px] bg-[#EFEEEE] text-sm font-semibold text-mountain-500'
          >
            <Box />
            <span>Voir plus</span>
          </Link>
          {/* {children} */}
        </div>
      </div>
    )
  else return null
}

function OrderCardOfferCreator({
  name,
  activity,
  avatar = '',
}: {
  name: string | null
  activity: string | null
  avatar?: string | null
}) {
  if (!name || !activity) return null
  return (
    <div className='flex items-center justify-between'>
      <AvatarAndName
        name={name}
        // todo: remove /images/
        avatar={`/images/${avatar}`}
        classNameAvatar='size-[46px]'
        classNameName='text-sm text-lynch-950 text-mountain-500 '
      />
      <Badge className='gap-x-1.5 bg-amethyst-100 px-3 py-2 text-[10px] font-bold uppercase text-amethyst-500 hover:bg-amethyst-100'>
        <Sandwich size={16} strokeWidth={1.5} />
        <span>{activity}</span>
      </Badge>
    </div>
  )
}

function OrderCardDeliveryManTime() {
  return (
    <div className='flex flex-wrap items-center justify-between gap-x-4 gap-y-2'>
      <AvatarAndName
        name='Amine Dari'
        avatar='/images/user-face-placeholder.png'
        classNameAvatar='size-[46px]'
        classNameName='max-w-[156px] text-sm text-lynch-950 text-amethyst-500 font-semibold'
      />
      <RemainingTimeBadge
        color='green'
        textNextToTime='estimation'
        timeRemaining='1h : 20min : 30sec'
        timePassedPercentage={70}
      />
    </div>
  )
}

function AffecteButton({ orderId }: { orderId: string }) {
  const { role } = useUserRole()
  return (
    <Button
      className='mt-auto flex h-14 w-full gap-3 bg-amethyst-500 text-sm uppercase hover:bg-amethyst-500/90 lg:h-12'
      asChild
    >
      {role === Roles.DELIVERY_MAN ? (
        <Link href={`${DeliveryRoutes.commande}/${orderId}`}>
          <p>VOIR DETAIL</p>
          <Eye />
        </Link>
      ) : (
        <Link href={`${DeliveryRoutes.livreurs}?orderId=${orderId}`}>
          <p>AFFECTER</p>
          <Users />
        </Link>
      )}
    </Button>
  )
}

function LocalisationButton() {
  return (
    <Button
      className='mt-auto flex w-full gap-3 border-2 border-amethyst-500 bg-amethyst-50 text-sm font-medium uppercase text-amethyst-500 hover:bg-amethyst-100'
      asChild
    >
      <Link href='#'>
        <p>LOCALISATION</p>
        <MapPin />
      </Link>
    </Button>
  )
}

export function OrdersListLoading() {
  return (
    <>
      {Array.from({ length: 10 }, (_, i) => (
        <OrderCardLoading key={i} />
      ))}
    </>
  )
}
export function OrderCardLoading() {
  return (
    <Skeleton className='flex w-full min-w-72 max-w-lg flex-1 flex-col gap-[10px] place-self-center rounded-[20px] bg-white p-3 transition-all lg:max-w-full'>
      <div className='flex min-w-72 max-w-full flex-1 flex-col gap-[10px] rounded-[20px] bg-white p-3'>
        <header className='flex items-center justify-between'>
          <Skeleton className='h-12 w-12 rounded-full' />
          <Skeleton className='h-6 w-24 rounded' />
        </header>
        <div className='relative aspect-[33/25] overflow-hidden rounded-xl bg-gray-300'>
          <Skeleton className='h-full w-full' />
        </div>
        <div className='flex justify-between text-sm'>
          <div className='flex flex-col gap-1'>
            <Skeleton className='h-4 w-32 rounded' />
            <Skeleton className='h-4 w-24 rounded' />
          </div>
          <Skeleton className='h-4 w-12 rounded' />
        </div>
        <Separator className='block h-[1px] w-full bg-lynch-100' />
        <div className='flex items-center justify-between text-lynch-500'>
          <Skeleton className='h-4 w-20 rounded' />
          <div className='flex gap-1 text-lg font-semibold text-amethyst-500'>
            <Skeleton className='h-4 w-12 rounded' />
            <Skeleton className='h-4 w-8 rounded' />
          </div>
        </div>
      </div>
    </Skeleton>
  )
}

export function getOrderCardProps(
  order: OrderDealProType
): ProductDetailCardProps {
  return {
    id: order.id,
    clientName: order.client,
    orderedQuantity: order.quantity || 0,
    affected: order.affected,
    status: order.status,
    seen: order.seen,
    clientProAvatar: order.clientProAvatar || '',
    clientProActivity: order.clientProActivity,
    price: order.priceOrder,
    orderSource: order.orderSource as OrderSourceT,
    date: order.orderDate,
    description: order.description,
    title: order.title,
    productImages: order.photosProducts,
    offerCreatorAvatar: order.offerCreatorAvatar,
    offerCreatorName: order.offerCreatorName,
  }
}
