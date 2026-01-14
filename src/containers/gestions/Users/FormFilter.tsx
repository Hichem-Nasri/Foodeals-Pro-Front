import React, { FC, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Check, Eraser, ListFilter, Mail, PhoneCall, X } from 'lucide-react'
import { SchemaCollaborators } from '@/types/collaboratorsUtils'
import { CustomButton } from '@/components/custom/CustomButton'
import { InputFieldForm } from '@/components/custom/InputField'
import MobileHeader from '@/components/custom/MobileHeader'
import { SelectField } from '@/components/custom/SelectField'
import { DateFilter } from '@/components/filters/DateFilters'
import { FilterManager } from '@/components/filters/FilterManger'
import { FilterMultiSelect } from '@/components/filters/FilterMultiSelect'
import { MultiSelectOptionsType } from '@/components/tools/MultiSelect'
import { PartnerSolution } from '@/components/utils/PartnerSolution'
import { PartnerSolutionType } from '@/types/GlobalType'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { Form } from '@/components/ui/form'
import FieldRole from './UserDetails/FieldRoles'
import FieldSolutions from '@/components/filters/FieldSolutions'
import { FilterOrganizations } from '@/components/filters/FilterOrganizations'
import { capitalize } from '@/utils/utils'
import { useCollaboratorsTranslations, useCommonTranslations } from '@/hooks/useTranslations'

interface FormFilterCollaboratorProps {
    form: UseFormReturn<z.infer<typeof SchemaCollaborators>>
    onSubmit: (data: z.infer<typeof SchemaCollaborators>) => void
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    open: boolean
}

export const FormFilterCollaborator: FC<FormFilterCollaboratorProps> = ({
    form,
    onSubmit,
    setOpen,
    open,
}) => {
    const tc = useCollaboratorsTranslations()
    const tcommon = useCommonTranslations()
    
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className='my-4 flex items-center gap-3 rounded-full border-0 border-lynch-200 bg-white p-4 text-sm font-medium text-lynch-500 hover:bg-neutral-100 hover:text-black lg:my-0 lg:rounded-[12px] lg:border lg:px-5 lg:py-3'>
                <span className='hidden lg:inline-flex'>{tc('filterBy')}</span>
                <ListFilter />
            </DialogTrigger>
            <DialogContent className='max-h-screen w-full min-w-full max-w-full gap-[1.875rem] overflow-auto rounded-none p-5 lg:min-w-fit lg:max-w-[36.25rem] lg:rounded-[14px] [&>.Icon]:hidden'>
                <FormCollaborator
                    form={form}
                    onSubmit={onSubmit}
                    setOpen={setOpen}
                />
            </DialogContent>
        </Dialog>
    )
}

interface FormCollaboratorProps {
    form: UseFormReturn<z.infer<typeof SchemaCollaborators>>
    onSubmit: (data: z.infer<typeof SchemaCollaborators>) => void
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const FormCollaborator: FC<FormCollaboratorProps> = ({
    form,
    onSubmit,
    setOpen,
}) => {
    const { handleSubmit, control } = form
    const tc = useCollaboratorsTranslations()
    const tcommon = useCommonTranslations()
    
    return (
        <Form {...form}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className='mt-10 flex min-h-full w-full flex-col gap-2 bg-white lg:mt-0'
            >
                <DialogTitle className='hidden text-[1.375rem] font-normal text-lynch-400 lg:flex'>
                    {tc('filterBy')}
                </DialogTitle>
                <div className='absolute left-0 right-0 top-0 flex min-w-full lg:hidden'>
                    <MobileHeader
                        title={tc('filterBy')}
                        onClick={() => setOpen(false)}
                    />
                </div>
                <div className='flex flex-col gap-2 gap-x-4 pt-4 lg:pt-0'>
                    <DateFilter form={form} disabled={false} />
                    <div className='flex w-full flex-col gap-3 lg:flex-row'>
                        <FilterManager
                            control={control}
                            name='collaboratorId'
                            label={tc('title')}
                            type={''}
                        />
                        <FilterOrganizations
                            control={control}
                            name='role'
                            label={tc('role')}
                            disabled={false}
                            fn={(data: any) => {
                                return data.map((item: any) => ({
                                    label: capitalize(
                                        item.name.replace(/_/g, ' ')
                                    ),
                                    key: item.name,
                                }))
                            }}
                            oneSelect
                            url='/roles/allExcludingAdminAndSuperAdminAndClient'
                        />
                    </div>
                    <div className='flex w-full flex-col gap-3 lg:flex-row'>
                        <InputFieldForm
                            control={control}
                            name='email'
                            label={tc('email')}
                            placeholder={tc('form.emailPlaceholder')}
                            IconLeft={Mail}
                        />
                        <InputFieldForm
                            control={control}
                            name='phone'
                            label={tc('phone')}
                            placeholder={tc('form.phonePlaceholder')}
                            IconLeft={PhoneCall}
                        />
                    </div>
                    <div className='flex w-full flex-col gap-3 lg:flex-row'>
                        <FilterOrganizations
                            control={control}
                            name='solutions'
                            label={tc('solutions')}
                            disabled={false}
                            fn={(data: any) => {
                                return data.map((item: any) => ({
                                    label:
                                        item.name == 'dlc'
                                            ? 'pro_dlc'
                                            : item.name,
                                    key: item.id,
                                }))
                            }}
                            url='/solutions'
                            transform={(value) => {
                                console.log('value: ', value)
                                return value.map(
                                    (item: MultiSelectOptionsType) => (
                                        <PartnerSolution
                                            solution={
                                                item?.label as PartnerSolutionType
                                            }
                                        />
                                    )
                                )
                            }}
                        />
                    </div>
                </div>

                <div className='flex flex-col justify-end gap-[0.625rem] lg:flex-row'>
                    <CustomButton
                        variant='ghost'
                        title={tcommon('clear')}
                        label={tcommon('clear')}
                        className='h-12 w-fit space-x-2 justify-self-start px-2 py-2 text-primary lg:rounded-full [&>.icon]:ml-0 lg:[&>.label]:hidden'
                        IconRight={Eraser}
                        onClick={() => {
                            form.reset()
                        }}
                        type='reset'
                    />
                    <div className='flex items-center justify-evenly space-x-2'>
                        <CustomButton
                            variant='secondary'
                            label={tcommon('cancel')}
                            onClick={() => {
                                setOpen(false)
                            }}
                            className='h-fit w-full px-5 py-3 lg:w-fit'
                            IconRight={X}
                            type='submit'
                        />
                        <CustomButton
                            label={tcommon('confirm')}
                            onClick={() => {}}
                            className='h-fit w-full px-5 py-3'
                            IconRight={Check}
                            type='submit'
                        />
                    </div>
                </div>
            </form>
        </Form>
    )
}
