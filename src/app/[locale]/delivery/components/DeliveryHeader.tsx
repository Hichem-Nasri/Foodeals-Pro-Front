'use client'
import { DeliveryRoutes } from '@/lib/routes'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import React, { useMemo, useState } from 'react'
import deliveryLogoSrc from '@/../public/images/logo-delivery.svg'
import {
  AreaChart,
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  House,
  LogOut,
  LucideIcon,
  MessageSquareDot,
  UserPen,
  Users,
} from 'lucide-react'
import { SearchInput } from '@/components/layout/SearchInput'
import { AvatarAndName } from '@/components/tools/AvatarAndName'
import { UserMenu } from '@/components/layout/UserMenu'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import Notifications from '@/components/layout/Notifications'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useMediaQuery } from 'react-responsive'
import { cn } from '@/lib/utils'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import DealBadge from '@/components/custom/DealBadge'
import Link from 'next/link'
import { Name, roleFrenchName, Roles } from '@/types/GlobalType'
import AvatarAndFallBack from '@/components/tools/AvatarAndFallback'
import { signOut } from '@/auth'
import { useDeliveryTranslations } from '@/hooks/useTranslations'

const showInThesePathNames = [
  // DeliveryRoutes.delivery,
  DeliveryRoutes.commande,
  DeliveryRoutes.livreurs,
  DeliveryRoutes.statistiques,
  DeliveryRoutes.collaborator,
]

export function DeliveryHeaderMobile({ user }: DeliveryHeaderProps) {
  const pathname = usePathname()

  // Check if pathname starts with any of the allowed paths (to handle query parameters)
  const shouldShow = showInThesePathNames.some(path => pathname?.startsWith(path))
  
  if (!shouldShow) return null
  return (
    <div className='z-30 flex flex-col rounded-b-[30px] bg-white pb-2 lg:hidden bg-black'>
      <div className='flex h-fit w-full items-center justify-between gap-4 px-4 py-2'>
        <div className='flex items-center gap-6'>
          <Image 
            src={deliveryLogoSrc} 
            alt='Foodeals delivery Logo'
            width={192}
            height={64}
            className='mr-auto h-16 w-fit cursor-pointer overflow-hidden object-contain'
          />
        </div>
        <div className='flex items-center justify-end gap-3'>
          <Notifications notificationData={[]} />
          <MobileSideNavSheet role={user.role}>
            <AvatarAndFallBack
              src={user.avatarPath}
              fallback={user.name}
              className='size-[42px]'
            />
          </MobileSideNavSheet>
        </div>
      </div>
      <div className='inline-flex w-full px-4'>
        <SearchInput
          onChange={(data) => {
            console.log(data)
          }}
        />
      </div>
    </div>
  )
}

