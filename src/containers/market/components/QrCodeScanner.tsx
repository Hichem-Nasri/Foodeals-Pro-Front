import {
  Dialog,
  DialogContent,
  DialogDescription,
} from '@/components/ui/dialog'
import MobileHeader from '@/components/custom/MobileHeader'
import ScannerBarCode from '@/components/utils/QrCodeScan'
import React from 'react'
import { ColorsT } from '@/utils/getActiveColorClassName'
import { useMarketTranslations } from '@/hooks/useTranslations'

interface QrCodeScannerProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  color?: ColorsT
  handleScan: (data: any) => void
}

const QrCodeScanner: React.FC<QrCodeScannerProps> = ({
  open,
  setOpen,
  color = 'green',
  handleScan,
}) => {
  const t = useMarketTranslations()
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className='top-0 flex h-screen min-w-full translate-y-[0%] flex-col justify-center gap-0 overflow-auto px-0 py-0 lg:top-1/2 lg:h-[500px] lg:min-w-[700px] lg:-translate-y-[50%] lg:gap-4 lg:px-4 lg:py-4'
        showContent={false}
      >
        <MobileHeader
          title={t('components.qrScanner.title')}
          onClick={() => setOpen((prev) => !prev)}
          color={color}
        />
        <DialogDescription className='h-full w-full overflow-auto'>
          <ScannerBarCode handleScan={handleScan} open={open} color={color} />
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}

export default QrCodeScanner
