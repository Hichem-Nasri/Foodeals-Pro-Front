'use client'

import { CustomButton } from '@/components/custom/CustomButton'
import { NewImageProduct } from '@/containers/gestions/Products/newProducts/newImage'
import anime from 'animejs'
import {
  QrCode,
  X,
  SendToBack,
  Box,
  Boxes,
  Codesandbox,
  FileSpreadsheet,
  Salad,
  ScanBarcode,
  Plus,
  HandHeart,
} from 'lucide-react'
import image from 'next/image'
import React, { useEffect, useState } from 'react'
import { IconType } from '@/types/common-types'
import { DonateRoutes, MarketRoutes } from '@/lib/routes'
import { useRouter } from 'next/navigation'
import ListDropDown from '@/containers/market/components/ListDropDown'
import { ImportSheet } from '@/containers/market/components/ImportSheet'
import { useDonateTranslations } from '@/hooks/useTranslations'

interface SideButtonProps {
  sheet: boolean
  setSheet: React.Dispatch<React.SetStateAction<boolean>>
  image: boolean
  setImage: React.Dispatch<React.SetStateAction<boolean>>
  withScanProduct?: boolean
}

const SideButton: React.FC<SideButtonProps> = ({
  sheet,
  setSheet,
  image,
  setImage,
  withScanProduct = true,
}) => {
  const [anime, setAnime] = useState(false)
  const router = useRouter()
  const tDonate = useDonateTranslations()

  useEffect(() => {
    const element = document.getElementById('import')
    if (element) {
      if (!anime) element.classList.remove('rotate-90')
      else element.classList.add('rotate-90')
    }
    const background = document.getElementsByClassName('background-black')
    if (background) {
      if (anime) background[0].classList.replace('hidden', 'block')
      else background[0].classList.replace('block', 'hidden')
    }
  }, [anime])

  const listMarket: {
    label: string
    Icon: IconType
    action: () => void
  }[] = [
    {
      label: tDonate('actions.addDonation'),
      Icon: HandHeart,
      action: () => {
        router.push(DonateRoutes.donate + '/create')
      },
    },
    {
      label: tDonate('actions.importDonations'),
      Icon: FileSpreadsheet,
      action: () => {
        setSheet(true)
      },
    },
    {
      label: tDonate('actions.scanDonation'),
      Icon: ScanBarcode,
      action: () => {
        setImage(true)
      },
    },
  ]
  return (
    <>
      <div className='fixed bottom-24 right-4 z-50 flex flex-col items-center justify-center gap-1 lg:relative lg:bottom-0 lg:right-0 lg:flex-row lg:gap-3'>
        <ListDropDown
          list={listMarket}
          setOpen={setAnime}
          className=''
          color='blue'
        >
          <button
            id='import'
            className='h-14 w-14 rounded-full border-2 border-white bg-scooter-500 px-2 text-white transition-all flex-center hover:border-scooter-500 hover:bg-scooter-100 hover:text-scooter-500 lg:h-12 lg:w-fit lg:rotate-0 lg:rounded-[12px] gap-2 [&>.icon]:m-0 lg:[&>.icon]:ml-2 [&>.label]:hidden lg:[&>.label]:flex'
          >
            <p className='label text-base font-medium'>{tDonate('actions.createDonate')}</p>
            {anime ? (
              <X className='icon' size={24} />
            ) : (
              <HandHeart className='icon' size={24} />
            )}
          </button>
        </ListDropDown>
      </div>
      <ImportSheet open={sheet} setOpen={setSheet} />
      <NewImageProduct
        open={image}
        setOpen={setImage}
        handleScanProduct={(data) => {
          console.log('Scan Product: ', data)
        }}
      />
    </>
  )
}

export default SideButton
