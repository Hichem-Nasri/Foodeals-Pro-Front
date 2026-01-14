'use client'
import { AppRoutes } from '@/lib/routes'
import {
  ListTodo,
  FileSpreadsheet,
  Plus,
  ImageDown,
  ShoppingBasket,
  QrCode,
} from 'lucide-react'
import React, { FC, useEffect, useState } from 'react'
import DropDownList from './DropDownList'
import { NewImageProduct } from './newProducts/newImage'
import DropDownListMobile from './DropDownMobile'
import { useTranslations } from '@/hooks/useTranslations'
import { Button } from '@/components/ui/button'
import { CustomButton } from '@/components/custom/CustomButton'
import {
  FilterSchemaProductDlc,
  defaultProductSchemaDlc,
} from '@/schemas/product-schema-dlc'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { FilterTableProducts } from './FilterTableProducts'
import { ColumnVisibilityModal } from '@/components/utils/ColumnVisibilityModal'
import { SheetProduct } from '../gestions/Products/newProducts/SheetProduct'
import Switcher from './components/Switcher'

interface FilterProductsProps {
  table: any
  products: any
  refetch: any
  isLoading: boolean
  onFilterSubmit: (data: z.infer<typeof FilterSchemaProductDlc>) => void
  state: 'all' | 'urgente' | 'exigee' | 'souhaitable'
  setState: React.Dispatch<
    React.SetStateAction<'all' | 'urgente' | 'exigee' | 'souhaitable'>
  >
}

const FilterProductsDlc: FC<FilterProductsProps> = ({
  table,
  products,
  refetch,
  isLoading,
  onFilterSubmit,
  state,
  setState,
}) => {
  const { t } = useTranslations();
  const [open, setOpen] = useState(false)
  const [sheet, setSheet] = useState(false)
  const [image, setImage] = useState(false)
  const [drawer, setDrawer] = useState(false)
  const [productConf, setProductConf] = useState(false)
  const [product, setProduct] = useState<any>(products)

  const form = useForm<z.infer<typeof FilterSchemaProductDlc>>({
    resolver: zodResolver(FilterSchemaProductDlc),
    defaultValues: defaultProductSchemaDlc,
    mode: 'onSubmit',
  })

  const DropdownMenuList = [
    {
      label: t('dlc.add'),
      href: AppRoutes.productDetails.replace(':id', 'new'),
      icon: ShoppingBasket,
    },
    {
      label: t('products.importByImage'),
      href: '#',
      icon: QrCode,
      action: () => {},
    },
    {
      label: t('common.import'),
      href: '#',
      icon: FileSpreadsheet,
    },
  ]

  const handleScanProduct = (data: any) => {
    setProduct({
      name: data.name,
      id: data.id,
      imageUrl: data.imageUrl,
      barcode: data.barcode,
    })
    setImage(false)
    setDrawer(true)
  }

  useEffect(() => {
    if (productConf && !isLoading) {
      refetch()
    }
  }, [productConf])

  return (
    <div className='flex h-fit w-full items-center justify-between rounded-[18px] p-1 lg:w-full lg:bg-white'>
      {/* Mobile view */}
      <div className='flex w-full items-center justify-between lg:hidden'>
        <div className='flex items-center justify-evenly space-x-4'>
          <FilterTableProducts
            setOpen={setOpen}
            open={open}
            form={form}
            onSubmit={(data) => {
              onFilterSubmit(data)
              setOpen(false)
            }}
          />
        </div>
      </div>

      {/* Desktop view */}
      <div className='hidden w-full items-center justify-between p-2 lg:flex'>
        <div className='flex w-fit items-center justify-center gap-4'>
          <Switcher state={state} setState={setState} disabled={isLoading} />

          <FilterTableProducts
            setOpen={setOpen}
            open={open}
            form={form}
            onSubmit={(data) => {
              onFilterSubmit(data)
              setOpen(false)
            }}
          />
        </div>
        <DropDownList
          list={DropdownMenuList}
          setSheet={setSheet}
          setImage={setImage}
        >
          <span>{t('dlc.add')}</span>
          <ShoppingBasket size={22} />
        </DropDownList>
      </div>

      {/* Mobile dropdown */}
      <div className='fixed bottom-28 right-4 z-50 flex flex-col items-center gap-4 lg:hidden'>
        <DropDownListMobile
          list={[
            {
              label: t('products.addProduct'),
              href: '',
              icon: <Plus size={22} />,
            },
          ]}
          setSheet={setSheet}
          setImage={setImage}
          isMobile
        >
          <Button
            onClick={() => {}}
            className='size-14 rounded-full bg-[#FAC215] text-white lg:hidden [&:hover]:bg-[#FAC215] [&:not(:disabled):hover]:bg-[#FAC215]'
          >
            <Plus size={22} />
          </Button>
        </DropDownListMobile>
      </div>

      <NewImageProduct
        open={image}
        setOpen={setImage}
        handleScanProduct={handleScanProduct}
        color='yellow'
      />
      <SheetProduct
        open={sheet}
        setOpen={setSheet}
        props={{
          setProducts: setProduct,
          setProductConf: setProductConf,
        }}
      />
    </div>
  )
}

export default FilterProductsDlc
