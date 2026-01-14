import AvatarAndFallBack from '@/components/tools/AvatarAndFallback'
import { Separator } from '@/components/ui/separator'
import { PartnerSolution } from '@/components/utils/PartnerSolution'
import { DonateRoutes } from '@/lib/routes'
import { cn } from '@/lib/utils'
import { PartnerSolutionType } from '@/types/GlobalType'
import {
  Calendar,
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  Clock4,
  Info,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export interface DonateCardHistoryProps {
  id: string
  title: string
  description: string
  image: string
  hour: string
  date: string
  key: string
  type: 'UNAVAILABLE' | 'EXPIRED' | 'AVAILABLE'
  solution: PartnerSolutionType
}

const DonateCardHistory: React.FC<DonateCardHistoryProps> = ({
  id,
  title,
  description,
  image,
  hour,
  date,
  key,
  type,
  solution,
}) => {
  return (
    <Link
      href={DonateRoutes.history_donate + '/' + id}
      key={key}
      className={cn(
        'hover:shodow-lg flex w-full flex-col gap-2 rounded-[18px] bg-white p-3 transition-all hover:shadow-black/10',
        {
          'border-2 border-coral-500': type == 'UNAVAILABLE',
          'border-2 border-amethyst-500': type == 'EXPIRED',
        }
      )}
    >
      <div className='flex items-center justify-start gap-3'>
        <Image
          src={image}
          alt={title}
          width={80}
          height={80}
          className='aspect-square rounded-full bg-scooter-700'
        />
        <div className='flex flex-col gap-1 self-start'>
          <h2 className='text-lg font-medium text-lynch-950'>{title}</h2>
          <p className='line-clamp-2 text-sm font-medium text-lynch-400'>
            {description}
          </p>
        </div>
      </div>
      <div className='flex items-center justify-between'>
        <div className='flex items-center justify-start gap-3'>
          <div className='flex items-center gap-1'>
            <p className='gap-1 text-sm font-normal text-lynch-500 flex-center'>
              <CalendarDays size={16} className='mr-1 inline-block' />
              {date}
            </p>
            <p className='gap-1 text-sm font-normal text-lynch-500 flex-center'>
              <Clock4 size={16} className='mr-1 inline-block' />
              {hour}
            </p>
          </div>
        </div>
        {type == 'AVAILABLE' && <PartnerSolution solution={solution} />}
        {type == 'EXPIRED' && (
          <div className='flex items-center gap-1 text-sm text-amethyst-500'>
            <CalendarCheck size={16} />
            Expiré
          </div>
        )}
        {type == 'UNAVAILABLE' && (
          <div className='flex items-center gap-1 text-sm text-coral-500'>
            <Info size={16} />
            Indisponible
          </div>
        )}
      </div>
    </Link>
  )
}

export default DonateCardHistory
