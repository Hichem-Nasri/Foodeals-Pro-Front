'use client'
import React, { Fragment } from 'react'
import TopBar from './TopBar'
import {
    ColumnFiltersState,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'
import { columnsSupport } from './column/supportColumn'
import { MessageCircleDashed, MessageCircleMore } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { AppRoutes } from '@/lib/routes'
import SupportCard from './SupportCard'
import { CustomButton } from '@/components/custom/CustomButton'
import { DataTable } from '@/components/tools/DataTable'
import { SupportType } from '@/types/support'
import { defaultSchemaFilter, SchemaFilter } from '@/schemas/global-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import PaginationData from '@/components/tools/PaginationData'
import {
    NotificationType,
    TotalValueProps,
    TotalValues,
} from '@/types/GlobalType'
import { getMessages } from '@/actions/messages'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { useNotification } from '@/context/NotifContext'
import Switcher from './Switcher'
import { cn } from '@/lib/utils'
import { useSupportTranslations } from '@/hooks/useTranslations'

const Support = () => {
    const [messages, setMessages] = React.useState<SupportType[]>([])
    const router = useRouter()
    const [state, setState] = React.useState<'READ' | 'UNREAD' | 'ALL'>('ALL')
    const [totals, setTotals] = React.useState<TotalValueProps>(TotalValues)
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([])
    const notify = useNotification()
    const t = useSupportTranslations()
    const form = useForm({
        resolver: zodResolver(SchemaFilter),
        mode: 'onBlur',
        defaultValues: defaultSchemaFilter,
    })
    const { data, error, isLoading, isRefetching, refetch } = useQuery({
        queryKey: ['messages', totals.currentPage, totals.pageSize, state],
        queryFn: async () => {
            try {
                const data = await getMessages(
                    totals.currentPage,
                    totals.pageSize,
                    state
                )

                if (data.status === 500)
                    throw new Error('Error fetching partners')
                const { content, totalPages, totalElements } = data.data
                setTotals({
                    ...totals,
                    totalPages: totalPages,
                })
                setMessages(content)
                return data.data
            } catch (error) {
                notify.notify(NotificationType.ERROR, 'Error fetching partners')

                return null
                // setCollaborators([])
            }
        },
        refetchOnWindowFocus: false,
        placeholderData: keepPreviousData,
    })
    const onSubmit = (data: z.infer<typeof SchemaFilter>) => {
        // setFilterData(data)
        // setOpen(false)
    }
    const table = useReactTable({
        data: messages,
        columns: columnsSupport(router),
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
        <div className='mb-4 flex w-full flex-col gap-[0.625rem] lg:mb-0'>
            {/* <Switcher state={state} setState={setState} /> */}
            <TopBar
                form={form}
                onSubmit={onSubmit}
                table={table}
                router={router}
                state={state}
                setState={setState}
                disabled={isLoading || isRefetching}
            />
            {messages.length > 0 || isLoading ? (
                <DataTable
                    data={messages}
                    table={table}
                    title={t('requestsList')}
                    transform={(value) => <SupportCard message={value} />}
                    filter={[]}
                    isLoading={isLoading || isRefetching}
                    filterName='typeRequest'
                />
            ) : (
                <div className='flex flex-col items-start justify-center gap-4'>
                    <div className='flex min-h-[600px] w-full flex-col items-center justify-center gap-7 rounded-[14px] bg-white'>
                        <Image
                            src='/images/no-data.svg'
                            alt='no message'
                            width={300}
                            height={300}
                        />
                        <h6 className='font-light'>
                            {state === 'UNREAD'
                                ? t('noUnreadMessages')
                                : state === 'READ'
                                  ? t('noReadMessages')
                                  : t('noMessages')}
                        </h6>
                        <CustomButton
                            size='sm'
                            variant='outline'
                            label={t('newMessage')}
                            IconRight={MessageCircleMore}
                            onClick={() =>
                                router.push(
                                    AppRoutes.supportDetails.replace(
                                        ':id',
                                        'new'
                                    )
                                )
                            }
                        />
                    </div>
                </div>
            )}
            <PaginationData
                currentPage={0}
                pageSize={10}
                setCurrentPage={(page) => {
                    page
                }}
                totalPages={0}
            />
            <Link
                href={AppRoutes.supportDetails.replace(':id', 'new')}
                className={cn(
                    `flex w-full lg:hidden`,
                    `${!messages.length && 'hidden'}`
                )}
            >
                <CustomButton
                    label={t('newSupport')}
                    className='w-full'
                    IconRight={MessageCircleMore}
                    onClick={() => {}}
                />
            </Link>
        </div>
    )
}

export default Support
