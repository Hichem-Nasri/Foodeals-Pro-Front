import { CustomButton } from '@/components/custom/CustomButton'
import { AvatarAndName } from '@/components/tools/AvatarAndName'
import { AvatarAndRole } from '@/components/utils/AvatarAndRole'
import { PartnerSolution } from '@/components/utils/PartnerSolution'
import { DonateRoutes } from '@/lib/routes'
import { PartnerSolutionType } from '@/types/GlobalType'
import { format } from 'date-fns'
import { Clock, Eye } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface RecoveryCardDetailsProps {
  id: string
  title: string
  description: string
  time: string
  solution: PartnerSolutionType
  imageUrl: string
  onClick?: () => void
}

export const RecoveryCardDetails: React.FC<RecoveryCardDetailsProps> = ({
  id,
  title,
  description,
  time,
  solution,
  imageUrl,
  onClick,
}) => {
  return (
    <div className='group-hover: group flex h-full w-full flex-1 items-center justify-between gap-4 rounded-2xl border-scooter-500 bg-white p-3 shadow-black/10 transition-all [&:has(button:hover)]:shadow-sm'>
      {/* Image */}
      <div className='flex flex-col items-start justify-center gap-3 rounded-lg'>
        {/* <AvatarAndName
          avatar={imageUrl}
          subtitle={description}
          name={title}
          className='w-full'
          classNameAvatar='size-[64px] bg-scooter-500'
          classNameName='text-base font-normal line-clamp-2 text-lynch-900 text-pretty'
          classNameSubtitle='text-lynch-400 text-sm line-clamp-2 font-normal text-pretty'
        /> */}
        <div className={cn('flex items-center justify-start gap-3')}>
          <Image
            src={'/images/' + imageUrl}
            alt={title.slice(0, 2) + '...'}
            width={80}
            height={80}
            className={cn(
              'aspect-square rounded-[12px] bg-scooter-700 transition-all group-hover:-rotate-3 group-hover:scale-105 group-hover:shadow',
              {
                'h-16 w-16 rounded-full': true,
              }
            )}
          />
          <div
            className={cn(
              'item-start flex flex-col flex-wrap justify-start gap-2 self-start',
              {
                'self-center': true,
              }
            )}
          >
            <h2
              className={cn(
                'text-wrap text-start text-lg font-medium text-lynch-950',
                {
                  'text-sm': true,
                }
              )}
            >
              {title}
            </h2>
            <p
              className={cn(
                'line-clamp-2 max-w-lg truncate text-wrap text-sm font-medium text-lynch-400'
              )}
            >
              {description} Lorem ipsum dolor sit amet consectetur adipisicing
              elit. Inventore, nisi vel tempora omnis aliquid id. Necessitatibus
              vero inventore maxime dolorum, consequatur esse! Tempora aut
              ratione, optio culpa aliquam magnam minima.
            </p>
          </div>
        </div>
        <div className='flex items-center text-base text-lynch-500'>
          <Clock className='mr-1' size={16} />
          {format(time, 'HH:mm')}
        </div>
      </div>

      {/* Right Actions */}
      <div className='flex flex-col items-end gap-4'>
        <CustomButton
          label=''
          IconLeft={Eye}
          className='group h-11 w-11 rounded-full bg-lynch-300 text-white group-hover:shadow-lg hover:bg-scooter-500 [&>.icon]:m-0'
          onClick={onClick}
        />
        <PartnerSolution
          solution={solution}
          className='self-end justify-self-end'
        />
      </div>
    </div>
  )
}
