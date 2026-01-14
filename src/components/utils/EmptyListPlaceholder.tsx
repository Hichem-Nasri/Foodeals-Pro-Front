import Image from 'next/image'
import HeaderLine from './HeaderLine'
import {
  ColorsT,
  getActiveColorClassName,
} from '@/utils/getActiveColorClassName'

export default function EmptyListPlaceholder({
  title,
  description,
  color = 'green',
}: {
  title: string
  description: string
  color?: ColorsT
}) {
  const textColor = getActiveColorClassName(color, 'text')
  return (
    <div className='my-auto h-full gap-3 flex-col-center'>
      <HeaderLine title={title} />
      <Image
        src='/icons/auth-icon-2.svg'
        width={200}
        height={200}
        alt='pas de commandes'
      />
      <p className={`text-center text-lg ${textColor}`}>{description}</p>
    </div>
  )
}
