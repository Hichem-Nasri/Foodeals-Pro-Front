'use client'
import { SignOut } from '@/actions'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Separator } from '@/components/ui/separator'
import { useUserRole } from '@/context/UserRoleContext'
import { DeliveryRoutes } from '@/lib/routes'
import { cn } from '@/lib/utils'
import { Roles } from '@/types/GlobalType'
import {
  AreaChart,
  CreditCard,
  House,
  LineChart,
  LogOut,
  LucideIcon,
  MessageSquareDot,
  ShoppingBasket,
  UserPen,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { useDeliveryTranslations } from '@/hooks/useTranslations'

interface BaseNavItem {
  icon: LucideIcon
  label: string
}

interface LinkNavItem extends BaseNavItem {
  type: 'link'
  href: string
  action?: () => void
}

interface AccordionNavItem extends BaseNavItem {
  type: 'accordion'
  subItems: LinkNavItem[]
}

type NavItem = LinkNavItem | AccordionNavItem

function filterNavItems(role?: Roles, t?: any): NavItem[] {
  const navItems: NavItem[] = [
    {
      icon: House,
      label: t('navigation.home'),
      type: 'link',
      href: DeliveryRoutes.delivery,
    },
    {
      icon: ShoppingBasket,
      label: t('navigation.orders'),
      type: 'link',
      href: DeliveryRoutes.commande,
    },
    {
      icon: Users,
      label: t('navigation.deliveryMen'),
      type: 'link',
      href: DeliveryRoutes.livreurs,
    },
    {
      icon: LineChart,
      label: t('navigation.statistics'),
      type: 'link',
      href: DeliveryRoutes.statistiques,
    },
    {
      icon: AreaChart,
      label: t('navigation.foodealsManagement'),
      type: 'accordion',
      subItems: [
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
    {
      icon: MessageSquareDot,
      label: t('navigation.support'),
      type: 'link',
      href: '',
    },
    {
      icon: UserPen,
      label: t('navigation.personalInfo'),
      type: 'link',
      href: '',
    },
    {
      icon: LogOut,
      label: t('navigation.logout'),
      type: 'link',
      href: '',
      action: () => {
        // eslint-disable-next-line no-alert
        alert(t('navigation.logout'))
        SignOut()
      },
    },
  ]

  if (role === Roles.DELIVERY_MAN) {
    return navItems.filter(
      (item) => item.label !== t('navigation.foodealsManagement') && item.label !== t('navigation.deliveryMen')
    )
  }
  return navItems
}

const NavItemRenderer: React.FC<{
  item: NavItem
  pathname: string
}> = ({ item, pathname }) => {
  const isActive = (href: string) => pathname === href

  const navItemClassName = (href?: string) =>
    cn(
      'flex items-center gap-3 rounded-[6px] p-4 text-sm text-lynch-400 hover:bg-amethyst-500 hover:text-white',
      {
        'bg-amethyst-500 text-white': href ? isActive(href) : false,
      }
    )

  if (item.type === 'link') {
    return (
      <>
        {item.action ? (
          <button onClick={item.action} className={navItemClassName(item.href)}>
            <item.icon />
            <span>{item.label}</span>
          </button>
        ) : (
          <Link href={item.href} className={navItemClassName(item.href)}>
            <item.icon />
            <span>{item.label}</span>
          </Link>
        )}
      </>
    )
  }

  return (
    <>
      <Separator className='mb-3 bg-lynch-100' />
      <Accordion type='single' collapsible>
        <AccordionItem value='item-1'>
          <AccordionTrigger
            classNameArrow='size-[24px]'
            className='rounded-[6px] p-4 text-sm text-lynch-400 hover:bg-amethyst-500 hover:text-white'
          >
            <div className='flex items-center gap-3 font-normal'>
              <span>
                <item.icon />
              </span>
              <span>{item.label}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <ul>
              {item.subItems.map((subItem) => (
                <li key={subItem.label}>
                  <Link
                    href={subItem.href}
                    className={navItemClassName(subItem.href)}
                  >
                    <subItem.icon />
                    <span>{subItem.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Separator className='mt-3 bg-lynch-100' />
    </>
  )
}

export default function DeliverySidenav() {
  const pathname = usePathname()
  const { role } = useUserRole()
  const t = useDeliveryTranslations()

  const filteredNavItems = filterNavItems(role, t)

  return (
    <aside className='hidden shrink-0 flex-col overflow-auto rounded-[14px] bg-white p-2.5 lg:flex'>
      <nav className='h-full overflow-auto'>
        <ul className='flex flex-col gap-2.5'>
          {filteredNavItems.map((item) => (
            <li key={item.label}>
              <NavItemRenderer item={item} pathname={pathname!} />
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
// DELIVERY_MAN
