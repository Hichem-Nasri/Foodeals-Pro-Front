'use client'
import { Button } from '@/components/ui/button'
import { ArrowLeft, LoaderCircle, Trash2 } from 'lucide-react'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { DialogTitle, DialogTrigger } from '@radix-ui/react-dialog'
import { useOffersTranslations } from '@/hooks/useTranslations'

export default function DeleteDialogDrawer({
  title,
  description,
  children,
  actionFn = () => {},
  disabled = false,
}: {
  title?: string
  description?: string
  children: React.ReactNode
  actionFn?: () => void
  disabled?: boolean
}) {
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery({ minWidth: 1024 })
  const t = useOffersTranslations()
  
  const dialogTitle = title || 'Confirm Delivery man Drawer'
  const dialogDescription = description || dialogTitle

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className='flex flex-col gap-5 rounded-[30px] p-4 sm:rounded-[30px]'>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
          <DialogFooter className='p-0'>
            <div className='flex w-full items-center gap-2.5'>
              <DialogClose asChild>
                <Button
                  className='flex flex-1 items-center gap-3 border-coral-500 bg-coral-50 text-sm font-medium uppercase text-coral-500'
                  variant={'destructive'}
                  onClick={actionFn}
                  disabled={disabled}
                >
                  {disabled ? (
                    <LoaderCircle className='animate-spin' />
                  ) : (
                    <>
                      <span>{t('dialogs.delete.confirm')}</span>
                      <Trash2 strokeWidth={1.5} />
                    </>
                  )}
                </Button>
              </DialogClose>

              <DialogClose asChild>
                <Button
                  type='button'
                  className='flex flex-1 items-center gap-3 text-sm font-medium'
                  disabled={disabled}
                >
                  <span>{t('dialogs.delete.cancel')}</span>
                  <ArrowLeft />
                </Button>
              </DialogClose>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className='flex flex-col gap-5 rounded-t-[30px] p-4 pt-0 sm:rounded-t-[30px]'>
        <DrawerTitle>{dialogTitle}</DrawerTitle>
        <DrawerDescription>{dialogDescription}</DrawerDescription>
        <DrawerFooter className='p-0'>
          <div className='flex items-center gap-2.5'>
            <DrawerClose asChild>
              <Button
                className='flex flex-1 items-center gap-3 border-coral-500 bg-coral-50 text-sm font-medium uppercase text-coral-500'
                variant={'destructive'}
                onClick={actionFn}
                disabled={disabled}
              >
                <span>{t('dialogs.delete.confirm')}</span>
                <Trash2 strokeWidth={1.5} />
              </Button>
            </DrawerClose>

            <DrawerClose asChild>
              <Button
                type='button'
                className='flex flex-1 items-center gap-3 text-sm font-medium'
                disabled={disabled}
              >
                <span>{t('dialogs.delete.cancel')}</span>
                <ArrowLeft />
              </Button>
            </DrawerClose>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
