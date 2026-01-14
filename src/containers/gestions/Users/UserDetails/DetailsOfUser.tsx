'use client'
import React, { Fragment, useEffect, useState } from 'react'
import { FC } from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { CustomButton } from '@/components/custom/CustomButton'
import { CollaboratorDetailsSchema } from '@/schemas/user-schema'
import { Form, FormField } from '@/components/ui/form'
import { AvatarField } from '@/components/custom/AvatarField'
import { InputFieldForm } from '@/components/custom/InputField'
import { SelectField } from '@/components/custom/SelectField'
import { InputSchedule } from '@/components/utils/InputSchedule'
import { PartnerSolution } from '@/components/utils/PartnerSolution'
import { DayScheduleType } from '@/types/collaborators'
import { PartnerSolutionType } from '@/types/GlobalType'
import { ArrowLeft, Mail, PencilLine, X } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Select } from '@/components/custom/Select'
import { Label } from '@/components/custom/Label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { checkCustomRoutes } from 'next/dist/lib/load-custom-routes'
import { capitalize } from '@/utils/utils'
import { InputPhoneField } from '@/components/custom/InputFieldPhone'
import { Separator } from '@/components/ui/separator'
import FieldRole from './FieldRoles'
import { FilterManager } from '@/components/filters/FilterManger'
import FieldCity from '@/components/filters/FieldCity'
import api from '@/utils/api'
import FieldRegion from '@/components/filters/FieldRegion'
import { MultiSelectField } from '@/components/custom/MultiSelectField'
import { FilterOrganizations } from '@/components/filters/FilterOrganizations'
import { useCollaboratorsTranslations } from '@/hooks/useTranslations'

interface CollaboratorDetailsProps {
  collaborator: z.infer<typeof CollaboratorDetailsSchema>
  disabled?: boolean
  form: UseFormReturn<z.infer<typeof CollaboratorDetailsSchema>>
  onSubmit: (data: any) => void
  handleEdit: () => void
  edit: boolean
  type: string
  id: string
  setCountryCode: React.Dispatch<React.SetStateAction<string>>
  countryCode: string
}

