'use client'
import { AvatarAndName } from '@/components/tools/AvatarAndName'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { IconType } from '@/types/common-types'
import Link from 'next/link'
import { Fragment } from 'react'

type Buttons = {
  type: 'Button' | 'Link'
  onClick?: () => void
  Icon: IconType
  href?: string
}[]
export default function MobileListRow({
  avatarPath,
  name,
  avatarSubtitle,
  buttons,
  classNameSubtitle = '',
}: {
  avatarPath?: string
  name: string
  avatarSubtitle?: string
  buttons: Buttons
  classNameSubtitle?: string
}) {
  return (
    <div className='flex items-center justify-between gap-2.5 rounded-[20px] bg-white p-3'>
      <AvatarAndName
        avatar={avatarPath}
        name={name}
        subtitle={avatarSubtitle}
        classNameAvatar='size-[46px]'
        classNameSubtitle={classNameSubtitle}
      />
      <div className='flex items-center gap-1.5'>
        {buttons.map((btn, i) => (
          <Fragment key={i}>
            {btn.type === 'Button' && (
              <Button
                onClick={btn.onClick}
                className={cn(
                  'flex size-[44px] items-center justify-center rounded-full p-0',
                  {
                    'bg-mountain-400': i === 0,
                    'bg-amethyst-500 p-0 hover:bg-amethyst-500/80': i === 1,
                    'bg-lynch-300 p-0 hover:bg-lynch-400': i === 2,
                  }
                )}
              >
                <btn.Icon />
              </Button>
            )}

            {btn.type === 'Link' && (
              <Button
                className={cn(
                  'flex size-[44px] items-center justify-center rounded-full p-0',
                  {
                    'bg-mountain-400': i === 0,
                    'bg-amethyst-500 p-0 hover:bg-amethyst-500/80': i === 1,
                    'bg-lynch-300 p-0 hover:bg-lynch-400': i === 2,
                  }
                )}
                asChild
              >
                <Link href={btn.href || '#'}>
                  <btn.Icon />
                </Link>
              </Button>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  )
}
