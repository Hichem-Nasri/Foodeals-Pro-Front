import React from 'react'
import Image from 'next/image'
import {
  Box,
  Pizza,
  QrCode,
  ShoppingBag,
  Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import {
  OrderDealProType,
} from '@/hooks/delivery/queries/orders-queries'
import { MarketRoutes } from '@/lib/routes'
import { AvatarAndName } from '@/components/tools/AvatarAndName'
import ShowDateTime from '@/components/tools/ShowDateTime'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useDealProTranslations } from '@/hooks/useTranslations'

export default function OrderDealCard({
  id,
  client,
  clientProActivity,
  clientProAvatar,
  status,
  orderSource,
  photosProducts,
  quantity,
  title,
  state,
  description,
  barCode,
  orderDate,
  priceOrder,
  handleQrCode,
}: OrderDealProType & {
  state: 'pending' | 'valid' | 'all'
  handleQrCode: () => void
}) {
  const route = useRouter()
  const t = useDealProTranslations()
  const color = {
    bg: 'bg-mountian-400',
    text: 'text-mountain-500',
    hover: 'hover:bg-mountain-400/90',
  }
  return (
    <>
      <div
        onClick={() => {
          route.push(MarketRoutes.dealPro + '/' + id)
        }}
        className='relative flex w-full min-w-72 max-w-lg flex-1 flex-col gap-[10px] rounded-[20px] bg-white p-3 transition-all hover:shadow lg:max-w-full'
      >
        <button
          type='button'
          onClick={() => {
            route.push(MarketRoutes.dealPro + '/' + id)
          }}
          className='absolute z-30 h-full w-full'
        />
        <div className='relative flex items-center overflow-hidden rounded-xl lg:aspect-[33/25]'>
          <button
            type='button'
            onClick={(e) => {
              e.stopPropagation()
              if (state == 'pending') handleQrCode()
            }}
            title={
              state == 'pending'
                ? t('orderCard.viewQrCode')
                : t('orderCard.viewOrderDetails')
            }
            className={`absolute right-2 top-2 z-50 size-[60px] rounded-full text-white shadow-white/80 flex-center hover:scale-[1.01] hover:shadow ${state == 'valid' ? 'bg-lynch-400' : 'border border-white bg-black'}`}
          >
            {state == 'pending' ? (
              <QrCode size={24} />
            ) : (
              <ShoppingBag size={24} />
            )}
          </button>
          <div
            className={cn(
              'grid flex-1 auto-cols-max grid-flow-dense grid-cols-3 gap-3',
              `${photosProducts.length >= 3 ? 'grid-cols-3' : photosProducts.length == 3 ? 'grid-rows-2' : photosProducts.length == 2 ? 'grid-cols-2' : 'grid-cols-1'}`
            )}
          >
            {photosProducts.slice(0, 6).map((item, index) => (
              <div
                key={item}
                className={cn(
                  'relative aspect-[33/25] h-full overflow-hidden rounded-[11px] bg-red-200',
                  `${photosProducts.length == 3 && index === 0 ? 'col-span-2 row-span-2' : ''}`
                )}
              >
                <Image
                  className='absolute object-cover'
                  src={`/images/${item}`}
                  alt={`${title} image`}
                  fill
                  sizes='100%'
                />
                {index === 5 && photosProducts.length > 6 && (
                  <div className='absolute inset-0 flex flex-col items-center justify-center bg-[#EFEEEE] bg-opacity-90 text-sm font-semibold text-mountain-500'>
                    <Box />
                    <span>{t('orderCard.viewMore')}</span>
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
          <AvatarAndName name={client} avatar={clientProAvatar} />
          <div className='gap-2 rounded-full bg-amethyst-100 p-2 px-3 text-sm font-medium text-amethyst-500 flex-center'>
            <Pizza size={16} />
            <span className='font-semibold'>{clientProActivity}</span>
          </div>
        </div>
        <Separator className='block h-[1px] w-full bg-lynch-100' />
        {/*  */}
        <div className='flex items-center justify-between text-lynch-500'>
          <ShowDateTime date={orderDate} />

          {/*  */}
          {/*  */}
          <div className={`flex gap-1 text-lg font-semibold ${color.text}`}>
            <span>{priceOrder.amount}</span>
            <span>{priceOrder.currency}</span>
          </div>
          {/*  */}
          {/*  */}
        </div>
        {/*  */}
        {/* {delivery && <AffecteButton />} */}
      </div>
    </>
  )
}

// <div
//   // href={MarketRoutes.marketDetails.replace(':id', id)}
//   className='flex w-full min-w-72 max-w-lg flex-1 flex-col gap-[10px] rounded-[20px] bg-white p-3 transition-all hover:scale-[1.01] hover:shadow lg:max-w-full'
// >
//   <header className='flex items-center justify-between'>
//     {/* <AvatarName name={name} avatarImgSrc={avatarImgSrc} /> */}
//     <AvatarAndName
//       name={`${capitalize(client)}`}
//       avatar={''}
//       classNameAvatar='size-[46px]'
//       classNameName='max-w-[90px] line-clamp-none'
//     />
//   </header>
//   {/*  */}
//   {/*  */}
//   {orderSource === 'DEAL_PRO' && (
//     <>
//       <div className='relative aspect-[33/25] overflow-hidden rounded-xl bg-blue-300'>
//         <Image
//           src={`/images/${photosProducts[0]}`}
//           alt={`${title} image`}
//           fill
//           className='object-cover'
//         />
//       </div>
//       <div className='flex justify-between text-sm'>
//         <div className='flex flex-col gap-1'>
//           <p className='text-lynch-900'>{title}</p>
//           <p className='text-xs text-lynch-400'>{description}</p>
//         </div>
//         <div className='text-lynch-500'>x{quantity}</div>
//       </div>
//       {/*  */}
//       <Separator className='block h-[1px] w-full bg-lynch-100' />
//       <div className='flex items-center justify-between text-lynch-500'>
//         <AvatarAndName
//           name={organization.name}
//           avatar={organization.avatar}
//         />
//         <div className='rounded-full bg-amethyst-100 p-1 px-2 text-amethyst-500 flex-center'>
//           <Pizza size={16} />
//           <span>{organization.type}</span>
//         </div>
//       </div>
//       <Separator className='block h-[1px] w-full bg-lynch-100' />
//       {/*  */}
//       <div className='flex items-center justify-between text-lynch-500'>
//         <ShowDateTime date={offer.deal?.product.creationDate} />

//         {/*  */}
//         {/*  */}
//         <div className={`flex gap-1 text-lg font-semibold ${color.text}`}>
//           <span>{priceOrder.amount}</span>
//           <span>{priceOrder.currency}</span>
//         </div>
//       </div>
//     </>
//   )}
//   {offer.type === 'BOX' && (
//     <>
//       <div className='relative flex items-center overflow-hidden rounded-xl lg:aspect-[33/25]'>
//         <div className='grid flex-1 grid-cols-3 gap-3'>
//           {offer.box.items.slice(0, 5).map((item) => (
//             <div
//               key={item.product.id}
//               className='relative aspect-[33/25] overflow-hidden rounded-[11px] bg-red-200'
//             >
//               <Image
//                 className='absolute object-cover'
//                 src={`/images/${item.product.imageUrl}`}
//                 alt={`${item.product.name} image`}
//                 fill
//                 sizes='100%'
//               />
//             </div>
//           ))}
//           <div className='flex aspect-[33/25] flex-col items-center justify-center gap-2 rounded-[11px] bg-[#EFEEEE] text-sm font-semibold text-mountain-500'>
//             <Box />
//             <span>Voir plus</span>
//           </div>
//         </div>
//       </div>

//       <div className='flex justify-between text-sm'>
//         <div className='flex flex-col gap-1'>
//           <p className='text-lynch-900'>{offer.box.title}</p>
//           <p className='text-xs text-lynch-400'>
//             {offer.box.description}
//           </p>
//         </div>
//         <div className='text-lynch-500'>x{orderedQuantity}</div>
//       </div>
//       {/*  */}
//       <Separator className='block h-[1px] w-full bg-lynch-100' />
//       {/*  */}

//       <div className='flex items-center justify-between text-lynch-500'>
//         <div className='flex items-center gap-3 text-sm'>
//           <div className='flex items-center gap-1'>
//             <CalendarDays size={16} />
//             <span>
//               {format(
//                 offer.box.items[0]?.product.creationDate,
//                 'dd/MM/yyyy'
//               )}
//             </span>
//           </div>
//           <div className='flex items-center gap-1'>
//             <Clock size={16} />
//             <span>
//               {format(
//                 offer.box.items[0]?.product.creationDate,
//                 "HH'h' mm"
//               )}
//             </span>
//           </div>
//         </div>

//         {/*  */}
//         {/*  */}
//         <div className={`flex gap-1 text-lg font-semibold ${color.text}`}>
//           <span>{offer.salePrice.amount}</span>
//           <span>{offer.salePrice.currency}</span>
//         </div>
//       </div>
//     </>
//   )}
//   {/*  */}
//   {/*  */}
//   {/* {delivery && <AffecteButton />} */}
// </div>
function AffecteButton() {
  return (
    <Button
      className='flex w-full gap-3 bg-amethyst-500 text-sm uppercase hover:bg-amethyst-500/90'
      asChild
    >
      <Link href='#'>
        <p>AFFECTER</p>
        <Users />
      </Link>
    </Button>
  )
}