export function DeliveryHeaderDesktop({ user }: DeliveryHeaderProps) {
  const t = useDeliveryTranslations()
  
  return (
    <div className='z-30 hidden w-full flex-col rounded-b-[30px] bg-white pb-2 lg:flex'>
      <div className='flex h-fit w-full items-center justify-between gap-4 px-4 py-2 lg:gap-11'>
        <div className='flex items-center gap-6'>
          <Image 
            src={deliveryLogoSrc} 
            alt='Foodeals delivery Logo'
            width={192}
            height={64}
            className='mr-auto h-16 w-fit cursor-pointer overflow-hidden object-contain lg:mr-0'
          />
          <div className='mr-auto hidden lg:inline-flex'>
            <SearchInput
              onChange={(data) => {
                console.log(data)
              }}
            />
          </div>
        </div>
        <div className='hidden items-center justify-end gap-3 lg:flex'>
          <LanguageSwitcher />
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className='flex items-center gap-3'>
                <AvatarAndName
                  name={user.name}
                  subtitle={roleFrenchName[user.role]}
                  avatar={user.avatarPath}
                  className=''
                  classNameName='text-amethyst-500 text-base'
                  classNameSubtitle='font-semibold text-lynch-950  text-xs'
                  classNameAvatar='size-[42px]'
                />
                <ChevronDown className='text-lynch-300' />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-52'>
              <DropdownMenuLabel>{t('header.myAccount')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>{t('header.profile')}</DropdownMenuItem>
              <DropdownMenuItem>{t('header.billing')}</DropdownMenuItem>
              <DropdownMenuItem>{t('header.team')}</DropdownMenuItem>
              <DropdownMenuItem>{t('header.subscription')}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}

type DeliveryHeaderProps = {
  user: {
    id: string
    name: string
    email: string
    avatarPath: string
    role: Roles
  }
}
export default function DeliveryHeader({ user }: DeliveryHeaderProps) {
  return (
    <>
      <DeliveryHeaderMobile user={user} />
      <DeliveryHeaderDesktop user={user} />
    </>
  )
}

type BaseNavItem = {
  icon: LucideIcon
  label: string
  variant?: 'default' | 'danger'
}

type NavTabsType = 'default' | 'gestion'

type NavItem = BaseNavItem &
  (
    | { type: 'link'; href: string; action?: () => void }
    | { type: 'button'; selectTab: NavTabsType }
  )

type NavListItemstype = Record<
  NavTabsType,
  {
    title: string
    items: NavItem[]
  }
>

export function MobileSideNavSheet({
  role,
  children,
}: {
  role: Roles
  children: React.ReactNode
}) {
  const [tab, setTab] = useState<NavTabsType>('default')
  const [isOpen, setIsOpen] = useState(false)
  const isMobile = useMediaQuery({
    query: '(max-width: 1024px)',
  })
  const t = useDeliveryTranslations()

  const myProfileNavItems: NavItem[] = [
    {
      icon: House,
      label: t('navigation.home'),
      type: 'link',
      href: DeliveryRoutes.delivery,
    },
    {
      icon: AreaChart,
      label: t('navigation.foodealsManagement'),
      type: 'button',
      selectTab: 'gestion',
    },
    {
      icon: MessageSquareDot,
      label: t('navigation.support'),
      type: 'link',
      href: DeliveryRoutes.delivery,
    },
    {
      icon: UserPen,
      label: t('navigation.personalInfo'),
      type: 'link',
      href: DeliveryRoutes.delivery,
    },
    {
      icon: LogOut,
      label: t('navigation.logout'),
      type: 'link',
      href: DeliveryRoutes.delivery,
      variant: 'danger',
      action: () => {
        alert('logout')
        signOut()
      },
    },
  ]

  const navListItems: NavListItemstype = {
    default: {
      title: t('navigation.myProfile'),
      items: myProfileNavItems,
    },
    gestion: {
      title: t('navigation.foodealsManagement'),
      items: [
        {
          icon: CreditCard,
          label: t('navigation.payments'),
          type: 'link',
          href: '',
        },
        {
          icon: Users,
          label: t('navigation.collaborators'),
          type: 'link',
          href: DeliveryRoutes.collaborator,
        },
      ],
    },
  }

  const deliveryManNavItems: NavListItemstype = {
    default: {
      title: t('navigation.myProfile'),
      items: myProfileNavItems.filter(
        (item) => item.label !== t('navigation.foodealsManagement')
      ),
    },
    gestion: {
      title: t('navigation.foodealsManagement'),
      items: [],
    },
  }

  const navItems = useMemo(
    () => (role === Roles.DELIVERY_MAN ? deliveryManNavItems : navListItems),
    [role, t]
  )

  return (
    <Sheet open={isOpen && isMobile} onOpenChange={setIsOpen}>
      <SheetTrigger onClick={() => setIsOpen(true)}>{children}</SheetTrigger>
      <SheetContent
        className='flex w-full flex-col gap-0 p-0 sm:max-w-full'
        classNameOverlay='bg-transparent'
        classNameTopChevron='hidden'
      >
        <SheetHeader className='flex flex-row items-center justify-between border-b-2 border-lynch-100 p-4'>
          {tab === 'default' && (
            <SheetClose
              className={cn(
                'icon-sheet rounded-sm opacity-70 ring-offset-white transition-opacity data-[state=open]:bg-neutral-100 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 disabled:pointer-events-none dark:ring-offset-neutral-950 dark:data-[state=open]:bg-neutral-800 dark:focus:ring-neutral-300'
              )}
            >
              <ChevronLeft className='text-lynch-300' />
              <span className='sr-only'>Close</span>
            </SheetClose>
          )}
          {tab !== 'default' && (
            <button
              className={cn(
                'icon-sheet rounded-sm opacity-70 ring-offset-white transition-opacity data-[state=open]:bg-neutral-100 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 disabled:pointer-events-none dark:ring-offset-neutral-950 dark:data-[state=open]:bg-neutral-800 dark:focus:ring-neutral-300'
              )}
              onClick={() => setTab('default')}
            >
              <ChevronLeft className='text-lynch-300' />
              <span className='sr-only'>go back to the previous nav tab</span>
            </button>
          )}

          <SheetTitle className='text-base font-medium'>
            {navItems[tab].title}
          </SheetTitle>
          <VisuallyHidden>
            <SheetDescription>Side navgation</SheetDescription>
          </VisuallyHidden>
        </SheetHeader>
        <div className='mt-16 flex flex-col gap-[50px] p-4'>
          <div className='flex flex-col gap-3'>
            <h2 className='text-[22px] font-medium'>{t('navigation.mySolutions')}</h2>
            <div className='flex items-center gap-4 py-2.5'>
              <DealBadge badgeVariant='PRO_MARKET' />
              <DealBadge
                badgeVariant='DONATE_CLIENT'
                text='pro donate'
                className='text-scooter-500'
              />
            </div>
          </div>
          <div className='flex flex-col gap-3'>
            <h2 className='text-[22px] font-medium'>{t('navigation.generalMenu')}</h2>
            <nav>
              <ul className='flex flex-col gap-2.5'>
                {navItems[tab]?.items.map((item) => (
                  <li key={item.label}>
                    {item.type === 'link' && (
                      <>
                        <Link
                          href={item.href}
                          className='flex items-center gap-3 py-3 hover:bg-lynch-50'
                          onClick={() => {
                            setIsOpen(false)
                            item.action && item.action()
                          }}
                        >
                          <span
                            className={cn(
                              'flex size-[44px] items-center justify-center rounded-full bg-amethyst-500 p-2.5 text-white',
                              {
                                'bg-coral-500': item.variant === 'danger',
                              }
                            )}
                          >
                            <item.icon />
                          </span>
                          {item.label}
                          <ChevronRight className='ml-auto text-lynch-400' />
                        </Link>
                      </>
                    )}
                    {item.type === 'button' && (
                      <button
                        className='flex w-full items-center gap-3 px-0 py-3 hover:bg-lynch-50'
                        onClick={() => setTab(item.selectTab)}
                      >
                        <span className='flex size-[44px] items-center justify-center rounded-full bg-amethyst-500 p-2.5 text-white'>
                          <item.icon />
                        </span>
                        {item.label}
                        <ChevronRight className='ml-auto text-lynch-400' />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
