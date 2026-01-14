import { Circle, LucideProps } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Fragment } from 'react'
import { usePathname } from 'next/navigation'
import {
  ColorsT,
  getActiveColorClassName,
} from '@/utils/getActiveColorClassName'

export type TabType = {
  href: string
  label: string
  Icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
  >
  actions?: () => void
  className?: string
}

export function MobileBottomTabBar({
  tabs,
  lineSeparated = false,
  color = 'green',
  className = '',
}: {
  tabs: TabType[]
  color?: ColorsT
  lineSeparated?: boolean
  className?: string
}) {
  return (
    <nav
      className={cn(
        'relative z-40 flex w-full items-center justify-around rounded-t-6xl bg-white py-5 shadow-[#434E610F_0px_-5px_15px] lg:hidden',
        className
      )}
    >
      {tabs.map((tab, i, arr) => (
        <Fragment key={tab.href}>
          <MobileTabItem
            href={tab.href}
            Icon={tab.Icon}
            label={tab.label}
            actions={tab.actions}
            className={tab.className}
            color={color}
          />
          {lineSeparated && i !== arr.length - 1 && (
            <span
              key={`separator-${i}`}
              className='pointer-events-none h-6 w-[1.5px] bg-lynch-200'
            />
          )}
        </Fragment>
      ))}
    </nav>
  )
}

type MobileTabItemType = {
  color?: ColorsT
} & TabType &
  React.ComponentProps<typeof Link>

function MobileTabItem({
  href,
  label,
  Icon,
  className,
  actions,
  color = 'green',
}: MobileTabItemType) {
  const pathname = usePathname()

  return (
    <>
      {actions ? (
        <>
          <button
            type='button'
            onClick={actions}
            className={cn(
              'relative flex flex-col items-center justify-center gap-2 text-[13px] text-lynch-400',
              pathname?.includes(href) ? getActiveColorClassName(color) : '',
              className
            )}
          >
            <Icon
              strokeWidth={1}
              className={cn(
                'text-lynch-400',
                pathname?.includes(href) ? getActiveColorClassName(color) : ''
              )}
            />

            {label}
          </button>
        </>
      ) : (
        <Link
          href={href}
          className={cn(
            'relative flex flex-col items-center justify-center gap-2 text-[13px] text-lynch-400',
            pathname === href ? getActiveColorClassName(color) : '',
            className
          )}
        >
          <Icon
            strokeWidth={1}
            className={cn(
              'text-lynch-400',
              pathname === href ? getActiveColorClassName(color) : ''
            )}
          />
          <div
            className={cn(
              'absolute right-0 top-0 hidden size-2 animate-pingCircle rounded-full bg-coral-500',
              className,
              pathname?.includes(href) && 'hidden'
            )}
          />
          {label}
        </Link>
      )}
    </>
  )
}
