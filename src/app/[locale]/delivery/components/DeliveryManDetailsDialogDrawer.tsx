'use client'
import { AvatarAndName } from '@/components/tools/AvatarAndName'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerTitle,
} from '@/components/ui/drawer'
import {
  Banknote,
  Calendar,
  CheckCheck,
  CreditCard,
  LoaderCircle,
  MapPin,
  MessageCircleMoreIcon,
  PhoneCall,
  X,
} from 'lucide-react'
import Link from 'next/link'
import RemainingTimeBadge from './RemainingTimeBadge'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import { useMediaQuery } from 'react-responsive'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog'
import { DeliveryManT } from '@/hooks/delivery/queries/delivery-men-queries'
import { useGetDelivOrderById } from '@/hooks/delivery/queries/orders-queries'
import { Skeleton } from '@/components/ui/skeleton'
import { format } from 'date-fns'
import { PaymentMethodEnum } from '@/types/GlobalType'
import { useMutation } from '@tanstack/react-query'
import api from '@/utils/api'
import { AxiosError } from 'axios'
import { DeliveryMapC, MapPos } from '@/lib/delivery-classes'

export function DeliveryManDetailsDialogDrawer({
  orderId,
  title = 'Confirm Delivery man Drawer',
  description,
  selected,
  deliveryMan,
  open,
  setOpen,
  deliveryPos,
  showSuccessDialog = () => {},
  distance = -1,
  estimation = 'XXmin : XXsec',
}: {
  orderId: string
  title?: string
  description?: string
  selected: boolean
  deliveryMan: DeliveryMapC | null
  open: boolean
  estimation?: string
  distance?: number
  deliveryPos: MapPos
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  showSuccessDialog?: () => void
}) {
  const { data, error, isLoading } = useGetDelivOrderById(orderId)
  const { mutate, isSuccess, isPending } = useConfirmDeliveryMan()

  const isDesktop = useMediaQuery({ minWidth: 1024 })

  const handleClickConfirm = () => {
    if (!data || !deliveryMan) return
    mutate(
      {
        orderId,
        deliveryBoyId: +deliveryMan.id,
        latitude: deliveryPos.latitude,
        longitude: deliveryPos.longitude,
      },
      {
        onSuccess: () => {
          setOpen(false)
          showSuccessDialog()
          // Navigate to map view after assignment
          window.location.href = `/delivery/map/delivery-men?orderId=${orderId}&deliveryManId=${deliveryMan.id}`
        },
      }
    )
  }

  function RenderRemainingTime() {
    return (
      <div className='rounded-full bg-white p-2.5'>
        <RemainingTimeBadge
          color='green'
          textNextToTime='ESTIMATION'
          timeRemaining={estimation || 'XXmin : XXsec'}
          timePassedPercentage={20}
        />
      </div>
    )
  }

  function RenderDeliveryManDetails() {
    if (!deliveryMan) return null
    return (
      <div className='flex flex-col gap-3'>
        <div className='flex items-center justify-between'>
          <div className='flex flex-col gap-1.5'>
            <h3 className='text-sm font-medium text-amethyst-500'>Livreur</h3>
            <div className='text-base font-semibold text-lynch-950'>
              <AvatarAndName
                name={`${deliveryMan.delivery.name.firstName} ${deliveryMan.delivery.name.lastName}`}
                avatar={deliveryMan.delivery.avatar}
                subtitle={`Distance ${distance == -1 ? '??' : (distance / 1000).toFixed(2)}Km`}
                classNameAvatar='size-[46px]'
                classNameName='font-semibold text-base'
                classNameSubtitle='text-amethyst-500'
              />
            </div>
          </div>

          <div className='flex gap-1.5'>
            <Button
              asChild
              className='flex size-[56px] items-center justify-center rounded-full p-0'
            >
              <Link href={`tel:${deliveryMan.delivery.phone}`}>
                <PhoneCall />
              </Link>
            </Button>
            <Button
              asChild
              className='flex size-[56px] items-center justify-center rounded-full bg-amethyst-500 p-0 hover:bg-amethyst-500/80'
            >
              <Link href={`mailto:${deliveryMan.delivery.email}`}>
                <MessageCircleMoreIcon />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  function RenderDeliveryAddress() {
    return (
      <div className='flex text-sm font-medium text-lynch-500'>
        <div className='flex flex-1 flex-col gap-2'>
          <h3 className='text-lynch-950'>Adresse de livraison</h3>
          <div className='flex items-center gap-1.5'>
            {isLoading && <Skeleton className='h-5 w-4/5 bg-lynch-100' />}
            {data && (
              <>
                <MapPin />
                <span>{data.deliveryAdress}</span>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  function RenderDatePyamentMethod() {
    return (
      <div className='flex text-sm font-medium text-lynch-500'>
        <div className='flex flex-1 flex-col gap-2'>
          <h3 className='text-lynch-950'>Date</h3>
          <div className='flex items-center gap-1.5'>
            {isLoading && <Skeleton className='h-5 w-4/5 bg-lynch-100' />}
            {data && (
              <>
                <Calendar />
                <span>{format(data.orderDate, 'eee, MMMM d')}</span>
              </>
            )}
          </div>
        </div>
        <div className='flex flex-1 flex-col gap-2'>
          <h3 className='text-lynch-950'>Paiement par</h3>
          <div className='flex items-center gap-1.5'>
            {isLoading && <Skeleton className='h-5 w-4/5 bg-lynch-100' />}

            {data?.typePayment === PaymentMethodEnum.CARD && (
              <>
                <CreditCard />
                <span>Carte bancaire</span>
              </>
            )}

            {data?.typePayment === PaymentMethodEnum.CASH && (
              <>
                <Banknote />
                <span>Espèces</span>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  function RenderBottomButtons() {
    return (
      <div className='flex w-full items-center gap-2.5'>
        <Button
          className='flex w-auto flex-1 items-center gap-3 border-2 px-3 py-[20px] text-sm font-medium uppercase'
          variant={'destructive'}
          onClick={() => setOpen(false)}
        >
          <span>ANNULER</span>
          <X />
        </Button>
        <Button
          onClick={handleClickConfirm}
          className='flex w-auto flex-1 items-center gap-3 border-2 border-amethyst-500 bg-amethyst-500 px-3 py-[20px] text-sm font-medium uppercase hover:bg-amethyst-500/80'
          disabled={isPending}
        >
          {isPending ? (
            <LoaderCircle className='animate-spin' />
          ) : (
            <>
              <span>CONFIRMER</span>
              <CheckCheck />
            </>
          )}
        </Button>
      </div>
    )
  }

  if (isDesktop)
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showContent={false}
          className='flex flex-col gap-5 p-4 sm:rounded-[30px]'
        >
          <VisuallyHidden.Root>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description || title}</DialogDescription>
          </VisuallyHidden.Root>
          <div className='flex flex-col gap-[22px] rounded-xl bg-lynch-50 px-3 py-4 text-lynch-500'>
            <RenderRemainingTime />
            <RenderDeliveryManDetails />
            <RenderDeliveryAddress />
            <RenderDatePyamentMethod />
          </div>
          {selected && (
            <DialogFooter className='p-0'>
              <RenderBottomButtons />
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    )

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className='flex flex-col gap-5 rounded-t-[30px] p-4 pt-0 sm:rounded-t-[30px]'>
        <VisuallyHidden.Root>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description || title}</DrawerDescription>
        </VisuallyHidden.Root>
        <div className='flex flex-col gap-[22px] rounded-xl bg-lynch-50 px-3 py-4 text-lynch-500'>
          <RenderRemainingTime />
          <RenderDeliveryManDetails />
          <RenderDeliveryAddress />
          <RenderDatePyamentMethod />
        </div>
        {selected && (
          <DrawerFooter className='p-0'>
            <RenderBottomButtons />
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  )
}

export async function confirmDeliveryManApiCall({
  orderId,
  deliveryBoyId,
  latitude,
  longitude,
}: {
  orderId: string
  deliveryBoyId: number
  latitude: number
  longitude: number
}) {
  try {
    const response = await api({
      url: '/deliveries',
      method: 'POST',
      data: {
        deliveryBoyId,
        status: 'ASSIGNED',
        orderId,
        initialPosition: { coordinates: { latitude, longitude } },
      },
    })

    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        `Failed to affect order with id ${orderId} to delivery man with id ${deliveryBoyId}: ${error.message}`
      )
    }
    throw error
  }
}
function useConfirmDeliveryMan() {
  return useMutation({
    mutationFn: confirmDeliveryManApiCall,
    onError: (error) => {
      console.error(`Error Affecting order to delivery man`, error)
    },
  })
}
