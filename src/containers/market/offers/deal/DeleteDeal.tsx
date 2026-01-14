import { CustomButton } from '@/components/custom/CustomButton'
import { DialogClose } from '@/components/ui/dialog'
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
} from '@/components/ui/drawer'
import { useNotification } from '@/context/NotifContext'
import Notif from '@/components/layout/Notif'
import { NotificationType } from '@/types/GlobalType'
import { MarketRoutes } from '@/lib/routes'
import { useRouter } from 'next/navigation'
import { useOffersTranslations, useCommonTranslations } from '@/hooks/useTranslations'

interface DeleteDealProps {
  disable?: boolean
  id: string
}

const DeleteDeal: React.FC<DeleteDealProps> = ({ id, disable = false }) => {
  const { notify } = useNotification()
  const router = useRouter()
  const tOffers = useOffersTranslations()
  const tCommon = useCommonTranslations()

  const { mutate: Delete, isPending } = useMutation({
    mutationKey: ['deal'],
    mutationFn: async (id: string) => {
      const { status } = await api.delete(`/deals/${id}`)
      if (status == 204) return true
      throw new Error('Error deleting deal')
    },
    onSuccess: () => {
      notify(
        NotificationType.SUCCESS, 
        tOffers('messages.deleteSuccess')
      )
      router.push(MarketRoutes.offres)
    },
    onError: (error) => {
      notify(NotificationType.ERROR, error.message)
    },
  })

  return (
    <Drawer>
      <DrawerTrigger
        className='h-12 w-full cursor-pointer gap-2 rounded-[14px] border border-coral-500 bg-coral-50 px-5 py-3 text-base font-medium text-coral-500 transition-all flex-center hover:bg-coral-100 disabled:cursor-default disabled:border-none disabled:bg-lynch-50 disabled:text-lynch-400 lg:w-fit'
        disabled={disable || isPending}
      >
        <span>{tCommon('delete').toUpperCase()}</span>
        <Trash size={20} />
      </DrawerTrigger>
      <DrawerContent className='flex flex-col items-start justify-center gap-3 p-2'>
        <DrawerTitle className=''>{tOffers('messages.deleteConfirmation')}</DrawerTitle>
        <DrawerDescription className='flex w-full flex-col gap-3'>
          <h1>{tOffers('dialogs.delete.description')}</h1>
          <div className='flex w-full gap-2'>
            <CustomButton
              label={tCommon('delete').toUpperCase()}
              IconRight={Trash}
              disabled={isPending}
              className='w-full border border-coral-500 bg-coral-50 text-coral-500 transition-all hover:bg-coral-100'
              onClick={() => {
                Delete(id)
              }}
            />{' '}
            <DialogClose className='w-full'>
              <CustomButton
                label={tCommon('cancel').toUpperCase()}
                disabled={isPending}
                IconRight={ArrowLeft}
                className='w-full'
                onClick={() => {}}
              />{' '}
            </DialogClose>
          </div>
        </DrawerDescription>
      </DrawerContent>
    </Drawer>
  )
}

export default DeleteDeal
