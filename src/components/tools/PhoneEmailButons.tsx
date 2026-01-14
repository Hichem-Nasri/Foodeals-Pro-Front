import Link from 'next/link'
import { Button } from '../ui/button'
import { Mail, MessageCircleMore, PhoneCall } from 'lucide-react'
import {
  ColorsT,
  getActiveColorClassName,
} from '@/utils/getActiveColorClassName'

export default function PhoneEmailButtons({
  phone,
  email,
  icon = 'message',
  color = 'green',
}: {
  phone: string
  email: string
  icon: 'message' | 'mail'
  color?: ColorsT
}) {
  const textColor = getActiveColorClassName(color, 'bg')
  return (
    <div className='flex gap-1.5'>
      {phone && (
        <Button
          asChild
          className={`flex size-11 items-center justify-center rounded-full p-0 ${textColor}`}
        >
          <Link href={`tel:${phone}`}>
            <PhoneCall />
          </Link>
        </Button>
      )}

      {email && (
        <Button
          asChild
          className='flex size-11 items-center justify-center rounded-full bg-amethyst-500 p-0 hover:bg-amethyst-500/80'
        >
          <Link href={`mailto:${email}`}>
            {icon === 'message' ? <MessageCircleMore /> : <Mail />}
          </Link>
        </Button>
      )}
    </div>
  )
}
