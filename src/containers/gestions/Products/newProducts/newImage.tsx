import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { PictureInPicture, X } from 'lucide-react'
import React, { useRef, useState } from 'react'
import { ImageUpload } from './imageUpload'
import MobileHeader from '@/components/custom/MobileHeader'
import Scanner from '@/components/utils/Scanner'
import { useMediaQuery } from 'react-responsive'
import { useTranslations } from '@/hooks/useTranslations'

export const NewImageProduct = ({
  open,
  setOpen,
  handleScanProduct,
}: {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  handleScanProduct: (data: any) => void
}) => {
  const [barcode, setBarcode] = useState<string | null>(null)
  const isMobile = useMediaQuery({ query: '(max-width: 1024px)' })
  const { t } = useTranslations()

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className='top-0 flex h-screen min-w-full translate-y-[0%] flex-col justify-center gap-0 overflow-auto px-0 py-0 lg:top-1/2 lg:h-[500px] lg:min-w-[700px] lg:-translate-y-[50%] lg:gap-4 lg:px-4 lg:py-4'
          showContent={false}
        >
          <DialogTitle className='hidden items-center justify-between text-wrap text-base font-normal text-lynch-500 lg:flex'>
            <span>{t('scan.dialogTitle')}</span>
            <button type='button' onClick={() => setOpen((prev) => !prev)}>
              <X />
            </button>
          </DialogTitle>
          <MobileHeader
            title={t('scan.mobileTitle')}
            onClick={() => setOpen((prev) => !prev)}
            className='mb-0'
          />
          <DialogDescription className='h-full w-full overflow-auto'>
            {isMobile ? (
              <Scanner handleScanProduct={handleScanProduct} open={open} />
            ) : (
              <ImageUpload handleScanProduct={handleScanProduct} />
            )}
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  )
}
