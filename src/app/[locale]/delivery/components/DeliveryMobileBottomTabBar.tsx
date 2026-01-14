'use client'
import {
  MobileBottomTabBar,
  TabType,
} from '@/components/layout/MobileBottomTabBar'
import { useUserRole } from '@/context/UserRoleContext'
import { DeliveryRoutes } from '@/lib/routes'
import { Roles } from '@/types/GlobalType'
import { HomeIcon, LineChart, ShoppingBasket, Users } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useDeliveryTranslations } from '@/hooks/useTranslations'

function filterMobileTabs(role?: Roles, t?: any): TabType[] {
  const DeliveryMobileTabs: TabType[] = [
    {
      href: DeliveryRoutes.delivery,
      label: t('navigation.home'),
      Icon: HomeIcon,
    },
    {
      href: DeliveryRoutes.commande,
      label: t('navigation.orders'),
      Icon: ShoppingBasket,
    },
    {
      href: DeliveryRoutes.livreurs,
      label: t('navigation.deliveryMen'),
      Icon: Users,
    },
    {
      href: DeliveryRoutes.statistiques,
      label: t('navigation.statistics'),
      Icon: LineChart,
    },
  ]

  if (role === Roles.DELIVERY_MAN) {
    return DeliveryMobileTabs.filter(
      (item) => item.href !== DeliveryRoutes.livreurs
    )
  }
  return DeliveryMobileTabs
}

const showInThesePathNames = [
  DeliveryRoutes.delivery,
  DeliveryRoutes.commande,
  DeliveryRoutes.livreurs,
  DeliveryRoutes.statistiques,
]

export default function DeliveryMobileBottomTabBar() {
  const pathname = usePathname()
  const { role } = useUserRole()
  const t = useDeliveryTranslations()

  if (!showInThesePathNames.includes(pathname!)) return null
  const mobileTabs = filterMobileTabs(role, t)

  return <MobileBottomTabBar tabs={mobileTabs} color='purple' />
}