export const CollaboratorDetails: FC<CollaboratorDetailsProps> = ({
  collaborator,
  disabled = false,
  form,
  onSubmit,
  handleEdit,
  edit,
  setCountryCode,
  countryCode,
  type,
  id,
}) => {
  const router = useRouter()
  const tc = useCollaboratorsTranslations()
  const schedules = collaborator.workingHours

  const { control, handleSubmit } = form

  const days: Record<string, string> = {
    MONDAY: tc('form.days.monday'),
    TUESDAY: tc('form.days.tuesday'),
    WEDNESDAY: tc('form.days.wednesday'),
    THURSDAY: tc('form.days.thursday'),
    FRIDAY: tc('form.days.friday'),
    SATURDAY: tc('form.days.saturday'),
    SUNDAY: tc('form.days.sunday'),
  }
  const { cityId, regionId } = form.watch()
  const [address, setAddress] = useState<{
    countryId: string
    cityId: string
    regionId: string
  }>({
    countryId: 'Morocco',
    cityId: cityId,
    regionId: regionId,
  })
  const [options, setOptions] = useState<any>([])
  useEffect(() => {
    const fetchCities = async () => {
      const cities = await api
        .get('/cities/all')
        .then((res) => res.data)
        .catch((err) => {
          console.error('Error fetching cities')
          return []
        })

      setOptions(cities || [])
    }
    if (!options || !options.length) fetchCities()
  }, [collaborator])

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='mb-20 flex w-full flex-col gap-2 lg:mb-4'
      >
        <div className='relative flex h-full w-full flex-col items-center justify-center gap-2 py-14 pt-7 lg:hidden lg:pb-0'>
          <div className='flex w-full items-center justify-start py-4 text-[20px] font-normal text-lynch-400 lg:justify-between'>
            <Separator className='flex-1 bg-lynch-100 lg:hidden' />
            <h1 className='flex-1 text-nowrap text-center lg:flex-initial'>
              {tc('form.profileImage')}
            </h1>
            <Separator className='flex-1 bg-lynch-100 lg:hidden' />
          </div>
          <AvatarField
            form={form}
            name='avatarPath'
            alt='avatar'
            label=''
            className='!rounded-full'
            classNameAvatar='!rounded-full size-[8.125rem] bg-white'
            disabled={disabled}
          />
          {id && collaborator && collaborator.status == 'ACTIVE' && (
            <>
              <CustomButton
                type='button'
                label=''
                size='sm'
                variant='ghost'
                onClick={() => handleEdit()}
                className='absolute right-4 top-1/2 size-11 rounded-full bg-white text-lynch-400 hover:bg-white hover:text-lynch-400 lg:hidden [&>.icon]:mr-0'
                IconLeft={!edit ? PencilLine : X}
              />
            </>
          )}
        </div>
        <Accordion
          type='single'
          collapsible
          className='gap-[30px] rounded-none bg-transparent px-2 py-3 lg:rounded-[14px] lg:bg-white lg:p-5'
          defaultValue='CollaboratorDetails'
        >
          <AccordionItem
            value='CollaboratorDetails'
            className='text-[1.375rem] font-normal text-lynch-400'
          >
            <AccordionTrigger className='flex w-full items-center justify-start gap-x-2 py-4 text-[1.375rem] font-normal lg:justify-between'>
              <Separator className='flex-1 bg-lynch-100 lg:hidden' />
              <h1 className='flex-1 self-start text-nowrap lg:flex-initial'>
                {tc('form.personalInfo')}
              </h1>
              <Separator className='flex-1 bg-lynch-100 lg:hidden' />
            </AccordionTrigger>
            <AccordionContent className='rounded-[14px] bg-white px-4 py-5 pt-7'>
              <div className='flex flex-col items-center justify-center gap-[1.875rem]'>
                <div className='hidden w-fit gap-5 pb-14 lg:flex lg:pb-0'>
                  <AvatarField
                    form={form}
                    name='avatarPath'
                    alt='avatar'
                    label={tc('form.profileImage')}
                    className='!rounded-full'
                    classNameAvatar='!rounded-full size-[8.125rem]'
                    disabled={disabled}
                  />
                </div>
                <div className='flex w-full flex-col items-center gap-3 lg:flex-row'>
                  <SelectField
                    name={'civility'}
                    control={control}
                    label={tc('form.civility')}
                    disabled={disabled}
                    options={['MR', 'MRS'].map((item) => ({
                      key: item,
                      label: item === 'MR' ? tc('form.options.mr') : tc('form.options.mrs'),
                    }))} // Options for the select
                  />
                  <InputFieldForm
                    name={'name.firstName'}
                    control={control}
                    label={tc('form.firstName')}
                    disabled={disabled}
                  />
                  <InputFieldForm
                    name={'name.lastName'}
                    control={control}
                    label={tc('form.lastName')}
                    disabled={disabled}
                  />
                </div>
                <div className='flex w-full flex-col items-center gap-3 lg:flex-row'>
                  <SelectField
                    name={'nationality'}
                    control={control}
                    label={tc('form.nationality')}
                    disabled={disabled}
                    options={['MOROCCAN', 'TUNISIAN'].map((item) => ({
                      key: item,
                      label: item === 'MOROCCAN' ? tc('form.options.moroccan') : tc('form.options.other'),
                    }))} // Options for the select
                  />
                  <InputFieldForm
                    name={'cin'}
                    control={control}
                    label={tc('form.cin')}
                    disabled={disabled}
                  />
                  <FieldRole
                    control={control}
                    name={'roleId'}
                    disabled={disabled}
                  />
                </div>
                <div className='grid w-full grid-flow-row items-center gap-3 lg:grid-flow-col lg:grid-cols-3'>
                  <InputPhoneField
                    name={'phone'}
                    control={control}
                    label={tc('form.phone')}
                    disabled={disabled}
                    placeholder={tc('form.phonePlaceholder')}
                    countryCode={countryCode}
                    onChangeCountryCode={setCountryCode}
                  />
                  <InputFieldForm
                    name={'email'}
                    control={control}
                    label={tc('form.email')}
                    disabled={disabled}
                    IconLeft={Mail}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Accordion
          type='single'
          collapsible
          className='gap-[30px] rounded-none bg-transparent px-2 py-3 lg:rounded-[14px] lg:bg-white lg:p-5'
          defaultValue='CollaboratorDetails'
        >
          <AccordionItem
            value='CollaboratorDetails'
            className='text-[1.375rem] font-normal text-lynch-400'
          >
            <AccordionTrigger className='flex w-full items-center justify-start gap-x-2 py-4 text-[1.375rem] font-normal lg:justify-between'>
              <Separator className='flex-1 bg-lynch-100 lg:hidden' />
              <h1 className='flex-1 self-start text-nowrap lg:flex-initial'>
                {tc('assignment')}
              </h1>
              <Separator className='flex-1 bg-lynch-100 lg:hidden' />
            </AccordionTrigger>
            <AccordionContent className='rounded-[14px] bg-white px-4 py-5 pt-7'>
              <div className='flex flex-col items-center justify-center gap-[1.875rem]'>
                <div className='flex w-full flex-col items-center gap-3 lg:flex-row'>
                  <FilterOrganizations
                    name={'subEntityId'}
                    label={tc('form.responsible')}
                    control={control}
                    disabled={disabled}
                    url='/subentities/all'
                    fn={(data) => {
                      return data.map((item: any) => ({
                        key: item.id,
                        label: item.name,
                        avatar: item.avatarPath,
                      }))
                    }}
                    oneSelect
                  />
                  <InputFieldForm
                    name={'rayon'}
                    control={control}
                    label={tc('department')}
                    disabled={disabled}
                  />
                  <FilterManager
                    control={control}
                    name={'managerId'}
                    label={tc('manager')}
                    disabled={disabled}
                    type={''}
                  />
                </div>
                <div className='flex w-full flex-col items-center gap-3 lg:flex-row'>
                  <FieldCity
                    control={control}
                    name='cityId'
                    label={tc('city')}
                    placeholder={tc('city')}
                    disabled={disabled!}
                    country={address.countryId}
                    options={options}
                    onChange={(value) => {
                      if (!value) return
                      setAddress((prev) => ({
                        ...prev,
                        cityId: value,
                      }))
                    }}
                  />
                  <FieldRegion
                    control={control}
                    name='regionId'
                    label={tc('region')}
                    placeholder={tc('region')}
                    disabled={disabled!}
                    country={address.countryId}
                    city={address.cityId}
                    options={options}
                    onChange={(value) => {
                      if (!value) return
                      setAddress((prev) => ({
                        ...prev,
                        regionId: value,
                      }))
                    }}
                  />
                  <InputFieldForm
                    name={'address'}
                    control={control}
                    label={tc('address')}
                    disabled={disabled}
                  />
                </div>
                <div className='flex w-full grid-cols-3 flex-col items-center gap-3 lg:grid lg:flex-row'>
                  <MultiSelectField
                    control={control}
                    className='col-span-2'
                    name='solutionNames'
                    label={tc('solutions')}
                    options={[
                      PartnerSolutionType.DLC_PRO,
                      PartnerSolutionType.DONATE_PRO,
                      PartnerSolutionType.MARKET_PRO,
                    ].map((solution: string) => {
                      return {
                        label: solution,
                        key: solution == 'pro_dlc' ? 'dlc' : solution,
                      }
                    })}
                    transform={(value) =>
                      value.map((val) => (
                        <>
                          {val.key === 'more' ? (
                            <span className='w-auto rounded-full bg-lynch-200 px-2 text-white'>
                              ...
                            </span>
                          ) : (
                            <PartnerSolution
                              solution={val.label as PartnerSolutionType}
                              size={14}
                            />
                          )}
                        </>
                      ))
                    }
                    disabled={disabled}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Accordion
          type='single'
          collapsible
          className='gap-[30px] rounded-none bg-transparent px-2 py-3 lg:rounded-[14px] lg:bg-white lg:p-5'
          defaultValue='CollaboratorDetails'
        >
          <AccordionItem
            value='CollaboratorDetails'
            className='text-[1.375rem] font-normal text-lynch-400'
          >
            <AccordionTrigger className='flex w-full items-center justify-start gap-x-2 py-4 text-[1.375rem] font-normal lg:justify-between'>
              <Separator className='flex-1 bg-lynch-100 lg:hidden' />

              <h1 className='flex-1 self-start text-nowrap lg:flex-initial'>
                {tc('form.workingHours')}
              </h1>
              <Separator className='flex-1 bg-lynch-100 lg:hidden' />
            </AccordionTrigger>
            <AccordionContent className='grid columns-2 grid-cols-1 gap-x-8 gap-y-5 rounded-[14px] bg-white px-4 py-5 pt-7 lg:grid-cols-2 lg:grid-rows-2'>
              {collaborator.workingHours &&
                Object.entries(collaborator.workingHours).map(
                  ([day, value]) => (
                    <Fragment key={value.dayOfWeek}>
                      <FormField
                        control={control}
                        name={`workingHours.${capitalize(day)}` as any}
                        render={({ field }) => (
                          <div
                            className={`col-span-1 flex flex-col items-center justify-start`}
                          >
                            <div className='flex w-full items-center justify-between gap-3'>
                              <Label
                                label={days[value.dayOfWeek.toUpperCase()]}
                                className='text-lg font-medium text-lynch-400'
                              />
                              <Switch
                                checked={field.value?.selected}
                                onCheckedChange={(checked) => {
                                  field.onChange({
                                    ...field.value,
                                    selected: checked,
                                  })
                                }}
                                className={`${disabled && 'hidden'}`}
                                disabled={field.disabled}
                              />
                            </div>
                            <div className='flex w-full gap-3'>
                              <div className='flex w-full flex-1 flex-col justify-between gap-3'>
                                <Label
                                  label={tc('form.morningHours')}
                                  className='w-full text-sm font-medium text-lynch-950'
                                />
                                <InputSchedule
                                  value={
                                    field.value.selected
                                      ? ({
                                          start: field.value.morningStart,
                                          end: field.value.morningEnd,
                                        } as DayScheduleType['morning'])
                                      : undefined
                                  }
                                  className='min-w-0 text-base text-lynch-400'
                                  onChange={(value) => {
                                    field.onChange({
                                      ...field.value,
                                      morningStart: value.start,
                                      morningEnd: value.end,
                                    })
                                  }}
                                  disabled={disabled || !field.value.selected}
                                />
                              </div>
                              <div className='flex w-full flex-1 flex-col gap-3'>
                                <Label
                                  label={tc('form.afternoonHours')}
                                  className='text-sm font-medium text-lynch-950'
                                />
                                <InputSchedule
                                  value={
                                    field.value.selected
                                      ? ({
                                          start: field.value.afternoonStart,
                                          end: field.value.afternoonEnd,
                                        } as DayScheduleType['afternoon'])
                                      : undefined
                                  }
                                  className='min-w-0 text-base text-lynch-400'
                                  onChange={(value) => {
                                    field.onChange({
                                      ...field.value,
                                      afternoonStart: value.start,
                                      afternoonEnd: value.end,
                                    })
                                  }}
                                  disabled={disabled || !field.value.selected}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      />
                      <Separator className='mt-5 flex bg-lynch-100 lg:hidden' />
                    </Fragment>
                  )
                )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </form>
    </Form>
  )
}
