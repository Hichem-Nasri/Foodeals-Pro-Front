'use client'
import { CustomButton } from '@/components/custom/CustomButton'
import {
  MobileBottomTabBar,
  TabType,
} from '@/components/layout/MobileBottomTabBar'
import {
  DrawerContent,
  Drawer,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer'
import { AppRoutes, DlcRoutes, MarketRoutes } from '@/lib/routes'
import api from '@/utils/api'
import { useQuery } from '@tanstack/react-query'
import {
  Clock4,
  FileBox,
  HomeIcon,
  LineChart,
  ShoppingBag,
  ShoppingBasket,
  ShoppingCart,
  Star,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

const showInThesePathNames = [DlcRoutes.dlc, DlcRoutes.Decision]

export default function DlcMobileBottomTabBar() {
  const pathname = usePathname()! || ''

  const DlcMobileTabs: TabType[] = [
    {
      href: DlcRoutes.dlc,
      label: 'Dlc',
      Icon: HomeIcon,
    },
    {
      href: DlcRoutes.Decision,
      label: 'Decision',
      Icon: ShoppingBasket,
    },
    {
      href: AppRoutes.statistics,
      label: 'Statistiques',
      Icon: LineChart,
    },
  ]
  if (!showInThesePathNames.includes(pathname)) return null
  // console.log('hello: ', data)
  return (
    <>
      <MobileBottomTabBar tabs={DlcMobileTabs} color='yellow' />
    </>
  )
}
