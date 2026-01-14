import React, { FC } from 'react'
import {
  FileSpreadsheet,
  ImagePlus,
  ListTodo,
  Plus,
  QrCode,
  ShoppingBasket,
} from 'lucide-react'
import Link from 'next/link'
import { AppRoutes } from '@/lib/routes'
import { NewImageProduct } from './newProducts/newImage'
import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import DrawerProductDlc from './newProducts/DrawerProduct'
import { useTranslations } from '@/hooks/useTranslations'
import ProductDetailsDesktop from './ProductDetailsDesktop'
// import AppRouter from 'next/dist/client/components/app-router';

interface DropDownListProps {
  list?: {
    label: string
    href: string
    icon: any
  }[]
  children: React.ReactNode
  setSheet: React.Dispatch<React.SetStateAction<boolean>>
  setImage: React.Dispatch<React.SetStateAction<boolean>>
}

const DropDownList: FC<DropDownListProps> = ({
  list,
  children,
  setSheet,
  setImage,
}) => {
  const { t } = useTranslations();
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className='flex h-12 items-center justify-center gap-2 rounded-[14px] border-2 border-white bg-[#FAC215] px-5 py-3 text-sm font-medium text-white transition-colors hover:border-tulip-400 hover:bg-tulip-100 hover:text-tulip-400'>
          {children}
        </DropdownMenuTrigger>
        <DropdownMenuContent className='rounded-[16px]'>
          <div className='flex flex-col gap-2 px-2'>
            <DropdownMenuItem>
              <button
                type='button'
                onClick={() => setDrawerOpen(true)}
                className='flex items-center gap-2 rounded-md p-2 text-lynch-500 hover:bg-gray-100'
              >
                <ShoppingBasket size={22} />
                <span>{t('dlc.add')}</span>
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <button
                type='button'
                onClick={() => setSheet((prev) => !prev)}
                className='flex items-center gap-2 rounded-md p-2 text-lynch-500 hover:bg-gray-100'
              >
                <QrCode size={22} />
                <span>{t('products.importByImage')}</span>
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <button
                type='button'
                onClick={() => setImage((prev) => !prev)}
                className='flex items-center gap-2 rounded-md p-2 text-lynch-500 hover:bg-gray-100'
              >
                <FileSpreadsheet size={22} />
                <span>{t('common.import')}</span>
              </button>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
      <DrawerProductDlc
        drawer={drawerOpen}
        setDrawer={setDrawerOpen}
        type={'add'}
      />
    </>
  )
}

export default DropDownList
