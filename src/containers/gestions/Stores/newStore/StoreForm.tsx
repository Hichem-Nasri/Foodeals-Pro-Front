import { AvatarField } from '@/components/custom/AvatarField'
import { InputFieldForm } from '@/components/custom/InputField'
import { InputPhoneField } from '@/components/custom/InputFieldPhone'
import { MultiSelectField } from '@/components/custom/MultiSelectField'
import FieldCity from '@/components/filters/FieldCity'
import FieldCountry from '@/components/filters/FieldCountry'
import FieldRegion from '@/components/filters/FieldRegion'
import SelectManager from '@/components/filters/SelectManager'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Form } from '@/components/ui/form'
import { IframeRenderer } from '@/components/utils/IframeRenderer'
import { PartnerSolution } from '@/components/utils/PartnerSolution'
import { StoreSchema, StoreType } from '@/schemas/gestion/store-schema'
import { Collaborator, PartnerSolutionType } from '@/types/GlobalType'
import { ChevronDown, Mail, PencilLine, X } from 'lucide-react'
import React, { FC, useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import ResponsibleSelect from './ResponsibleSelect'
import CustomLabel from '@/components/custom/CustomLabel'
import FieldActivities from '@/components/utils/FieldActivities'
import { MultiSelectOptionsType } from '@/components/tools/MultiSelect'
import { getCities } from '@/actions/global'
import { CustomButton } from '@/components/custom/CustomButton'
import { LabelAndAvatar } from '@/components/custom/LabelAndAvatar'
import api from '@/utils/api'

interface FormStoreProps {
  store: StoreType
  form: UseFormReturn<z.infer<typeof StoreSchema>>
  onSubmit: (data: z.infer<typeof StoreSchema>) => void
  setCountryCode: (value: string) => void
  countryCode: string
  disabled?: boolean
  handleEdit?: () => void
  state: boolean
  id: string
  saved: boolean
  t: (key: string) => string
}

export const FormStore: FC<FormStoreProps> = ({
  store,
  form,
  onSubmit,
  countryCode,
  setCountryCode,
  disabled,
  handleEdit,
  state,
  id,
  saved,
  t,
}) => {
  const { handleSubmit, control } = form
  const [open, setOpen] = useState(false)
  const [selectedUsers, setSelectedUsers] = React.useState<Collaborator | null>(
    id && store?.managerData
      ? {
          id: store.managerData.id!,
          name: store.managerData.name!,
          avatar: store.managerData.avatarPath!,
          role: store.managerData.role!,
        }
      : null
  )
  const { countryId, cityId, regionId } = store
  const [address, setAddress] = useState<{
    countryId: string
    cityId: string
    regionId: string
  }>({
    countryId: countryId,
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
  }, [store, address.countryId])

  const handleCollaborator = (collaborateur: any) => {
    form.setValue('managerId', collaborateur.id)
    setSelectedUsers(collaborateur)
    setOpen(false)
  }
  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='w-full py-6 lg:p-0 lg:px-0 lg:py-0'
      >
        <ResponsibleSelect
          open={open}
          setOpen={setOpen}
          handleCollaborator={handleCollaborator}
        />
        <div className='relative flex h-auto gap-10 pb-14 lg:hidden lg:pb-0'>
          <AvatarField
            disabled={disabled}
            form={form}
            name='avatarPath'
            alt='Logo'
            label={t('form.logoImage')}
            className='absolute -bottom-8 left-1/2 z-10 -translate-x-1/2 lg:static lg:translate-x-0'
            classNameAvatar='rounded-full lg:rounded-[24px] bg-white'
          />
          <AvatarField
            disabled={disabled}
            form={form}
            name='coverPath'
            alt='cover'
            label={t('form.coverPhoto')}
            className='w-full lg:w-fit'
            classNameAvatar='lg:h-[223px] h-[160px] lg:w-[740px] w-full rounded-[24px] bg-white'
          />
          {id && store && saved && (
            <>
              <CustomButton
                type='button'
                label=''
                size='sm'
                variant='ghost'
                onClick={() => handleEdit && handleEdit()}
                className='absolute bottom-0 right-4 size-11 rounded-full bg-white text-lynch-400 hover:bg-white hover:text-lynch-400 lg:hidden [&>.icon]:mr-0'
                IconLeft={state ? PencilLine : X}
              />
            </>
          )}
        </div>
        <Accordion
          type='single'
          collapsible
          className='mt-10 w-full gap-4 bg-transparent lg:mt-0 lg:rounded-[18px] lg:bg-white lg:p-4'
          defaultValue='partnerInfo'
        >
          <AccordionItem
            value='partnerInfo'
            className='text-[1.375rem] font-normal text-lynch-400'
          >
            <AccordionTrigger className='flex w-full items-center justify-between gap-2 py-4 text-[1.375rem] font-normal [&>.icon]:hidden lg:[&>.icon]:flex'>
              <hr className='flex h-[1px] w-full bg-lynch-100 lg:hidden' />

              <h1 className='mx-4 w-full flex-1 text-nowrap text-lg lg:w-fit lg:flex-none lg:text-[1.375rem]'>
                {t('form.storeInformation')}
              </h1>
              <hr className='flex h-[1px] w-full bg-lynch-100 lg:hidden' />
            </AccordionTrigger>
            <AccordionContent className='h-full w-full rounded-[18px] bg-white p-4 pt-7 lg:rounded-none lg:bg-transparent lg:p-0'>
              <div className='flex h-auto flex-col gap-[1.875rem]'>
                <div className='relative hidden h-auto gap-10 pb-14 lg:flex lg:pb-0'>
                  <AvatarField
                    disabled={disabled}
                    form={form}
                    name='avatarPath'
                    alt='Logo'
                    label={t('form.logoImage')}
                    className='absolute -bottom-8 left-1/2 z-10 -translate-x-1/2 lg:static lg:translate-x-0'
                    classNameAvatar='rounded-full lg:rounded-[24px]'
                  />
                  <AvatarField
                    disabled={disabled}
                    form={form}
                    name='coverPath'
                    alt='cover'
                    label={t('form.coverPhoto')}
                    className='w-full lg:w-fit'
                    classNameAvatar='lg:h-[223px] h-[160px] lg:w-[740px] w-full rounded-[24px]'
                  />
                </div>
                <div className='flex flex-col gap-[1.875rem]'>
                  <div className='flex flex-col items-start gap-3 lg:flex-row'>
                    <InputFieldForm
                      label={t('form.socialReason')}
                      name='name'
                      control={control}
                      placeholder={t('form.socialReasonPlaceholder')}
                      disabled={disabled}
                    />
                    <FieldActivities
                      control={control}
                      name='activiteNames'
                      label={t('form.type')}
                      disabled={disabled!}
                      type='PARTNER'
                    />
                    {/* <InputFieldForm
                                            control={control}
                                            name='activiteNames'
                                            label='Type'
                                            placeholder='Nom du responsable'
                                            disabled={disabled}
                                        /> */}
                    {selectedUsers ? (
                      <LabelAndAvatar
                        name={selectedUsers.name}
                        avatar={selectedUsers.avatar!}
                        onClick={() => setOpen(true)}
                        className='cursor-pointer justify-normal'
                        classNameParent='[&>.icon]:!text-lynch-100'
                        IconRight={ChevronDown}
                        onChange={() => {}}
                        value={selectedUsers.name}
                        label={t('form.responsible')}
                      />
                    ) : (
                      <CustomLabel
                        label={t('form.responsible')}
                        input={t('form.responsible')}
                        onClick={() => setOpen(true)}
                        className='cursor-pointer justify-between [&>.icon]:text-lynch-300'
                        IconRight={ChevronDown}
                      />
                    )}
                    {/* <InputFieldForm
                                            control={control}
                                            name='responsible'
                                            label='Responsable'
                                            placeholder='Nom du responsable'
                                            disabled={disabled}
                                        /> */}
                  </div>
                  <div className='flex flex-col items-start gap-3 lg:flex-row'>
                    <InputPhoneField
                      control={control}
                      name='phone'
                      label={t('form.telephone')}
                      placeholder={t('form.telephonePlaceholder')}
                      countryCode={countryCode}
                      onChangeCountryCode={setCountryCode}
                      disabled={disabled}
                    />
                    <InputFieldForm
                      IconLeft={Mail}
                      label={t('form.email')}
                      name='email'
                      control={control}
                      placeholder={t('form.emailPlaceholder')}
                      disabled={disabled}
                    />
                    <MultiSelectField
                      control={control}
                      name='solutionNames'
                      label={t('form.solutions')}
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
                      len={2}
                      disabled={disabled}
                    />
                  </div>
                  <div className='flex flex-col items-start gap-3 lg:flex-row'>
                    <FieldCountry
                      control={control}
                      name='countryId'
                      label={t('form.country')}
                      placeholder={t('form.countryPlaceholder')}
                      disabled={disabled!}
                      country={address.countryId}
                      onChange={(value) => {
                        if (!value) return

                        setAddress((prev) => ({
                          ...prev,
                          countryId: value,
                        }))
                      }}
                    />
                    <FieldCity
                      control={control}
                      name='cityId'
                      label={t('form.city')}
                      placeholder={t('form.cityPlaceholder')}
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
                      label={t('form.region')}
                      placeholder={t('form.regionPlaceholder')}
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
                  </div>
                  <div className='flex grid-cols-3 flex-col items-start gap-3 lg:grid lg:flex-row'>
                    <InputFieldForm
                      label='Adresse'
                      name='exactAdresse'
                      control={control}
                      classNameParent='col-span-2'
                      placeholder='Saisir l’adresse'
                      disabled={disabled}
                    />
                  </div>
                  <IframeRenderer
                    name='iFrame'
                    form={form}
                    disabled={disabled}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </form>
    </Form>
  )
}
