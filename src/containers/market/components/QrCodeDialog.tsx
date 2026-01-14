'use client'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import React from 'react'
import { useQRCode } from 'next-qrcode'
import HeaderLine from '@/components/utils/HeaderLine'
import { Separator } from '@radix-ui/react-select'
import { CustomButton } from '@/components/custom/CustomButton'
import MobileHeader from '@/components/custom/MobileHeader'
import { X } from 'lucide-react'
import { useMarketTranslations } from '@/hooks/useTranslations'

interface QrCodeDialogProps {
  open: boolean
  onChangeOpen: React.Dispatch<React.SetStateAction<boolean>>
  code: string
  children?: React.ReactNode
  className?: string
}

const QrCodeDialog: React.FC<QrCodeDialogProps> = ({
  onChangeOpen,
  open,
  code,
  children,
  className,
}) => {
  const { Image } = useQRCode()
  const t = useMarketTranslations()
  
  if (!code) return null
  return (
    <Dialog open={open} onOpenChange={onChangeOpen}>
      {children && (
        <DialogTrigger asChild className={className}>
          {children}
        </DialogTrigger>
      )}
      <DialogContent
        className='top-0 flex h-screen min-h-full min-w-full translate-y-[0%] flex-col justify-start gap-0 overflow-auto rounded-none bg-white px-0 py-0 lg:top-1/2 lg:h-auto lg:min-h-fit lg:min-w-[700px] lg:-translate-y-[50%] lg:gap-4 lg:rounded-[14px] lg:p-4'
        showContent={false}
      >
        <DialogTitle>
          <h1 className='hidden items-center justify-between text-xl font-medium text-lynch-950 lg:flex'>
            {t('components.qrCodeDialog.title')}
            <X
              size={24}
              className='cursor-pointer text-lynch-400'
              onClick={() => onChangeOpen(false)}
            />
          </h1>
          <MobileHeader
            title={t('components.qrCodeDialog.title')}
            buttonType='dialog'
            onClick={() => {}}
          />
        </DialogTitle>
        <DialogDescription className='flex h-screen w-full flex-col gap-3 p-3 lg:h-fit'>
          <HeaderLine title={t('components.qrCodeDialog.qrCodeTitle')} />
          <div className='flex flex-col items-center justify-center gap-3 rounded-[14px] bg-white p-3'>
            <div className='max-w-[400px]'>
              <Image
                text={code}
                options={{
                  margin: 4,
                  scale: 2,
                  width: 300,
                  color: {
                    dark: '#23272e',
                    light: '#fff',
                  },
                }}
              />
            </div>
          </div>
          <div className='flex w-full flex-col items-center justify-normal gap-3 rounded-[14px] bg-primary p-3 text-white'>
            <h1 className='text-4xl font-semibold'>{code}</h1>
            <Separator className='block h-[1px] w-full bg-lynch-100 lg:max-w-md' />
            <p className='text-balance text-center text-lg font-medium'>
              {t('components.qrCodeDialog.description')}
            </p>
          </div>
        </DialogDescription>
        <DialogClose className='sticky bottom-0 left-0 flex w-full items-center justify-end rounded-t-[14px] bg-white p-3 focus:outline-none lg:relative lg:rounded-[14px]'>
          <CustomButton
            label={t('components.qrCodeDialog.close')}
            variant='outline'
            onClick={() => {}}
            IconRight={X}
            className='w-full lg:w-fit'
          />
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}

export default QrCodeDialog
