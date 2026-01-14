'use client'
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useRouter } from 'next/navigation'
import React, { FC, useEffect, useState } from 'react'
import ProductCardDlc from './ProductCardDlc'
import { columnsProducts } from './DlcProductColumn'
import { DataTable } from '@/components/tools/DataTable'
import { TotalValueProps } from '@/types/GlobalType'
import PaginationData from '@/components/tools/PaginationData'
import DLCProduct from '@/types/DlcProduct'
import FilterProductsDlc from './FilterProducts'
import Image from 'next/image'
import { SelectionButton } from './ValuationIcon'
import { FilterSchemaProductDlc } from '@/schemas/product-schema-dlc'
import { z } from 'zod'
import { Checkbox } from './checkedbox'
import { ArrowLeft, Salad } from 'lucide-react'
import SelectionActions from './global/ActionsButtons'
import { useProductDlc } from '@/app/[locale]/pro-dlc/_context/useProduct'
import DrawerProductDlc from './newProducts/DrawerProduct'
import {
  AddProductDlcSchema,
  DefaultAddProductDlc,
} from '@/schemas/add-product-form-dlc'
import { DlcRoutes } from '@/lib/routes'
import EmptyListPlaceholder from '@/components/utils/EmptyListPlaceholder'
import { capitalize } from '@/utils/utils'
import { useTranslations } from '@/hooks/useTranslations'

interface ProductProps {
  products: DLCProduct[]
  refetch: () => void
  isLoading: boolean
  isRefetching: boolean
  totals: TotalValueProps
  setTotals: React.Dispatch<React.SetStateAction<TotalValueProps>>
  isSelectionMode: boolean
  selectedProducts: Set<string>
  onProductSelect: (id: string) => void
  setState: React.Dispatch<
    React.SetStateAction<'all' | 'urgente' | 'exigee' | 'souhaitable'>
  >
  selectedTab: 'all' | 'urgente' | 'exigee' | 'souhaitable'
  onToggle: () => void
  onFilterSubmit: (data: z.infer<typeof FilterSchemaProductDlc>) => void
}

export const Product: FC<ProductProps> = ({
  products,
  selectedTab,
  setState,
  refetch,
  isLoading,
  isRefetching,
  totals,
  setTotals,
  isSelectionMode,
  selectedProducts,
  onProductSelect,
  onFilterSubmit,
  onToggle,
}) => {
  const router = useRouter()
  const { t } = useTranslations();
  const { setProductDlc } = useProductDlc()
  const [rowSelection, setRowSelection] = React.useState({})
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [hasSelectedProducts, setHasSelectedProducts] = React.useState<boolean>(
    selectedProducts.size > 0
  )

  useEffect(() => {
    setHasSelectedProducts(selectedProducts.size > 0)
  }, [selectedProducts])
  const [ProductDetails, setProductDetails] =
    useState<z.infer<typeof AddProductDlcSchema>>(DefaultAddProductDlc)
  const [mode, setMode] = useState<'view' | 'update'>('view')

  const handleValuation = (id: string) => {
    let product = products.find((product) => product.id === id)
    if (!product) return
    setProductDlc([product])
    router.push(DlcRoutes.Valuation)
  }

  const handleSelect = (id: string, mode: 'update' | 'view' = 'view') => {
    let product = products.find((product) => product.id === id)
    if (!product) return
    setProductDetails({
      product_id: product.product_id,
      quantity: product.quantity.toString(),
      bar_code: product.barCode || '99-223-58',
      expiryDate: new Date(),
    })
    setMode(mode)
    setDrawerOpen(true)
  }
  const table = useReactTable({
    data: products,
    columns: columnsProducts(router, handleValuation, handleSelect),
    state: {
      rowSelection,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
  })
  useEffect(() => {
    console.log('++++++++:', rowSelection)
    const selectedProducts = table
      .getRowModel()
      .rows.filter((row) => row.getIsSelected())
    console.log('selectedProducts', selectedProducts)
    setHasSelectedProducts(selectedProducts.length > 0)
    selectedProducts.forEach((row) => {
      onProductSelect(row.original.id)
    })
  }, [table.getFilteredSelectedRowModel().rows])

  return (
    <div className='flex w-full flex-col gap-4'>
      <div className='flex items-center justify-between p-2 lg:p-0'>
        <h2 className='font-montserrat text-left text-xl font-medium leading-normal text-gray-900 lg:hidden'>
          {t('dlc.title')}
        </h2>
        <div className='flex items-center gap-1.5 lg:w-full'>
          <SelectionButton
            isSelectionMode={isSelectionMode}
            onToggle={onToggle}
          />
          <FilterProductsDlc
            state={selectedTab}
            setState={setState}
            table={table}
            products={products}
            refetch={refetch}
            isLoading={isLoading || isRefetching}
            onFilterSubmit={onFilterSubmit}
          />
        </div>
      </div>
      {products.length === 0 && !isLoading ? (
        <EmptyListPlaceholder
          title={t('dlc.noDlc')}
          description={
            selectedTab == 'all'
              ? t('dlc.add')
              : `${t('dlc.noDlc')} ${t(`dlc.tabs.${selectedTab === 'urgente' ? 'urgent' : selectedTab === 'exigee' ? 'required' : 'desirable'}`)}`
          }
          color='yellow'
        />
      ) : (
        <DataTable
          data={products}
          title={t('dlc.title')}
          table={table}
          transform={(product) => (
            <div className='lg:transform-none'>
              <ProductCardDlc
                product={product}
                isSelectionMode={isSelectionMode}
                isSelected={selectedProducts.has(product.id)}
                onSelect={onProductSelect}
              />
            </div>
          )}
          isLoading={isLoading}
          hideColumns={['imageUrl']}
          // hidden={true
          filter={
            selectedTab === 'all'
              ? [
                  t('dlc.types.urgent'),
                  t('dlc.types.required'),
                  t('dlc.types.desirable'),
                ]
              : undefined
          }
          filterFn={(item, filter) => {
            return filter.includes(item?.type)
          }}
          filterName={selectedTab === 'all' ? 'type' : undefined}
        />
      )}

      <PaginationData
        totalPages={totals.totalPages}
        currentPage={totals.currentPage}
        pageSize={totals.pageSize}
        setCurrentPage={(page) => setTotals({ ...totals, currentPage: page })}
        refetch={refetch}
        isLoading={isRefetching || isLoading}
      />
      {hasSelectedProducts && (
        <SelectionActions
          onClearSelection={() => {
            selectedProducts.clear()
            setHasSelectedProducts(false)
          }}
          onValorisation={() => {
            let values: DLCProduct[] = []
            products.forEach((product) => {
              if (selectedProducts.has(product.id)) {
                values.push(product)
              }
            })
            setProductDlc(values)
            router.push(DlcRoutes.Valuation)
            // Valorisation logic here
          }}
        />
      )}
      {drawerOpen && (
        <DrawerProductDlc
          drawer={drawerOpen}
          setDrawer={setDrawerOpen}
          type={mode}
          data={ProductDetails}
          onClose={() => {
            setDrawerOpen(false)
            // setProductDetails(DefaultAddProductDlc)
          }}
          id={
            products.find(
              (product) => product.product_id === ProductDetails.product_id
            )?.id
          }
        />
      )}
    </div>
  )
}

export default Product
