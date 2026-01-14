import { FC } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface AvatarAndRole {
  avatar?: string
  name: string
  role: string
  className?: string
  classNameAvatar?: string
  classNameName?: string
  classNameRole?: string
}

export const AvatarAndRole: FC<AvatarAndRole> = ({
  avatar,
  name,
  role,
  className,
  classNameAvatar,
  classNameName,
  classNameRole,
}) => {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <Avatar className={classNameAvatar}>
        <AvatarImage src={avatar} />
        <AvatarFallback>
          {name && name.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      {name && (
        <div className='flex flex-col items-start justify-center gap-1'>
          <h1 className={cn('text-input line-clamp-1 text-sm', classNameName)}>
            {name}
          </h1>
          <h3
            className={cn(
              'line-clamp-1 text-xs font-medium text-inherit text-primary',
              classNameRole
            )}
          >
            {role}
          </h3>
        </div>
      )}
    </div>
  )
}
