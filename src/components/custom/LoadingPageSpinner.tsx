import { cn } from '@/lib/utils'
import {
  ColorsT,
  getActiveColorClassName,
} from '@/utils/getActiveColorClassName'
import { LoaderCircle } from 'lucide-react'

export default function LoadingPageSpinner({
  color = 'purple',
}: {
  color?: ColorsT
}) {
  return (
    <div className='h-full flex-center'>
      <LoaderCircle
        className={cn('animate-spin', getActiveColorClassName(color))}
      />
    </div>
  )
}
