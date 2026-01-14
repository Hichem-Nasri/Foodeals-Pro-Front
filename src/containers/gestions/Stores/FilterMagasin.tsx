import React, { FC } from 'react'
import {
    Archive,
    ArrowLeft,
    ArrowRight,
    Building2,
    HeartHandshake,
} from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'
import { CustomButton } from '@/components/custom/CustomButton'
import { useRouter } from 'next/navigation'
import { AppRoutes } from '@/lib/routes'
import { z } from 'zod'
import { SchemaFilter } from '@/schemas/global-schema'
import { FormFilter } from './FormFilters'
import TopBar from './TopBar'
import { useStoresTranslations } from '@/hooks/useTranslations'

interface FilterMagasinsProps {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    form: UseFormReturn<any>
    table: import('@tanstack/table-core').Table<any>
    archive: boolean
    handleArchive: () => void
    type?: 'ASSOCIATIONS' | 'SIEGES' | 'USERS'
    onSubmit: (data: z.infer<typeof SchemaFilter>) => void
    isFetching?: boolean
    state: string
    setState: React.Dispatch<
        React.SetStateAction<'active' | 'desactive' | 'archive'>
    >
}

export const FilterMagasins: FC<FilterMagasinsProps> = ({
    open,
    setOpen,
    form,
    table,
    archive,
    handleArchive,
    onSubmit,
    isFetching,
    state,
    setState,
}) => {
    const router = useRouter()
    const t = useStoresTranslations()
    
    return (
        <div className='flex w-full justify-between rounded-[18px] lg:bg-white'>
            <div className='w-full flex-col-center lg:hidden'>
                <TopBar
                    state={state}
                    setState={setState}
                    disabled={isFetching!}
                />
                <div className='flex w-full items-center justify-between lg:hidden'>
                    <h2 className='text-[1.375rem] font-medium text-lynch-950'>
                        {t('title')}
                    </h2>
                    <div className='flex items-center justify-end gap-3'>
                        <FormFilter
                            form={form}
                            onSubmit={onSubmit}
                            open={open}
                            setOpen={setOpen}
                            archive={archive}
                        />
                    </div>
                </div>
            </div>
            <div className='hidden gap-3 p-2 lg:flex-center-start'>
                <TopBar
                    state={state}
                    setState={setState}
                    disabled={isFetching!}
                />
                <FormFilter
                    form={form}
                    onSubmit={onSubmit}
                    open={open}
                    setOpen={setOpen}
                    archive={archive}
                />
                <CustomButton
                    size='sm'
                    variant='outline'
                    className={``}
                    label={!archive ? t('archive') : t('title')}
                    IconRight={!archive ? Archive : ArrowLeft}
                    onClick={handleArchive}
                    disabled={isFetching}
                />
            </div>
            <div className={`hidden gap-3 p-2 lg:flex`}>
                <CustomButton
                    size='sm'
                    className={``}
                    label={t('addStore')}
                    IconRight={Building2}
                    onClick={() =>
                        router.push(
                            AppRoutes.storeDetails.replace(':id', 'new')
                        )
                    }
                    disabled={isFetching}
                />
            </div>
        </div>
    )
}
