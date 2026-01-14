import AvatarAndFallBack from '@/components/tools/AvatarAndFallback'
import { Separator } from '@/components/ui/separator'
import { DonateRoutes } from '@/lib/routes'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { CalendarClock } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { useDonateTranslations } from '@/hooks/useTranslations'

interface DonateCardProps {
  id: string
  title: string[]
  description: string
  image: string[]
  quantity: number
  association: string
  associationLogo: string
  date: string
  className?: string
}

const DonateCard: React.FC<DonateCardProps> = ({
  id,
  title,
  description,
  image,
  quantity,
  association,
  associationLogo,
  date,
  className,
}) => {
  const tDonate = useDonateTranslations()
  
  return (
    <div
      className={cn(
        'group flex h-full w-full flex-1 flex-col justify-between gap-2 rounded-[30px] bg-white p-3 transition-all hover:shadow-[0px_4px_10px_5px_#00000011]',
        className
      )}
    >
      <div className={cn('flex items-center justify-start gap-3', {})}>
        {Array.from({ length: Math.min(image.length, 3) }).map((_, index) => (
          <div
            className={cn('flex items-center justify-start gap-3', {
              'flex-col justify-center': image.length > 1,
            })}
          >
            <Image
              src={image[index]}
              alt={title[index]}
              width={80}
              height={80}
              className={cn(
                'aspect-square rounded-[12px] bg-scooter-700 transition-all group-hover:-rotate-3 group-hover:scale-105 group-hover:shadow',
                {
                  'h-16 w-16 rounded-full': image.length > 1,
                }
              )}
            />
            <div
              className={cn(
                'item-start flex flex-col justify-start gap-2 self-start',
                {
                  'self-center': image.length > 1,
                }
              )}
            >
              <h2
                className={cn(
                  'text-wrap text-start text-lg font-medium text-lynch-950',
                  {
                    'text-sm': image.length > 1,
                  }
                )}
              >
                {title[index]}
              </h2>
              <p
                className={cn(
                  'line-clamp-2 text-sm font-medium text-lynch-400',
                  image.length > 1 && 'hidden'
                )}
              >
                {description} Lorem ipsum dolor sit amet consectetur adipisicing
                elit. Inventore, nisi vel tempora omnis aliquid id.
                Necessitatibus vero inventore maxime dolorum, consequatur esse!
                Tempora aut ratione, optio culpa aliquam magnam minima.
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className='flex w-full flex-col gap-3'>
        <Separator className='h-[0.55px] w-full bg-lynch-200' />
        <div className='flex items-center justify-between'>
          <div className='flex items-center justify-start gap-3'>
            <AvatarAndFallBack
              src={associationLogo}
              alt={association}
              className='h-10 w-10 rounded-full'
              fallback={association?.slice(2).toUpperCase() || ''}
            />
            <div className='flex flex-col gap-1'>
              <p className='text-sm font-normal text-lynch-950'>
                {association}
              </p>
              <p className='text-xs font-normal text-lynch-500'>
                <CalendarClock size={16} className='mr-1 inline-block' />
                {format(date, `dd/MM/yyyy '${tDonate('card.date')}' HH:mm`)}
              </p>
            </div>
          </div>
          <p className='self-start text-sm font-medium text-lynch-500'>
            x{quantity}
          </p>
        </div>
      </div>
    </div>
  )
}

export default DonateCard
