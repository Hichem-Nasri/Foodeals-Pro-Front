import { CustomButton } from '@/components/custom/CustomButton'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Trash, ArrowLeft, X } from 'lucide-react'
import React from 'react'
import { useMutation } from '@tanstack/react-query'
import api from '@/utils/api'
import {
  DrawerTrigger,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
  Drawer,
  DrawerClose,
} from '@/components/ui/drawer'
import { useNotification } from '@/context/NotifContext'
import Notif from '@/components/layout/Notif'
import { NotificationType } from '@/types/GlobalType'
import { DonateRoutes, MarketRoutes } from '@/lib/routes'
import { useRouter } from 'next/navigation'
import { useMediaQuery } from 'react-responsive'
import { useDonateTranslations } from '@/hooks/useTranslations'

interface DeleteDealProps {
  disable?: boolean
  id: string
}

const DeleteDeal: React.FC<DeleteDealProps> = ({ id, disable = false }) => {
  const { notify } = useNotification()
  const router = useRouter()
  const t = useDonateTranslations()
  
  const { mutate: Delete, isPending } = useMutation({
    mutationKey: ['donate', id],
    mutationFn: async (id: string) => {
      const { status } = await api.delete(`/donates/${id}`)
      if (status == 204) return true
      throw new Error(t('messages.donateDeleteError'))
    },
    onSuccess: () => {
      notify(NotificationType.SUCCESS, t('messages.donateDeletedSuccess'))
      router.push(DonateRoutes.donate)
    },
    onError: (error) => {
      notify(NotificationType.ERROR, error.message)
    },
  })
  const isMobile = useMediaQuery({ query: '(max-width: 1024px)' })
  return (
    <>
      {isMobile ? (
        <Drawer>
          <DrawerTrigger
            className='h-12 w-full cursor-pointer gap-2 rounded-[14px] border border-coral-500 bg-coral-50 px-5 py-3 text-base font-medium text-coral-500 transition-all flex-center hover:bg-coral-100 disabled:cursor-default disabled:border-none disabled:bg-lynch-50 disabled:text-lynch-400 lg:w-fit'
            disabled={disable || isPending}
          >
            <span>{t('actions.delete').toUpperCase()}</span>
            <Trash size={20} />
          </DrawerTrigger>
          <DrawerContent className='flex flex-col items-start justify-center gap-3 p-2'>
            <DrawerTitle className=''>{t('form.deleteDonateTitle')}</DrawerTitle>
            <DrawerDescription className='flex w-full flex-col gap-3'>
              <h1>{t('form.deleteDonateDescription')}</h1>
              <div className='flex w-full gap-2'>
                <CustomButton
                  label={t('actions.delete').toUpperCase()}
                  IconRight={Trash}
                  disabled={isPending}
                  isPending={isPending}
                  className='w-full border border-coral-500 bg-coral-50 text-coral-500 transition-all hover:bg-coral-100 disabled:border-lynch-500'
                  onClick={() => {
                    Delete(id)
                  }}
                />{' '}
                <DrawerClose className='w-full'>
                  <CustomButton
                    label={t('form.cancel').toUpperCase()}
                    disabled={isPending}
                    IconRight={ArrowLeft}
                    className='w-full bg-scooter-500 text-white transition-colors hover:bg-scooter-100 hover:text-scooter-500'
                    onClick={() => {}}
                  />{' '}
                </DrawerClose>
              </div>
            </DrawerDescription>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog>
          <DialogTrigger
            className='h-12 w-full cursor-pointer gap-2 rounded-[14px] border border-coral-500 bg-coral-50 px-5 py-3 text-base font-medium text-coral-500 transition-all flex-center hover:bg-coral-100 disabled:cursor-default disabled:border-none disabled:bg-lynch-50 disabled:text-lynch-400 lg:w-fit'
            disabled={disable || isPending}
          >
            <span>{t('actions.delete').toUpperCase()}</span>
            <Trash size={20} />
          </DialogTrigger>
          <DialogContent
            className='w-full rounded-[18px] p-4'
            showContent={false}
          >
            <DialogTitle className='flex w-full items-center justify-between text-lynch-900'>
              <span>{t('form.deleteDonateTitle')}</span>
              <DialogClose className=''>
                <X size={20} />
              </DialogClose>
            </DialogTitle>
            <DialogDescription className='flex w-full flex-col gap-3'>
              <h1>{t('form.deleteDonateDescription')}</h1>
              <div className='flex w-full gap-2'>
                <CustomButton
                  size={'sm'}
                  label={t('actions.delete').toUpperCase()}
                  IconRight={Trash}
                  disabled={isPending}
                  className='w-full border border-coral-500 bg-coral-50 text-coral-500 transition-all hover:bg-coral-100'
                  onClick={() => {
                    Delete(id)
                  }}
                />{' '}
                <DialogClose className='w-full'>
                  <CustomButton
                    size={'sm'}
                    label={t('form.cancel').toUpperCase()}
                    disabled={isPending}
                    IconRight={ArrowLeft}
                    className='w-full bg-scooter-500 text-white transition-colors hover:bg-scooter-100 hover:text-scooter-500'
                    onClick={() => {}}
                  />{' '}
                </DialogClose>
              </div>
            </DialogDescription>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

export default DeleteDeal
