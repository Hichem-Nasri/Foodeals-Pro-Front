import { cn } from '@/lib/utils'
import AvatarAndFallBack from './AvatarAndFallback'

interface AvatarAndName {
  name: string
  subtitle?: string
  avatar?: string
  className?: string
  classNameAvatar?: string
  classNameName?: string
  classNameSubtitle?: string
}
export const AvatarAndName = ({
  name,
  subtitle,
  avatar,
  className = '',
  classNameAvatar = '',
  classNameName = '',
  classNameSubtitle = '',
}: AvatarAndName) => {
  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <AvatarAndFallBack
        src={avatar}
        fallback={name}
        className={classNameAvatar}
      />
      <div className='flex flex-col items-start gap-1'>
        <span
          className={cn(
            'text-input line-clamp-1 text-sm text-lynch-950',
            classNameName
          )}
        >
          {name}
        </span>
        {subtitle && (
          <span
            className={cn(
              'text-xs font-medium capitalize text-mountain-500',
              classNameSubtitle
            )}
          >
            {subtitle}
          </span>
        )}
      </div>
    </div>
  )
}
