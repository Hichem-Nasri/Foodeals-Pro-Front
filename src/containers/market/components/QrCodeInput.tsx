'use client'
import { CustomButton } from '@/components/custom/CustomButton'
import { Label } from '@/components/custom/Label'
import { Input } from '@/components/ui/input'
import { NewImageProduct } from '@/containers/gestions/Products/newProducts/newImage'
import {
  ColorsT,
  getActiveColorClassName,
} from '@/utils/getActiveColorClassName'
import { ScanQrCode } from 'lucide-react'
import React, { useEffect } from 'react'

interface QrCodeInputProps {
  handleScanProduct: (data: any) => void
  color?: ColorsT
  qrCode?: string
}

const QrCodeInput: React.FC<QrCodeInputProps> = ({
  handleScanProduct,
  color = 'green',
  qrCode,
}) => {
  const [code, setCode] = React.useState(qrCode)
  const [scanner, setScanner] = React.useState(false)
  const handleInput = (e: any) => {
    console.log(e.target.value)
  }
  const colors = getActiveColorClassName(color, 'bg')
  const style = `hover:${colors} ${colors} text-white`
  return (
    <div className='flex w-full flex-col items-start gap-3 rounded-[30px] bg-white p-4'>
      <Label label='Code à bar' />
      <div className='flex w-full items-center gap-2'>
        <Input
          placeholder='Saisir ou scanner'
          className='h-14 w-full flex-1'
          onChange={handleInput}
          value={code}
          disabled
        />
        <CustomButton
          label=''
          size={'sm'}
          type='button'
          className={`${style} size-14 rounded-[16px] text-white [&>.icon]:m-0`}
          IconLeft={ScanQrCode}
          onClick={() => {
            setScanner(true)
          }}
        />
      </div>
      <NewImageProduct
        open={scanner}
        setOpen={setScanner}
        handleScanProduct={(data) => {
          handleScanProduct(data)
          if (data) {
            setCode(data.barcode)
            setScanner(false)
          }
        }}
      />
    </div>
  )
}

export default QrCodeInput
