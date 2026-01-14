import React, { FC } from 'react'
import {
    Archive,
    ArrowLeft,
    ArrowRight,
    HeartHandshake,
    UserPlus,
    Users2,
} from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'
import { CustomButton } from '@/components/custom/CustomButton'
import { useRouter } from 'next/navigation'
import { AppRoutes } from '@/lib/routes'
import { z } from 'zod'
import { FormFilterCollaborator } from './FormFilter'
import { SchemaFilter } from '@/schemas/global-schema'
import Link from 'next/link'
import { SchemaCollaborators } from '@/types/collaboratorsUtils';
import { useCollaboratorsTranslations } from '@/hooks/useTranslations'

interface FilterCollaboratorsProps {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    form: UseFormReturn<any>
    onSubmit: (data: z.infer<typeof SchemaCollaborators>) => void
    isFetching?: boolean
    archive: boolean
    id: string
    handleArchive: () => void
}

export const FilterCollaborators: FC<FilterCollaboratorsProps> = ({
    open,
    setOpen,
    form,
    onSubmit,
    isFetching,
    archive,
    id,
    handleArchive,
}) => {
    const router = useRouter()
    const tc = useCollaboratorsTranslations()
    
    return (
        <div className='flex w-full justify-between rounded-[18px] lg:bg-white'>
            <div className='flex w-full items-center justify-between lg:hidden'>
                <h2 className='text-[1.375rem] font-medium text-lynch-950'>
                    {tc('collaboratorsList')}
                </h2>
                <div className='flex items-center justify-end gap-3'>
                    <FormFilterCollaborator
                        form={form}
                        onSubmit={onSubmit}
                        open={open}
                        setOpen={setOpen}
                    />
                    <CustomButton
                        label=''
                        IconLeft={!archive ? Archive : Users2}
                        size={'sm'}
                        variant='ghost'
                        onClick={handleArchive}
                        className='size-14 rounded-full bg-white text-lynch-400 [&>.icon]:m-0'
                    />
                </div>
            </div>
            <div className='hidden gap-3 p-2 lg:flex'>
                <FormFilterCollaborator
                    form={form}
                    onSubmit={onSubmit}
                    open={open}
                    setOpen={setOpen}
                />
            </div>
            <Link
                href={
                    AppRoutes.collaboratorDetails.replace(':id', 'new') +
                    `?partner=${id}`
                }
                className={`hidden gap-3 p-2 lg:flex`}
            >
                <CustomButton
                    label={tc('addCollaborator')}
                    IconRight={UserPlus}
                    size={'sm'}
                />
            </Link>
        </div>
    )
}
