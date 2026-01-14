'use client'
import React, { useEffect, useState } from 'react'
import TopBar from './TopBar'
import { CustomButton } from '@/components/custom/CustomButton'
import { DataTable } from '@/components/tools/DataTable'
import PaginationData from '@/components/tools/PaginationData'
import { useNotification } from '@/context/NotifContext'
import { AppRoutes } from '@/lib/routes'
import {
  TotalValues,
  NotificationType,
  TotalValueProps,
} from '@/types/GlobalType'
import { zodResolver } from '@hookform/resolvers/zod'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import {
  ColumnFiltersState,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
} from '@tanstack/react-table'
import { FileSpreadsheet, Store } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { StoreCard } from './StoreCard'
import { columnsStoresTable } from './column/storeColumn'
import { StoresType } from '@/types/store-type'
import Link from 'next/link'
import { FilterMagasins } from './FilterMagasin'
import { defaultSchemaFilter, SchemaFilter } from '@/schemas/global-schema'
import { getAllStores } from '@/actions/store'
import { useStoresTranslations, useMessagesTranslations, useCommonTranslations } from '@/hooks/useTranslations'

const Stores = () => {
  const [archive, setArchive] = React.useState(false)
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [stores, setStores] = useState<StoresType[]>([])
  const [state, setState] = React.useState<'active' | 'desactive' | 'archive'>(
    'active'
  )
  const [totals, setTotals] = useState<TotalValueProps>(TotalValues)
  const [filterData, setFilterData] = useState<z.infer<typeof SchemaFilter>>()
  const [open, setOpen] = useState(false)
  const notify = useNotification()
  const router = useRouter()
  const t = useStoresTranslations()
  const mt = useMessagesTranslations()
  const ct = useCommonTranslations()
  const { data, error, isLoading, isRefetching, refetch } = useQuery({
    queryKey: [
      'stores',
      totals.currentPage,
      totals.pageSize,
      state,
      filterData,
    ],
    queryFn: async () => {
      try {
        const res = await getAllStores(
          filterData,
          state,
          totals.currentPage,
          totals.pageSize
        )
        if (res.status === 500) {
          throw new Error('Erreur lorque fetch magasins')
        }
        const { totalPages, content } = res.data
        setTotals((prev) => ({
          ...prev,
          totalPages: totalPages,
        }))

        setStores(
          content.map((val: StoresType) => ({
            ...val,
            type: val.activities.length > 0 ? val.activities[0].name : '',
            status: val.status,
          }))
        )
        return res.data
      } catch (error) {
        notify.notify(NotificationType.ERROR, mt('error.general'))
        console.error(error)
        // setStores([])
      }
    },
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  })

  const form = useForm<z.infer<typeof SchemaFilter>>({
    resolver: zodResolver(SchemaFilter),
    mode: 'onBlur',
    defaultValues: defaultSchemaFilter,
  })

  const onSubmit = (data: z.infer<typeof SchemaFilter>) => {
    setFilterData(data)
    setOpen(false)
  }

  const table = useReactTable({
    data: stores || [],
    columns: columnsStoresTable(router, refetch, state == 'archive', t, ct),
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })
  // Handle archive
  const handleArchive = () => {
    if (isRefetching || isLoading) return
    setState((prev) => {
      if (prev === 'archive') return 'active'
      return 'archive'
    })
    setArchive((prev) => !prev)
  }
  useEffect(() => {
    if (isLoading || isRefetching) return
    refetch()
  }, [archive, filterData])

  return (
    <div className='mb-4 flex w-full flex-col items-center gap-[0.625rem] p-2 lg:mb-0 lg:p-0'>
      <FilterMagasins
        open={open}
        setOpen={setOpen}
        form={form}
        table={table}
        archive={state == 'archive'}
        handleArchive={handleArchive}
        onSubmit={onSubmit}
        isFetching={isLoading || isRefetching}
        state={state}
        setState={(val) => {
          setFilterData(defaultSchemaFilter)
          setState(val)
        }}
      />
      <DataTable
        data={stores! || []}
        table={table}
        title={t('storesList')}
        transform={(value) => (
          <StoreCard
            store={value}
            refetch={refetch}
            archive={state == 'archive'}
          />
        )}
        isLoading={isLoading || isRefetching}
        filter={[]}
        filterName='type'
      />
      <PaginationData
        currentPage={totals.currentPage}
        setCurrentPage={(page) => setTotals({ ...totals, currentPage: page })}
        totalPages={totals.totalPages}
        pageSize={totals.pageSize}
        refetch={refetch}
      />
      <Link
        href={AppRoutes.storeDetails.replace(':id', 'new')}
        className='flex w-full flex-col items-center gap-4 lg:hidden'
      >
        <CustomButton
          label={t('addNewStore')}
          className='w-full'
          IconRight={Store}
        />
      </Link>
    </div>
  )
}

export default Stores
