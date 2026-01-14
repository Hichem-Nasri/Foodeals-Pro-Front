import { AvatarAndName } from '@/components/tools/AvatarAndName'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import { Button } from '@/components/ui/button'
import { IoBagCheck } from 'react-icons/io5'
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Dialog } from '@radix-ui/react-dialog'
import {
  Banknote,
  Calendar,
  Check,
  CreditCard,
  MapPin,
  MessageCircleMoreIcon,
  PhoneCall,
  QrCode,
  Timer,
  TriangleAlert,
  UserCheck,
} from 'lucide-react'
import Link from 'next/link'
import QrCodeScanner from '@/containers/market/components/QrCodeScanner'
import { useState } from 'react'
import { useDeliveryTranslations } from '@/hooks/useTranslations'

export function CreatedSuccessfullyDialog({
  isOpen = false,
  title = 'Created Successfully',
}: {
  isOpen?: boolean
  title?: string
}) {
  return (
    <Dialog open={isOpen}>
      {/* <DialogTrigger asChild>
                <Button variant='outline'>CreatedSuccessfully</Button>
            </DialogTrigger> */}
      <DialogContent
        className='max-w-[355px] rounded-[30px] p-0 shadow-none sm:rounded-[30px]'
        showContent={false}
      >
        <VisuallyHidden.Root>
          <DialogTitle>{title}</DialogTitle>
        </VisuallyHidden.Root>

        <div className='flex flex-col items-center justify-center gap-4 p-4 pt-6 text-center'>
          <UserCheck className='text-mountain-500' size={80} strokeWidth={1} />
          <DialogDescription className='text-base font-semibold'>
            Le collaborateur a été ajouté avec succès.
          </DialogDescription>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function SuccessDialog({
  isOpen = false,
  content,
  setIsOpen,
}: {
  isOpen?: boolean
  setIsOpen?: (value: boolean) => void
  content: string
}) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        className='max-w-[362px] rounded-[30px] p-0 shadow-none sm:rounded-[30px]'
        showContent={false}
      >
        <VisuallyHidden.Root>
          <DialogTitle>{content}</DialogTitle>
        </VisuallyHidden.Root>
        <div className='flex flex-col items-center justify-center gap-4 p-4 pt-6 text-center'>
          <div className='flex size-[73px] items-center justify-center rounded-full bg-mountain-400'>
            <Check className='text-white' size={40} />
          </div>
          <DialogDescription className='whitespace-pre-wrap text-base font-semibold'>
            {content}
          </DialogDescription>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function OrderActionDialog({
  title = 'Order action Dialog',
  description,
  open,
  setOpen,
  partnerAvatar,
  partnerName,
  address,
  date,
  modalityPayment,
}: {
  title?: string
  description?: string
  open: boolean
  setOpen: (value: boolean) => void
  partnerAvatar: string
  partnerName: string
  address: string
  date: string
  modalityPayment: string
}) {
  const [scan, setScan] = useState(false)
  const t = useDeliveryTranslations()
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className='max-w-[350px] rounded-[30px] p-4 sm:rounded-[30px]'
          showContent={false}
        >
          <VisuallyHidden.Root>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description || title}</DialogDescription>
          </VisuallyHidden.Root>
          <div className='flex flex-col gap-[22px] rounded-xl bg-lynch-50 px-3 py-4 text-lynch-500'>
            <div className='flex flex-col gap-3'>
              <div className='flex items-center justify-between'>
                {/* <AvatarAndName
                                    name='Marjane'
                                    avatar='/images/marjane_logo.png'
                                    subtitle='Supermarche'
                                    classNameAvatar='size-[46px]'
                                    classNameName='font-semibold text-base'
                                /> */}
                <div className='flex flex-col gap-1.5'>
                  <h3 className='text-sm font-medium text-amethyst-500'>
                    {t('dialogs.partner')}
                  </h3>
                  {/* partner or client name  */}
                  <div className='text-base font-semibold text-lynch-950'>
                    {partnerName}
                  </div>
                </div>
                <div className='flex gap-1.5'>
                  <Button
                    asChild
                    className='flex size-[50px] items-center justify-center rounded-full p-0'
                  >
                    <Link href={'#'}>
                      <PhoneCall />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    className='flex size-[50px] items-center justify-center rounded-full bg-amethyst-500 p-0 hover:bg-amethyst-500/80'
                  >
                    <Link href={'#'}>
                      <MessageCircleMoreIcon />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
            <div className='flex text-sm font-medium text-lynch-500'>
              <div className='flex flex-1 flex-col gap-2'>
                <h3 className='text-lynch-950'>{t('dialogs.deliveryAddress')}</h3>
                <div className='flex items-center gap-1.5'>
                  <MapPin />
                  <span>{address}</span>
                </div>
              </div>
            </div>
            <div className='flex text-sm font-medium text-lynch-500'>
              <div className='flex flex-1 flex-col gap-2'>
                <h3 className='text-lynch-950'>{t('dialogs.date')}</h3>
                <div className='flex items-center gap-1.5'>
                  <Calendar />
                  <span>{date}</span>
                </div>
              </div>
              <div className='flex flex-1 flex-col gap-2'>
                <h3 className='text-lynch-950'>{t('dialogs.paymentBy')}</h3>
                <div className='flex items-center gap-1.5'>
                  {modalityPayment == 'CARD' ? <CreditCard /> : <Banknote />}
                  <span>
                    {modalityPayment == 'CARD' ? t('dialogs.creditCard') : t('dialogs.cash')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <div className='flex w-full items-center gap-2.5'>
              <Button
                className='flex h-12 w-full basis-1/2 items-center gap-3 border-2 border-coral-500 px-3 py-[20px] text-sm font-medium uppercase text-coral-500 transition-all hover:bg-coral-500 hover:text-white'
                variant={'destructive'}
              >
                <span>{t('dialogs.problem').toUpperCase()}</span>
                <TriangleAlert />
              </Button>
              <Button
                onClick={() => {
                  setOpen(false)
                  setScan(true)
                }}
                className='flex h-12 w-full basis-1/2 items-center gap-3 border-2 border-amethyst-500 bg-amethyst-500 px-3 py-[20px] text-sm font-medium uppercase transition-all hover:bg-amethyst-100 hover:text-amethyst-500'
              >
                <span>{t('dialogs.scan').toUpperCase()}</span>
                <QrCode />
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <QrCodeScanner
        open={scan}
        setOpen={setScan}
        handleScan={(data) => console.log(data)}
        color='purple'
      />
    </>
  )
}

export function BagSuccessDialog({
  isOpen = false,
  content,
}: {
  isOpen?: boolean
  content: string
}) {
  return (
    <Dialog>
      {/* <Dialog open={isOpen}> */}
      <DialogTrigger asChild>
        <Button variant='outline'>Bag Success dialog</Button>
      </DialogTrigger>
      <DialogContent
        className='max-w-[362px] rounded-[30px] p-0 shadow-none sm:rounded-[30px]'
        showContent={false}
      >
        <VisuallyHidden.Root>
          <DialogTitle>{content}</DialogTitle>
        </VisuallyHidden.Root>
        <div className='flex h-[274px] flex-col items-center justify-center gap-4 p-4 pt-6 text-center'>
          <DialogDescription className='whitespace-pre-wrap text-lg font-semibold text-lynch-900'>
            {content}
          </DialogDescription>
          <IoBagCheck size={110} className='text-mountain-500' />
        </div>
      </DialogContent>
    </Dialog>
  )
}
