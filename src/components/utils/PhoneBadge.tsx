import { FC } from 'react'
import Link from 'next/link'
import { PhoneCall } from 'lucide-react'
import { cn } from '@/lib/utils'

export const PhoneBadge: FC<{ phone: string; className?: string }> = ({
  phone,
  className,
}) => {
  return (
    <>
      <Link
        href={`tel:${phone}`}
        className={cn(
          'hidden w-fit cursor-pointer items-center gap-1 text-nowrap rounded-full border border-lynch-400 px-5 py-[0.625rem] text-sm font-medium text-lynch-400 hover:border-green-400 hover:text-green-500 lg:flex',
          className
        )}
      >
        <PhoneCall size={18} />
        {phone}
      </Link>
      <Link
        href={`tel:${phone}`}
        className={cn(
          'flex size-11 cursor-pointer items-center justify-center text-nowrap rounded-full bg-mountain-400 p-2 text-sm font-medium text-white lg:hidden',
          className
        )}
      >
        <PhoneCall size={24} />
      </Link>
    </>
  )
}
