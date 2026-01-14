'use client'
import { AvatarAndName } from '@/components/tools/AvatarAndName'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import {
  Banknote,
  Calendar,
  CheckCheck,
  CreditCard,
  MapPin,
  MapPinned,
  MessageCircleMoreIcon,
  PhoneCall,
  X,
} from 'lucide-react'
import Link from 'next/link'
import RemainingTimeBadge from './RemainingTimeBadge'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import { Fragment, useState } from 'react'
import { useMediaQuery } from 'react-responsive'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { DeliveryManT } from '@/hooks/delivery/queries/delivery-men-queries'
import { useGetDelivOrderById } from '@/hooks/delivery/queries/orders-queries'
import { Skeleton } from '@/components/ui/skeleton'
import { format } from 'date-fns'
import { PaymentMethodEnum } from '@/types/GlobalType'
import { OrderActionDialog } from './Dialogs'
import { useQuery } from '@tanstack/react-query'
import api from '@/utils/api'
import LoadingPageSpinner from '@/components/custom/LoadingPageSpinner'

export function DeliveryManDetailsDrawer({
  orderId,
  title = 'Confirm Delivery man Drawer',
  description,
  selected,
  deliveryMan,
  open,
  setOpen,
  estimation,
  distance = -1,
}: {
  orderId: string
  title?: string
  description?: string
  selected: boolean
  deliveryMan: DeliveryManT | null
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  estimation?: string
  distance?: number
}) {
  const { data, error, isLoading } = useGetDelivOrderById(orderId)
  const [openConfirm, setOpenConfirm] = useState(false)
  const isDesktop = useMediaQuery({ minWidth: 1024 })

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
                name={`${deliveryMan.name.firstName} ${deliveryMan.name.lastName}`}
                avatar={deliveryMan.avatarPath}
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
              <Link href={`tel:${deliveryMan.phone}`}>
                <PhoneCall />
              </Link>
            </Button>
            <Button
              asChild
              className='flex size-[56px] items-center justify-center rounded-full bg-amethyst-500 p-0 hover:bg-amethyst-500/80'
            >
              <Link href={`mailto:${deliveryMan.email}`}>
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
          onClick={() => {
            setOpen(false)
            setOpenConfirm(true)
          }}
          className='flex w-auto flex-1 items-center gap-3 border-2 border-amethyst-500 bg-amethyst-500 px-3 py-[20px] text-sm font-medium uppercase hover:bg-amethyst-500/80'
        >
          <span>CONFIRMER</span>
          <CheckCheck />
        </Button>
      </div>
    )
  }

  if (isDesktop)
    return (
      <>
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
        <OrderActionDialog
          title='Arriver à destination'
          description='Voulez-vous vraiment confirmer que vous êtes arrivé à destination?'
          open={openConfirm}
          setOpen={setOpenConfirm}
          partnerAvatar={deliveryMan?.avatarPath!}
          partnerName={`${deliveryMan?.name.firstName} ${deliveryMan?.name.lastName}`}
          address={data?.deliveryAdress!}
          date={data?.orderDate!}
          modalityPayment={data?.typePayment!}
        />
      </>
    )

  return (
    <>
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
      <OrderActionDialog
        title='Arriver à destination'
        description='Voulez-vous vraiment confirmer que vous êtes arrivé à destination?'
        open={openConfirm}
        setOpen={setOpenConfirm}
        partnerAvatar=''
        partnerName=''
        address=''
        date=''
        modalityPayment=''
      />
    </>
  )
}
export interface ClientOrder {
  idOrder: string
  partnerName: string
  partnerAvatar: string
  deliveryAddress: string
  orderDate: string
  modalityPayment: string
}

type DetailsDrawerT = {
  title?: string
  description?: string
  selected: boolean
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  orderId?: string
}

