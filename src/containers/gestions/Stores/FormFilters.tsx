import React, { FC, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { SchemaFilter } from '@/schemas/global-schema'
import { Check, Eraser, ListFilter, Mail, PhoneCall, X } from 'lucide-react'
import { CustomButton } from '@/components/custom/CustomButton'
import { InputFieldForm } from '@/components/custom/InputField'
import MobileHeader from '@/components/custom/MobileHeader'
import { SelectField } from '@/components/custom/SelectField'
import { DateFilter } from '@/components/filters/DateFilters'
import { FilterCity } from '@/components/filters/FilterCity'
import { FilterManager } from '@/components/filters/FilterManger'
import { FilterMultiSelect } from '@/components/filters/FilterMultiSelect'
import { FilterOrganizations } from '@/components/filters/FilterOrganizations'
import { MultiSelectOptionsType } from '@/components/tools/MultiSelect'
import { PartnerSolution } from '@/components/utils/PartnerSolution'
import { PartnerSolutionType } from '@/types/GlobalType'
import { capitalize } from '@/utils/utils'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { Form } from '@/components/ui/form'
import { useStoresTranslations, useCommonTranslations } from '@/hooks/useTranslations'

interface FormFilterProps {
  form: UseFormReturn<z.infer<typeof SchemaFilter>>
  onSubmit: (data: z.infer<typeof SchemaFilter>) => void
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  open: boolean
  archive: boolean
}

export const FormFilter: FC<FormFilterProps> = ({
  form,
  onSubmit,
  setOpen,
  open,
  archive,
}) => {
  const t = useStoresTranslations()
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className='my-4 flex items-center gap-3 text-nowrap rounded-full border-0 border-lynch-200 bg-white p-4 text-sm font-medium text-lynch-500 hover:bg-neutral-100 hover:text-black lg:my-0 lg:rounded-[12px] lg:border lg:px-5 lg:py-3'>
        <span className='hidden lg:inline-flex'>{t('filterBy')}</span>
        <ListFilter />
      </DialogTrigger>
      <DialogContent className='max-h-screen w-full min-w-full max-w-full gap-[1.875rem] overflow-auto rounded-none p-0 lg:min-w-fit lg:max-w-[36.25rem] lg:rounded-[14px] lg:p-5 [&>.Icon]:hidden'>
        <FormAssociation
          form={form}
          onSubmit={onSubmit}
          setOpen={setOpen}
          archive={archive}
        />
      </DialogContent>
    </Dialog>
  )
}

interface FormAssociationProps {
  form: UseFormReturn<z.infer<typeof SchemaFilter>>
  onSubmit: (data: z.infer<typeof SchemaFilter>) => void
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  archive: boolean
  type?: string
}

const FormAssociation: FC<FormAssociationProps> = ({
  form,
  onSubmit,
  setOpen,
  archive,
  type,
}) => {
  const { handleSubmit, control } = form
  const t = useStoresTranslations()
  const ct = useCommonTranslations()
  
  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex min-h-full w-full flex-col gap-2 bg-white'
      >
        <DialogTitle className='hidden text-[1.375rem] font-normal text-lynch-400 lg:flex'>
          {t('filterBy')}
        </DialogTitle>
        <MobileHeader
          title={t('filterBy')}
          onClick={() => {}}
          buttonType='dialog'
        />
        <div className='flex flex-col gap-2 gap-x-4 p-5'>
          <DateFilter form={form} disabled={false} />
          <div className='flex w-full flex-col gap-3 lg:flex-row'>
            <FilterOrganizations
              control={control}
              name='raisonSociale'
              label={t('socialReason')}
              placeholder={t('selectStore')}
              fn={(data: any) => {
                return !data
                  ? []
                  : data?.content.map((val: any) => ({
                      key: val.name,
                      label: val.name,
                      avatar: val.avatarPath,
                    }))
              }}
              url='/subentities/filter?raisonSociale=:search&size=10&page=0'
              withSearch='/subentities?pageNum=0&pageSize=10'
              oneSelect
            />
            <FilterOrganizations
              control={control}
              name='mangerId'
              label={t('responsible')}
              placeholder={t('selectManager')}
              fn={(data: any) => {
                return !data
                  ? []
                  : data?.content.map((val: any) => ({
                      key: val.id,
                      label: val.name.firstName + ' ' + val.name.lastName,
                      avatar: val.avatarPath,
                    }))
              }}
              url='/users/search?name=:search&page=0&size=5&sort=name,asc'
              oneSelect
            />
          </div>
          <div className='flex w-full flex-col gap-3 lg:flex-row'>
            <InputFieldForm
              control={control}
              name='email'
              label={t('email')}
              placeholder={t('enterEmail')}
              IconLeft={Mail}
            />
            <InputFieldForm
              control={control}
              name='phone'
              label={t('phone')}
              placeholder={t('enterPhone')}
              IconLeft={PhoneCall}
            />
          </div>
          <div className='flex w-full flex-col gap-3 text-sm lg:flex-row'>
            <FilterOrganizations
              control={control}
              name='cityId'
              label={t('city')}
              placeholder={t('selectCity')}
              fn={(data: any) => {
                return !data
                  ? []
                  : data?.map((val: any) => ({
                      key: val.id,
                      label: val.name,
                    }))
              }}
              url='/cities/all'
              oneSelect
            />
            <FilterOrganizations
              control={control}
              name='solutions'
              label={t('solutions')}
              disabled={false}
              fn={(data: any) => {
                return data.map((item: any) => ({
                  label: item.name == 'dlc' ? 'pro_dlc' : item.name,
                  key: item.id,
                }))
              }}
              url='/solutions'
              transform={(value) => {
                console.log('value: ', value)
                return value.map((item: MultiSelectOptionsType) => (
                  <PartnerSolution
                    solution={item?.label as PartnerSolutionType}
                  />
                ))
              }}
            />
          </div>
        </div>

        <div className='sticky bottom-0 left-0 z-40 flex flex-col justify-end gap-[0.625rem] rounded-t-[18px] bg-white p-5 lg:relative lg:flex-row lg:bg-transparent'>
          <CustomButton
            variant='ghost'
            title={t('resetFilters')}
            label={ct('clear')}
            className='h-12 w-fit gap-2 px-2 py-2 text-primary lg:gap-0 lg:rounded-full [&>.icon]:mr-0 lg:[&>.label]:hidden'
            IconLeft={Eraser}
            onClick={() => {
              form.reset()
              form.setValue('startDate', undefined)
              form.setValue('endDate', undefined)
            }}
            type='reset'
          />
          <div className='flex items-center justify-evenly space-x-2'>
            <CustomButton
              variant='secondary'
              label={ct('cancel')}
              onClick={() => {
                setOpen(false)
              }}
              className='h-fit w-full px-5 py-3 lg:w-fit'
              IconRight={X}
              type='submit'
            />
            <CustomButton
              label={ct('confirm')}
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
