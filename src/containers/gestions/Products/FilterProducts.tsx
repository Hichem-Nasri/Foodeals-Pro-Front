'use client'
import { AppRoutes } from '@/lib/routes'
import {
  Archive,
  ArrowRight,
  ListTodo,
  FileSpreadsheet,
  Plus,
  ImageDown,
  ArrowLeft,
  Salad,
} from 'lucide-react'
import React, { FC, useEffect, useState } from 'react'
import DropDownList from './DropDownList'
import { NewImageProduct } from './newProducts/newImage'
import { SheetProduct } from './newProducts/SheetProduct'
import DropDownListMobile from './DropDownMobile'
import { Button } from '@/components/ui/button'
import { CustomButton } from '@/components/custom/CustomButton'
import { ColumnVisibilityModal } from '@/components/utils/ColumnVisibilityModal'
import {
  defaultProductSchema,
  FilterSchemaProduct,
} from '@/schemas/gestion/product-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  SubmitHandler,
  useForm,
} from 'react-hook-form'
import { z } from 'zod'
import { FilterTableProducts } from './FilterTableProducts'
import DrawerProduct from './newProducts/DrawerProduct'
import { useTranslations } from '@/hooks/useTranslations'

interface FilterProductsProps {
  table: any
  products: any
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  onSubmit: SubmitHandler<z.infer<typeof FilterSchemaProduct>>
  refetch: any
  isLoading: boolean
  archive: boolean
  handleArchive: () => void
  setFilterData: React.Dispatch<
    React.SetStateAction<z.infer<typeof FilterSchemaProduct> | null>
  >
}

const FilterProducts: FC<FilterProductsProps> = ({
  table,
  products,
  refetch,
  isLoading,
  archive,
  open,
  setOpen,
  onSubmit,
  handleArchive,
  setFilterData,
}) => {
  const { t } = useTranslations()
  const [sheet, setSheet] = useState(false)
  const [image, setImage] = useState(false)
  const [drawer, setDrawer] = useState(false)
  const [productConf, setProductConf] = useState(false)
  const [product, setProduct] = useState<any>(products)

  const form = useForm<z.infer<typeof FilterSchemaProduct>>({
    resolver: zodResolver(FilterSchemaProduct),
    mode: 'onSubmit',
    defaultValues: defaultProductSchema,
  })

  const DropdownMenuList = [
    {
      label: t('products.addProducts'),
      href: '#',
      icon: FileSpreadsheet,
    },
    {
      label: t('products.addManually'),
      href: AppRoutes.productDetails,
      icon: Plus,
    },
    {
      label: t('products.importByImage'),
      href: '#',
      icon: ImageDown,
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
    <div className='flex h-fit w-full items-center justify-between rounded-[18px] p-1 lg:bg-white'>
      <div className='my-2 flex w-full items-center justify-between space-x-4 lg:hidden lg:space-x-0'>
        <h2 className='mx-4 text-[1.375rem] font-medium text-lynch-950'>
          {t('products.ourProducts')}
        </h2>
        <div className='flex items-center justify-evenly space-x-4'>
          <FilterTableProducts
            setOpen={setOpen}
            open={open}
            form={form}
            onSubmit={onSubmit}
            setFilterData={setFilterData}
          />
          <CustomButton
            label=''
            IconLeft={!archive ? Archive : Salad}
            size={'sm'}
            variant='ghost'
            onClick={handleArchive}
            className='size-14 rounded-full bg-white text-lynch-400 [&>.icon]:m-0'
          />
        </div>
      </div>
      <div className='hidden items-center justify-center gap-3 p-2 lg:flex'>
        <FilterTableProducts
          setOpen={setOpen}
          open={open}
          form={form}
          onSubmit={onSubmit}
          setFilterData={setFilterData}
        />
        <ColumnVisibilityModal table={table} hiddens={['imageUrl']} />
        <CustomButton
          size='sm'
          variant='outline'
          label={!archive ? t('products.archive') : t('common.products')}
          className='text-lynch-500'
          onClick={handleArchive}
          IconRight={!archive ? Archive : ArrowLeft}
        />
      </div>
      <div className='hidden gap-3 p-2 lg:flex'>
        <DropDownList
          list={DropdownMenuList}
          setSheet={setSheet}
          setImage={setImage}
        >
          <CustomButton
            size='sm'
            label={t('products.addProduct')}
            IconRight={ListTodo}
          />
        </DropDownList>
        <CustomButton
          size='sm'
          disabled
          variant='destructive'
          label={table.getRowCount().toString()}
          IconLeft={ArrowRight}
        />
      </div>
      <div className='fixed bottom-2 right-2 z-50 flex flex-col items-center gap-4 lg:hidden'>
        <DropDownListMobile
          list={[
            {
              label: t('products.addProduct'),
              href: '',
              icon: <Plus size={22} />,
            },
          ]}
          setSheet={() => {
            setSheet(true)
          }}
          setImage={() => {
            setImage(true)
          }}
          isMobile
        >
          <Button
            onClick={() => {}}
            className='size-14 rounded-full bg-primary text-white'
          >
            <Plus size={22} />
          </Button>
        </DropDownListMobile>
      </div>
      <NewImageProduct
        open={image}
        setOpen={setImage}
        handleScanProduct={handleScanProduct}
      />
      <SheetProduct
        open={sheet}
        setOpen={setSheet}
        props={{
          setProducts: setProduct,
          setProductConf: setProductConf,
        }}
      />
      <DrawerProduct
        setDrawer={setDrawer}
        drawer={drawer}
        setProduct={setProduct}
        product={product}
      />
    </div>
  )
}

export default FilterProducts