export function PartnerDetailsDrawer({
  title = 'Confirm Delivery man Drawer',
  description,
  selected,
  type = 'partner',
  open,
  setOpen,
  orderId,
}: DetailsDrawerT & { type?: 'client' | 'partner' }) {
  const isMobile = useMediaQuery({ maxWidth: 1024 })
  const [confirmation, setConfirmation] = useState(false)
  const { data, isLoading, error } = useQuery({
    queryKey: ['delivery', type, orderId],
    queryFn: async () => {
      const url =
        type === 'client'
          ? `/deliveries/showDetailsClientOfOrder/${orderId}`
          : `/deliveries/showDetailsPartnerOfOrder/${orderId}`
      const res = await api.get(url)
      if (res.status === 200) {
        return {
          ...res.data,
          orderDate: format(
            res.data?.orderDate! || new Date().toString(),
            'E, LLLL, d'
          ),
        } as ClientOrder
      }
      return null
    },
  })
  const RenderData = (
    <>
      <VisuallyHidden.Root>
        {isMobile ? (
          <Fragment>
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{description || title}</DrawerDescription>
          </Fragment>
        ) : (
          <Fragment>
            <DialogTitle className='flex w-full justify-between text-xl text-lynch-500'>
              <span>{title}</span>
              <DialogClose>
                <X />
              </DialogClose>
            </DialogTitle>
            <DialogDescription>{description || title}</DialogDescription>
          </Fragment>
        )}
      </VisuallyHidden.Root>
      <div className='flex flex-col gap-[22px] rounded-xl bg-lynch-50 px-3 py-4 text-lynch-500'>
        <div className='rounded-full bg-white p-2.5'>
          <RemainingTimeBadge
            color={type === 'client' ? 'purple' : 'blue'}
            textNextToTime='Reste'
            timeRemaining='20min : 30sec'
            timePassedPercentage={40}
          />
        </div>
        <div className='flex flex-col gap-3'>
          <div className='flex items-center justify-between'>
            <div className='flex flex-col gap-1.5'>
              <h3 className='text-sm font-medium text-amethyst-500'>
                {type === 'client' && 'client'}
                {type === 'partner' && 'partenaire'}
              </h3>
              {/* partner or client name  */}
              <div className='text-base font-semibold text-lynch-950'>
                {data?.partnerName}
              </div>
            </div>
            <div className='flex gap-1.5'>
              <Button
                asChild
                className='flex size-[56px] items-center justify-center rounded-full p-0'
              >
                <Link href={'#'}>
                  <PhoneCall />
                </Link>
              </Button>
              <Button
                asChild
                className='flex size-[56px] items-center justify-center rounded-full bg-amethyst-500 p-0 hover:bg-amethyst-500/80'
              >
                <Link href={'#'}>
                  <MessageCircleMoreIcon />
                </Link>
              </Button>
            </div>
          </div>
        </div>
        {!selected && (
          <div className='flex flex-col gap-2 text-sm font-medium text-lynch-500'>
            <h3 className='text-lynch-950'>Contact du partenaire</h3>
            <p>Amine Yassine</p>
          </div>
        )}

        <div className='flex text-sm font-medium text-lynch-500'>
          <div className='flex flex-1 flex-col gap-2'>
            <h3 className='text-lynch-950'>Adresse de livraison</h3>
            <div className='flex items-center gap-1.5'>
              <MapPin />
              <span>{data?.deliveryAddress}</span>
            </div>
          </div>
        </div>
        <div className='flex text-sm font-medium text-lynch-500'>
          <div className='flex flex-1 flex-col gap-2'>
            <h3 className='text-lynch-950'>Date</h3>
            <div className='flex items-center gap-1.5'>
              <Calendar />
              <span>{data?.orderDate}</span>
            </div>
          </div>
          <div className='flex flex-1 flex-col gap-2'>
            <h3 className='text-lynch-950'>Paiement par</h3>
            <div className='flex items-center gap-1.5'>
              {data?.modalityPayment == 'CARD' ? <CreditCard /> : <Banknote />}
              <span>
                {data?.modalityPayment == 'CARD' ? 'Carte bancaire' : 'Espèces'}
              </span>
            </div>
          </div>
        </div>
      </div>
      {selected && (
        <div className='p-0'>
          <div className='flex items-center gap-2.5'>
            <Button
              onClick={() => {
                setOpen(false)
                setConfirmation(true)
              }}
              className='flex w-auto flex-1 items-center gap-3 border-2 border-amethyst-500 bg-amethyst-500 px-3 py-[20px] text-sm font-medium uppercase transition-all hover:bg-amethyst-100 hover:text-amethyst-500'
            >
              <span>ARRIVER A DESTINATION</span>
              <MapPinned />
            </Button>
          </div>
        </div>
      )}
    </>
  )
  return (
    <>
      {isMobile ? (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent className='flex flex-col gap-5 rounded-t-[30px] p-4 pt-0 sm:rounded-t-[30px]'>
            {isLoading ? (
              <LoadingPageSpinner />
            ) : error ? (
              <h1>Erreur!</h1>
            ) : (
              <>{RenderData}</>
            )}
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent
            className='flex flex-col gap-5 rounded-t-[30px] p-4 pt-0 sm:rounded-t-[30px]'
            showContent={false}
          >
            {isLoading ? (
              <LoadingPageSpinner />
            ) : error ? (
              <h1>Erreur!</h1>
            ) : (
              <>{RenderData}</>
            )}
          </DialogContent>
        </Dialog>
      )}
      <OrderActionDialog
        title='Arriver à destination'
        description='Voulez-vous vraiment confirmer que vous êtes arrivé à destination?'
        open={confirmation}
        setOpen={setConfirmation}
        partnerName={data?.partnerName!}
        partnerAvatar={data?.partnerAvatar!}
        date={data?.orderDate!}
        address={data?.deliveryAddress!}
        modalityPayment={data?.modalityPayment!}
      />
    </>
  )
}

export function ClientDetailsDrawer({
  title = 'Confirm Delivery man Drawer',
  description,
  selected,
}: DetailsDrawerT) {
  return (
    <PartnerDetailsDrawer
      selected={selected}
      description={description}
      title={title}
      type='client'
      open={selected}
      setOpen={() => {}}
    />
  )
}
