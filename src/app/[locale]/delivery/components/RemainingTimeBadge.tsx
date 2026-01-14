import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Clock2 } from 'lucide-react'

export default function RemainingTimeBadge({
  color = 'green',
  timeRemaining,
  timePassedPercentage = 0,
  textNextToTime,
}: {
  color?: 'green' | 'blue' | 'purple'
  timeRemaining: string
  timePassedPercentage?: number
  textNextToTime?: string
}) {
  return (
    <Badge
      className={cn(
        'relative w-full min-w-52 flex-1 shrink-0 overflow-hidden border-2 border-mountain-500 bg-mountain-50 p-2 font-extrabold text-mountain-500 hover:bg-mountain-50'
      )}
      title={timeRemaining}
    >
      <div
        className={cn('absolute left-0 top-0 h-full bg-mountain-100')}
        style={{ width: `${timePassedPercentage}%` }}
      />
      <div className='relative z-[1] flex flex-1 items-center justify-center gap-2'>
        <Clock2 className={cn('text-mountain-500')} size={16} />
        <div className='flex items-center gap-1'>
          {textNextToTime && (
            <span className='line-clamp-6 uppercase'>{textNextToTime}</span>
          )}
          <span className='line-clamp-1'>{timeRemaining}</span>
        </div>
      </div>
    </Badge>
  )
}
