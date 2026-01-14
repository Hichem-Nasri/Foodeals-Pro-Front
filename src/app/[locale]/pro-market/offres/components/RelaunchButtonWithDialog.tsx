'use client'
import { Button, ButtonProps } from '@/components/ui/button'
import { CheckCheck, LoaderCircle, Rocket, X } from 'lucide-react'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { forwardRef, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { DialogTitle, DialogTrigger } from '@radix-ui/react-dialog'
import {
  ColorsT,
  getActiveColorClassName,
} from '@/utils/getActiveColorClassName'
import { cn } from '@/lib/utils'
import { useOffersTranslations } from '@/hooks/useTranslations'

export default function RelaunchButtonWithDialog({
  title,
  description,
  actionFn = () => {},
  disabled = false,
  color = 'green',
  className,
}: {
  title?: string
  description?: string
  actionFn?: () => void
  disabled?: boolean
  color?: ColorsT
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const t = useOffersTranslations()
  const colors = getActiveColorClassName(color, 'bg')
  const style = `text-white ${colors}  hover:${colors.replace('bg-', 'text-')} hover:${colors.replace('500', '100')} `
  const isDesktop = useMediaQuery({ minWidth: 1024 })
  
  const dialogTitle = title || t('dialogs.relaunch.title')
  const dialogDescription = description || t('dialogs.relaunch.description')
  
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <RelaunchButton color={color} className={className} />
        </DialogTrigger>
        <DialogContent
          className='flex flex-col gap-5 rounded-[30px] p-4 sm:rounded-[30px]'
          showContent={false}
        >
          <DialogTitle className='flex w-full items-center justify-between text-lg font-semibold text-lynch-900'>
            <span>{dialogTitle}</span>
            <DialogClose>
              <X size={24} />
            </DialogClose>
          </DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
          <DialogFooter className='p-0'>
            <div className='flex w-full items-center gap-2.5'>
              <DialogClose asChild>
                <CancelButton disabled={disabled} className='h-12 w-1/2' />
              </DialogClose>

              <DialogClose asChild>
                <ConfirmButton
                  onClick={actionFn}
                  disabled={disabled}
                  className={`${style} h-12`}
                />
              </DialogClose>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <RelaunchButton color={color} />
      </DrawerTrigger>
      <DrawerContent className='flex flex-col gap-5 rounded-t-[30px] p-4 pt-0 sm:rounded-t-[30px]'>
        <DrawerTitle>{dialogTitle}</DrawerTitle>
        <DrawerDescription>{dialogDescription}</DrawerDescription>
        <DrawerFooter className='p-0'>
          <div className='flex items-center gap-2.5'>
            <DrawerClose asChild>
              <CancelButton disabled={disabled} />
            </DrawerClose>

            <DrawerClose asChild>
              <ConfirmButton
                onClick={actionFn}
                disabled={disabled}
                className={style}
              />
            </DrawerClose>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

const RelaunchButton = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const { color, ...rest } = props
    const t = useOffersTranslations()
    const colorClass = getActiveColorClassName(color as ColorsT, 'bg')
    const classStyle = `${colorClass.replace('bg-', 'text-')} ${colorClass.replace('bg-', 'border-')} hover:${colorClass.replace('bg-', 'border-')} hover:${colorClass.replace('bg-', 'text-').replace('500', '400')} `
    return (
      <Button
        className={cn(
          'flex flex-1 items-center gap-3 border-2 border-mountain-500 bg-white uppercase text-mountain-500 hover:bg-white hover:text-mountain-400',
          classStyle
        )}
        variant={'outline'}
        {...rest}
      >
        <span>{t('actions.relaunch')}</span>
        <Rocket />
      </Button>
    )
  }
)

const CancelButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ disabled, ...props }, ref) => {
    const t = useOffersTranslations()
    return (
      <Button
        type='button'
        className='flex flex-1 items-center gap-3 text-sm font-medium'
        disabled={disabled}
        variant={'outline'}
        {...props}
      >
        <span>{t('dialogs.relaunch.cancel')}</span>
        <X />
      </Button>
    )
  }
)

const ConfirmButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ disabled, onClick, className }) => {
    const t = useOffersTranslations()
    return (
      <Button
        className={cn(
          'flex flex-1 items-center gap-3 text-sm font-medium uppercase',
          className
        )}
        onClick={onClick}
        disabled={disabled}
      >
        {disabled ? (
          <LoaderCircle className='animate-spin' />
        ) : (
          <>
            <span>{t('dialogs.relaunch.confirm')}</span>
            <CheckCheck />
          </>
        )}
      </Button>
    )
  }
)

// function ConfirmButton({
//   actionFn,
//   disabled,
// }: {
//   actionFn: () => void
//   disabled: boolean
// }) {
//   return (
//     <Button
//       className='flex flex-1 items-center gap-3 text-sm font-medium uppercase'
//       onClick={actionFn}
//       disabled={disabled}
//     >
//       {disabled ? (
//         <LoaderCircle className='animate-spin' />
//       ) : (
//         <>
//           <span>CONFIRMER</span>
//           <CheckCheck />
//         </>
//       )}
//     </Button>
//   )
// }
