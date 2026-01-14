'use client'

import { DataTable } from '@/components/tools/DataTable'
import PaginationData from '@/components/tools/PaginationData'
import { useNotification } from '@/context/NotifContext'
import {
  defaultSchemaCollaborators,
  SchemaCollaborators,
} from '@/types/collaboratorsUtils'
import {
  NotificationType,
  TotalValueProps,
  TotalValues,
} from '@/types/GlobalType'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  keepPreviousData,
  useQuery,
} from '@tanstack/react-query'
import {
  ColumnFiltersState,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
} from '@tanstack/react-table'
import { useRouter } from 'next/navigation'
import React, {
  FC,
  useEffect,
  useState,
} from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { CollaboratorCard } from './CollaboratorCard'
import {
  columnsCollaboratorsTable,
  demoDataCollaborators,
} from './column/collaboratorColumn'
import { FilterCollaborators } from './FilterCollaborators'
import Link from 'next/link'
import { AppRoutes } from '@/lib/routes'
import { CustomButton } from '@/components/custom/CustomButton'
import { UserPlus } from 'lucide-react'
import {
  CollaboratorsType,
  CollaboratorType,
} from '@/types/collaborators'
import { getUsers } from '@/actions/User'
import { useCollaboratorsTranslations, useCommonTranslations, useMessagesTranslations } from '@/hooks/useTranslations'

interface CollaborateursProps {
  id: string
  type: string
}

const Collaborateurs: FC<
  CollaborateursProps
> = ({ id, type }) => {
  const tc = useCollaboratorsTranslations()
  const tm = useMessagesTranslations()
  const tcommon = useCommonTranslations()
  const [
    collaborators,
    setCollaborators,
  ] = useState<CollaboratorsType[]>(
    demoDataCollaborators
  )
  const [totals, setTotals] =
    useState<TotalValueProps>(
      TotalValues
    )
  const [
    columnFilters,
    setColumnFilters,
  ] = useState<ColumnFiltersState>([])
  const [filterData, setFilterData] =
    useState<
      z.infer<
        typeof SchemaCollaborators
      >
    >(defaultSchemaCollaborators)
  const [open, setOpen] =
    useState(false)
  const [archive, setArchive] =
    useState(false)
  const notify = useNotification()
  const router = useRouter()
  const {
    error,
    isLoading,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: [
      'users',
      totals.currentPage,
      totals.pageSize,
      archive,
    ],
    queryFn: async () => {
      try {
        const data = await getUsers(
          id,
          totals.currentPage,
          totals.pageSize,
          archive,
          filterData
        )

        if (data.status === 500)
          throw new Error(
            tm('error.general')
          )
        const {
          content,
          totalPages,
          totalElements,
        } = data.data
        setTotals({
          ...totals,
          totalPages: totalPages,
          totalElements: totalElements,
        })
        setCollaborators(
          content.map((item: any) => ({
            ...item,
            role:
              item?.role &&
              item?.role?.name,
            city:
              item?.address &&
              item?.address?.city?.name,
            region:
              item?.address &&
              item?.address?.city
                ?.regionsResponse[0]
                .name,
            solutions:
              item?.solutions &&
              item?.solutions.map(
                (solution: {
                  id: string
                  name: string
                }) =>
                  solution.name == 'dlc'
                    ? 'pro_dlc'
                    : solution.name
              ),
          }))
        )
        return data.data
      } catch (error) {
        notify.notify(
          NotificationType.ERROR,
          tm('error.general')
        )
        //
        // setCollaborators([])
      }
    },
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  })

  // handleArchive function

  const form = useForm<
    z.infer<typeof SchemaCollaborators>
  >({
    resolver: zodResolver(
      SchemaCollaborators
    ),
    mode: 'onBlur',
    defaultValues:
      defaultSchemaCollaborators,
  })

  const onSubmit = (
    data: z.infer<
      typeof SchemaCollaborators
    >
  ) => {
    setFilterData(data)
    setOpen(false)
  }

  const table = useReactTable({
    data: collaborators,
    columns: columnsCollaboratorsTable(
      router,
      refetch,
      id,
      tc,
      tcommon
    ),
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange:
      setColumnFilters,
    getFilteredRowModel:
      getFilteredRowModel(),
    getSortedRowModel:
      getSortedRowModel(),
    getPaginationRowModel:
      getPaginationRowModel(),
  })
  useEffect(() => {
    if (isLoading || isRefetching)
      return
    refetch()
  }, [filterData])

  return (
    <div className='mb-4 flex w-full flex-col gap-[0.625rem] p-2 lg:mb-0 lg:p-0'>
      <FilterCollaborators
        form={form}
        onSubmit={onSubmit}
        open={open}
        setOpen={setOpen}
        isFetching={
          isLoading || isRefetching
        }
        id={id}
        archive={archive}
        handleArchive={() => {
          setFilterData(
            defaultSchemaCollaborators
          )
          setArchive((prev) => !prev)
        }}
      />
      <DataTable
        data={collaborators}
        table={table}
        title={tc('collaboratorsList')}
        transform={(value) => (
          <CollaboratorCard
            User={value}
            partnerId={id}
          />
        )}
        filter={[]}
        filterName='role'
        isLoading={
          isLoading || isRefetching
        }
      />
      <PaginationData
        pageSize={totals.pageSize}
        currentPage={totals.currentPage}
        totalPages={totals.totalPages}
        setCurrentPage={(page) =>
          setTotals({
            ...totals,
            currentPage: page,
          })
        }
        refetch={refetch}
      />
      <Link
        href={
          AppRoutes.collaboratorDetails.replace(
            ':id',
            'new'
          ) + `?partner=${id}`
        }
        className='flex h-14 w-full lg:hidden'
      >
        <CustomButton
          label={tc('addCollaborator')}
          className={
            'w-full rounded-[14px]'
          }
          IconRight={UserPlus}
        />
      </Link>
    </div>
  )
}

export default Collaborateurs
