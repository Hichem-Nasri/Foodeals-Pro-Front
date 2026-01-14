'use client'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useRouter } from 'next/navigation'
import React, { FC, useState } from 'react'
import ProductCard from './ProductCard'
import { columnsProducts } from './column/productsColumn'
import { DataTable } from '@/components/tools/DataTable'
import FilterProducts from './FilterProducts'
import { ProductsType } from '@/types/product-type'
import { FilterSchemaProduct } from '@/schemas/gestion/product-schema'
import { TotalValueProps, TotalValues } from '@/types/GlobalType'
import PaginationData from '@/components/tools/PaginationData'
import { capitalize } from '@/utils/utils'
import { getProducts } from '@/actions/product'
import { z } from 'zod'
import { useTranslations } from '@/hooks/useTranslations'

interface ProductProps {}

const Product: FC<ProductProps> = () => {
  const { t } = useTranslations()
  const [products, setProducts] = useState<ProductsType[]>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [totals, setTotals] = useState<TotalValueProps>(TotalValues)
  const [archive, setArchive] = useState(false)
  const [filterData, setFilterData] = useState<z.infer<
    typeof FilterSchemaProduct
  > | null>(null)
  const [open, setOpen] = useState(false) // for open filter mobile
  const router = useRouter()

  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: [
      'products',
      totals.currentPage,
      totals.pageSize,
      archive,
      filterData,
    ],
    queryFn: async () => {
      try {
        const response = await getProducts(
          totals.currentPage,
          totals.pageSize,
          archive,
          filterData
        )

        const { data, status } = response
        if (status === 200 && data) {
          setTotals({
            ...totals,
            totalPages: data.totalPages,
          })
          setProducts(
            data.content.map((product: any) => {
              return {
                ...product,
                createdBy: {
                  name:
                    capitalize(product?.createdBy?.name.firstName) +
                    ' ' +
                    capitalize(product?.createdBy?.name.lastName),
                  role: product?.createdBy?.role.name,
                  avatarPath: product?.createdBy?.avatarPath,
                  email: product?.createdBy?.email,
                  phone: product?.createdBy?.phone,
                },
                imageUrl:
                  product.imageUrl && product.imageUrl.startsWith('http')
                    ? product.imageUrl
                    : process.env.NEXT_PUBLIC_API_URL + '/photos/' + product.imageUrl,
              }
            })
          )
        }
        return []
      } catch (error) {
        return []
      }
    },
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  })

  const onSubmit = (data: z.infer<typeof FilterSchemaProduct> | null) => {
    setFilterData(data)
    setOpen(false)
  }

  const table = useReactTable({
    data: products,
    columns: columnsProducts(router, refetch, t),
    state: {
      columnFilters,
    },
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className='mb-20 flex w-full flex-col items-center gap-[0.625rem] lg:mb-0'>
      <FilterProducts
        table={table}
        products={products}
        refetch={refetch}
        isLoading={isLoading || isRefetching}
        archive={archive}
        onSubmit={onSubmit}
        open={open}
        setOpen={setOpen}
        handleArchive={() => setArchive((prev) => !prev)}
        setFilterData={setFilterData}
      />
      <DataTable
        data={products}
        table={table}
        title={t('products.productsList')}
        transform={(value) => <ProductCard product={value} archive={archive} />}
        isLoading={isLoading || isRefetching}
        filter={[]}
        filterName='rayon'
        hideColumns={['imageUrl']}
      />
      <PaginationData
        totalPages={totals.totalPages}
        currentPage={totals.currentPage}
        pageSize={totals.pageSize}
        setCurrentPage={(page) => setTotals({ ...totals, currentPage: page })}
        refetch={refetch}
        isLoading={isRefetching || isLoading}
      />
    </div>
  )
}

export default Product
