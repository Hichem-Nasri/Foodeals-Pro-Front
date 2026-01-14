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
} from 'lucide-react'
import image from 'next/image'
import React, { useEffect, useState } from 'react'
import { ImportSheet } from './ImportSheet'
import ListDropDown from './ListDropDown'
import { IconType } from '@/types/common-types'
import { MarketRoutes } from '@/lib/routes'
import { useRouter } from 'next/navigation'
import ScannerBarCode from '@/components/utils/QrCodeScan'
import QrCodeScanner from './QrCodeScanner'
import { cn } from '@/lib/utils'
import { useMarketTranslations } from '@/hooks/useTranslations'

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
  const t = useMarketTranslations()

  useEffect(() => {
    const element = document.getElementById('import')
    const background = document.getElementsByClassName('background-black')
    if (element) {
      if (anime) element.classList.remove('rotate-90')
      else element.classList.add('rotate-90')
    }
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
      label: t('components.sideButton.deal'),
      Icon: Salad,
      action: () => {
        router.push(MarketRoutes.offres + '/deal/create')
      },
    },
    {
      label: t('components.sideButton.boxNormal'),
      Icon: Box,
      action: () => {
        router.push(MarketRoutes.offres + '/box-normal/create')
      },
    },
    {
      label: t('components.sideButton.boxSurprise'),
      Icon: Boxes,
      action: () => {
        router.push(MarketRoutes.offres + '/box-surprise/create')
      },
    },
    {
      label: t('components.sideButton.dealPro'),
      Icon: Codesandbox,
      action: () => {
        router.push(MarketRoutes.dealPro + '/create')
      },
    },
    {
      label: t('components.sideButton.importOffers'),
      Icon: FileSpreadsheet,
      action: () => {
        setSheet(true)
      },
    },
  ]
  return (
    <>
      <div className='fixed bottom-24 right-4 z-[50] flex flex-col items-center justify-center gap-1 lg:relative lg:bottom-0 lg:right-0 lg:flex-row lg:gap-3'>
        <CustomButton
          label={t('components.sideButton.scanner')}
          IconLeft={QrCode}
          className={cn(
            'h-14 w-14 rounded-full bg-primary px-2 text-white transition-all lg:h-12 lg:w-fit lg:rotate-0 lg:rounded-[12px] [&>.icon]:m-0 gap-2 [&>.label]:hidden lg:[&>.label]:flex',
            {
              'hidden lg:flex': anime,
            }
          )}
          onClick={() => {
            setImage(true)
          }}
        />
        <ListDropDown list={listMarket} setOpen={setAnime} className=''>
          <CustomButton
            id={'import'}
            label={t('components.sideButton.createOffer')}
            className='h-14 w-14 rounded-full bg-primary px-2 text-white transition-all lg:h-12 lg:w-fit lg:rotate-0 lg:rounded-[12px] [&>.icon]:m-0 gap-2 [&>.label]:hidden lg:[&>.label]:flex'
            IconRight={anime ? X : SendToBack}
            onClick={() => {
              setAnime((prev) => !prev)
            }}
          />
        </ListDropDown>
      </div>
      <ImportSheet open={sheet} setOpen={setSheet} />

      <QrCodeScanner
        open={image}
        setOpen={setImage}
        handleScan={(data) => {
          console.log(data)
        }}
      />
    </>
  )
}

export default SideButton
