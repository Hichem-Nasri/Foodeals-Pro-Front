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
import { DonateRoutes } from '@/lib/routes'
import {
  BaggageClaim,
  Clock4,
  HandHeart,
  HomeIcon,
  LineChart,
  ShoppingBag,
} from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

const showInThesePathNames = [
  DonateRoutes.home,
  DonateRoutes.donate,
  DonateRoutes.history_donate,
  DonateRoutes.history_recovery,
  DonateRoutes.statistics,
]

export default function DonateMobileBottomTabBar() {
  const pathname = usePathname() || ''
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

  const DonateMobileTabs: TabType[] = [
    {
      href: DonateRoutes.home,
      label: 'Accueil',
      Icon: HomeIcon,
    },
    {
      href: DonateRoutes.donate,
      label: 'Donate',
      Icon: ShoppingBag,
    },
    {
      href: DonateRoutes.history,
      label: 'Historique',
      Icon: Clock4,
      actions() {
        setOpen(true)
      },
      // className: !isLoading && data?.deals?.length > 0 ? 'flex' : '',
    },
    {
      href: DonateRoutes.statistics,
      label: 'Statistiques',
      Icon: LineChart,
    },
  ]
  if (!showInThesePathNames.includes(pathname)) return null
  // console.log('hello: ', data)
  return (
    <>
      <MobileBottomTabBar tabs={DonateMobileTabs} color='blue' />
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className='flex flex-col gap-3 rounded-t-[30px] p-4'>
          <DrawerTitle>Sélectionner votre action</DrawerTitle>
          <DrawerDescription className='flex w-full items-center justify-normal gap-2'>
            <CustomButton
              IconRight={HandHeart}
              variant={'outline'}
              className='w-full border-scooter-500 bg-transparent text-scooter-500 transition-all hover:bg-scooter-500 hover:text-white'
              onClick={() => {
                router.push(DonateRoutes.history_donate)
                setOpen(false)
              }}
              label={'DONATE'}
            />
            <CustomButton
              IconRight={BaggageClaim}
              className='w-full bg-scooter-500 text-white transition-all hover:bg-scooter-100 hover:text-scooter-500'
              onClick={() => {
                router.push(DonateRoutes.history_recovery)
                setOpen(false)
              }}
              label={'Récupération'.toUpperCase()}
            />
          </DrawerDescription>
        </DrawerContent>
      </Drawer>
    </>
  )
}
