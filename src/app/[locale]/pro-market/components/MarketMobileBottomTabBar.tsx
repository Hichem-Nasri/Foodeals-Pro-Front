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
import { MarketRoutes } from '@/lib/routes'
import api from '@/utils/api'
import { useQuery } from '@tanstack/react-query'
import {
  Clock4,
  FileBox,
  HomeIcon,
  ShoppingBag,
  ShoppingCart,
  Star,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

export const MarketMobileTabs: TabType[] = [
  {
    href: MarketRoutes.market,
    label: 'Accueil',
    Icon: HomeIcon,
  },
  {
    href: MarketRoutes.offres,
    label: 'Offres',
    Icon: ShoppingBag,
  },
  {
    href: MarketRoutes.dealPro,
    label: 'Deal Pro',
    Icon: FileBox,
  },
  {
    href: MarketRoutes.Panier,
    label: 'Panier',
    Icon: ShoppingCart,
  },
  {
    href: '',
    label: 'Historique',
    Icon: Clock4,
    actions: () => {},
  },
]

const showInThesePathNames = [
  MarketRoutes.market,
  MarketRoutes.offres,
  MarketRoutes.dealPro,
  MarketRoutes.historique_orders,
  MarketRoutes.historique_offers,
]

export default function MarketMobileBottomTabBar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const router = useRouter()

  // const { data, isLoading, error } = useQuery({
  //   queryKey: ['basket'],
  //   queryFn: async () => {
  //     try {
  //       const res = await api.get('/cart').catch((error) => {
  //         throw new Error(error)
  //       })
  //       if (res.status !== 200) {
  //         throw new Error('error')
  //       }
  //       return res.data
  //     } catch (error) {
  //       console.error(error)
  //       return null
  //     }
  //   },
  // })

  const MarketMobileTabs: TabType[] = [
    {
      href: MarketRoutes.market,
      label: 'Accueil',
      Icon: HomeIcon,
    },
    {
      href: MarketRoutes.offres,
      label: 'Offres',
      Icon: ShoppingBag,
    },
    {
      href: MarketRoutes.dealPro,
      label: 'Deal Pro',
      Icon: FileBox,
    },
    {
      href: MarketRoutes.Panier,
      label: 'Panier',
      Icon: ShoppingCart,
      // className: !isLoading && data?.deals?.length > 0 ? 'flex' : '',
    },
    {
      href: MarketRoutes.historique,
      label: 'Historique',
      Icon: Clock4,
      actions: () => setOpen(true),
    },
  ]
  if (!showInThesePathNames.includes(pathname!)) return null
  // console.log('hello: ', data)
  return (
    <>
      <MobileBottomTabBar tabs={MarketMobileTabs} color='green' />
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className='flex flex-col gap-3 rounded-t-[30px] p-4'>
          <DrawerTitle>Sélectionner votre action</DrawerTitle>
          <DrawerDescription className='flex w-full items-center justify-normal gap-2'>
            <CustomButton
              IconRight={Star}
              variant={'secondary'}
              className='w-full bg-transparent'
              onClick={() => {
                router.push(MarketRoutes.historique_offers)
                setOpen(false)
              }}
              label={'OFFER'}
            />
            <CustomButton
              IconRight={ShoppingCart}
              className='w-full'
              onClick={() => {
                router.push(MarketRoutes.historique_orders)
                setOpen(false)
              }}
              label={'COMMANDES'}
            />
          </DrawerDescription>
        </DrawerContent>
      </Drawer>
    </>
  )
}
