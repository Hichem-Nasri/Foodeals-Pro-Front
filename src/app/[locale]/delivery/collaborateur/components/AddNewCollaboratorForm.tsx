'use client'

import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Checkbox } from '@/components/ui/checkbox'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, UseFormReturn } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { AvatarProfile } from '@/components/tools/AvatarProfile'
import {
  Check,
  CheckCheck,
  CircleCheckBig,
  ImagePlus,
  Mail,
  PhoneCall,
  Save,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import TitleDevider from '@/components/utils/TitleDevider'
import {
  type AddCollabFormType,
  addCollabFormDefaultValues,
  AddCollabFormSchema,
  horaire_fields,
  PostNewCollabApiShapeType,
  WorkScheduleType,
} from './AddNewCollabISchema'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { InputSchedule } from '@/components/utils/InputSchedule'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { collabFormQueries } from '@/hooks/delivery/queries/collaborator-options-queries'
import { roleFrenchName, Roles } from '@/types/GlobalType'
import DealBadge from '@/components/custom/DealBadge'
import { DevTool } from '@hookform/devtools'
import SelectWithAvatar from '@/components/custom/SelectWithAvatar'
import { getFrenchDay, WeekDays } from '@/types/collaboratorsUtils'
import { useMutation } from '@tanstack/react-query'
import api from '@/utils/api'
import { useEffect } from 'react'
import { AxiosError } from 'axios'
import { CreatedSuccessfullyDialog } from '../../components/Dialogs'
import { DeliveryRoutes } from '@/lib/routes'
import { useRouter } from 'next/navigation'
import {
  ColorsT,
  getActiveColorClassName,
} from '@/utils/getActiveColorClassName'
import { useDeliveryTranslations, useCommonTranslations } from '@/hooks/useTranslations'

export default function AddnewCollabForm({
  defaultValues = addCollabFormDefaultValues,
  showForm = false,
  idDefaultDataLoading = false,
}: {
  defaultValues?: AddCollabFormType
  showForm?: boolean
  idDefaultDataLoading?: boolean
}) {
  const router = useRouter()
  const t = useDeliveryTranslations()
  const tCommon = useCommonTranslations()
  const [citiesQuery, rolesQuery, solutionsQuery, managersQuery] =
    collabFormQueries(!showForm)

  const form = useForm<AddCollabFormType>({
    resolver: zodResolver(AddCollabFormSchema),
    defaultValues: defaultValues,
    disabled: showForm,
  })

  // console.log(defaultValues)
  const createNewCollab = async (
    data: PostNewCollabApiShapeType,
    collabId?: string
  ) => {
    const formData = new FormData()

    const { avatarPath, ...rest } = data.collaborator
    const blob = new Blob([JSON.stringify({ ...rest, avatarPath: null })], {
      type: 'application/json',
    })

    formData.append('collaborator', blob)
    formData.append('profilImage', data.profilImage || '')

    const url = collabId
      ? `/users/collaborators/update/${collabId}`
      : '/users/collaborators/add'

    const method = collabId ? 'patch' : 'post'
    try {
      const res = await api({ url, method, data: formData })
      return res.data
    } catch (e) {
      throw e
    }
  }

  const {
    error,
    isError,
    data: createdCollabResData,
    isPending,
    mutate: addCollabMutate,
    isSuccess,
  } = useMutation({
    mutationKey: ['add-new-collab'],
    mutationFn: createNewCollab,
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          form.setError('email', {
            message: t('collaborators.form.emailExists'),
          })
          form.setFocus('email')
        }
      }
    },
  })

  const onSubmit = (data: AddCollabFormType) => {
    const formatData: PostNewCollabApiShapeType = {
      collaborator: {
        name: {
          firstName: data.firstName,
          lastName: data.lastName,
        },
        email: data.email,
        phone: data.phone,
        roleId: data.role,
        subEntityId: null,
        civility: data.civility,
        cin: data.cin,
        nationality: data.nationality,
        cityId: data.city,
        managerId: data.manager,
        rayon: 'xxx',
        solutionNames: data.solution,
        address: data.address,
        isEmailVerified: true,
        organizationEntityId: null, // Todo: replace Org id from session
        coveredZonesIds: null,
        password: null,
        workSchedules: data.workSchedules.reduce((acc, curr) => {
          if (curr.enabled) {
            acc.push({
              dayOfWeek: curr.day,
              morningStart: curr.morning?.start,
              morningEnd: curr.morning?.end,
              afternoonStart: curr.afternoon?.start,
              afternoonEnd: curr.afternoon?.end,
            })
          }
          return acc
        }, [] as WorkScheduleType[]),
        avatarPath: null,
      },
      profilImage: data.avatarPath,
    }

    console.log(formatData)
    addCollabMutate(formatData)
  }

  useEffect(() => {
    if (error) {
      console.log(error)
    }
  }, [error])
  useEffect(() => {
    if (isSuccess) {
      console.log('success')
      setTimeout(() => {
        router.push(`${DeliveryRoutes.collaborator}/${createdCollabResData.id}`)
      }, 2000)
    }
  }, [isSuccess])
  return (
    <Form {...form}>
      <DevTool control={form.control} placement='top-left' />
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col gap-5 pt-5 max-lg:px-2'
      >
        {/* Upload Profile pic starts here */}
        <TitleDevider title={t('collaborators.form.profilePhoto')} />
        <CreatedSuccessfullyDialog isOpen={isSuccess} />
        <FormField
          control={form.control}
          name='avatarPath'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <AvatarProfile
                  onChange={(file) => field.onChange(file)}
                  iUrl={field.value as string}
                  alt={t('collaborators.form.profilePhotoAlt')}
                  className={cn(
                    'mx-auto size-[110px] border-[3px] border-lynch-100 bg-white lg:rounded-full',
                    { 'cursor-auto': showForm }
                  )}
                  Icon={<ImagePlus size={35} />}
                  disabled={showForm}
                />
              </FormControl>
              <FormMessage className='text-center' />
            </FormItem>
          )}
        />
        {/* Upload Profile pic end here */}

        {/* Informations personnel */}
        <Accordion
          type='single'
          collapsible
          className='w-full'
          defaultValue='item-1'
          disabled={!showForm}
        >
          <AccordionItem value='item-1'>
            <AccordionTrigger
              classNameArrow={cn('size-7 text-lynch-300 ', {
                hidden: !showForm,
              })}
              className={cn({ 'gap-3': showForm })}
            >
              <TitleDevider
                title={t('collaborators.form.personalInfo')}
                position={showForm ? 'left' : 'center'}
              />
            </AccordionTrigger>
            <AccordionContent>
              <section className='flex grid-cols-3 flex-col gap-6 rounded-[30px] bg-white px-4 py-6 lg:grid'>
                <FromFieldSelect
                  form={form}
                  disabled={showForm}
                  label={t('collaborators.form.civility')}
                  placeholder={t('collaborators.form.select')}
                  name='civility'
                >
                  <SelectItem value='MR'>{t('collaborators.form.mister')}</SelectItem>
                  <SelectItem value='MRS'>{t('collaborators.form.madam')}</SelectItem>
                </FromFieldSelect>

                <FormFieldInput
                  name='lastName'
                  label={t('collaborators.form.lastName')}
                  placeholder={t('collaborators.form.lastNamePlaceholder')}
                  form={form}
                  disabled={showForm}
                />

                <FormFieldInput
                  name='firstName'
                  label={t('collaborators.form.firstName')}
                  placeholder={t('collaborators.form.firstNamePlaceholder')}
                  form={form}
                  disabled={showForm}
                />

                <FromFieldSelect
                  form={form}
                  disabled={showForm}
                  label={t('collaborators.form.nationality')}
                  name='nationality'
                >
                  <SelectItem value='MOROCCAN'>{t('collaborators.form.moroccan')}</SelectItem>
                  <SelectItem value='TUNISIAN'>{t('collaborators.form.tunisian')}</SelectItem>
                </FromFieldSelect>

                <FormFieldInput
                  name='cin'
                  label='CIN'
                  placeholder={t('collaborators.form.cinPlaceholder')}
                  form={form}
                  disabled={showForm}
                />

                <FromFieldSelect
                  form={form}
                  disabled={showForm}
                  label={t('collaborators.form.role')}
                  name='role'
                  placeholder={t('collaborators.form.selectRole')}
                >
                  {rolesQuery.isLoading && <span>{tCommon('loading')}</span>}
                  {rolesQuery.data &&
                    rolesQuery.data.map((role) => (
                      <SelectItem
                        className='capitalize'
                        value={role.id}
                        key={role.id}
                      >
                        {roleFrenchName[role.name]}
                      </SelectItem>
                    ))}
                </FromFieldSelect>

                <FormFieldInput
                  name='phone'
                  label={t('collaborators.form.phone')}
                  placeholder='+212'
                  type='tel'
                  form={form}
                  disabled={showForm}
                  color='purple'
                />

                <FormFieldInput
                  name='email'
                  label='Email'
                  type='email'
                  placeholder={t('collaborators.form.emailPlaceholder')}
                  form={form}
                  disabled={showForm}
                  color='purple'
                />

                <FromFieldSelect
                  name='city'
                  form={form}
                  disabled={showForm}
                  label={t('collaborators.form.city')}
                  placeholder={t('collaborators.form.select')}
                >
                  {citiesQuery.isLoading && <span>{tCommon('loading')}</span>}
                  {citiesQuery.data &&
                    citiesQuery.data.map((city) => (
                      <SelectItem
                        className='capitalize'
                        value={city.id}
                        key={city.id}
                      >
                        {city.name}
                      </SelectItem>
                    ))}
                </FromFieldSelect>

                <FormFieldInput
                  name='address'
                  label={t('collaborators.form.address')}
                  placeholder={t('collaborators.form.addressPlaceholder')}
                  form={form}
                  disabled={showForm}
                />
              </section>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Affectation */}
        <Accordion
          type='single'
          collapsible
          className='w-full'
          defaultValue='item-1'
          disabled={!showForm}
        >
          <AccordionItem value='item-1'>
            <AccordionTrigger
              classNameArrow={cn('size-7 text-lynch-300 ', {
                hidden: !showForm,
              })}
              className={cn({ 'gap-3': showForm })}
            >
              <TitleDevider
                title={t('collaborators.form.assignment')}
                position={showForm ? 'left' : 'center'}
              />
            </AccordionTrigger>
            <AccordionContent>
              <section className='flex grid-cols-3 flex-col gap-6 rounded-[30px] bg-white px-4 py-6 lg:grid'>
                <FormField
                  control={form.control}
                  name='manager'
                  disabled={showForm}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-sm'>{t('collaborators.form.manager')}</FormLabel>
                      <FormControl>
                        {field.disabled ? (
                          <div className='rounded-xl bg-lynch-50 px-3 py-4 text-lynch-500'>
                            {field.value || t('collaborators.form.select')}
                          </div>
                        ) : (
                          <SelectWithAvatar
                            control={form.control}
                            options={managersQuery.data || []}
                            id='manager'
                            placeholder={t('collaborators.form.select')}
                            {...field}
                          />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogCheckBoxes
                  disabled={showForm}
                  form={form}
                  label={t('collaborators.form.solution')}
                  title={t('collaborators.form.selectSolution')}
                  name='solution'
                  placeholder={t('collaborators.form.select')}
                  options={solutionsQuery.data || []}
                />

                <DialogCheckBoxes
                  disabled={showForm}
                  form={form}
                  label={t('collaborators.form.coverageZone')}
                  title={t('collaborators.form.selectZones')}
                  name='zone'
                  placeholder={t('collaborators.form.select')}
                  options={[]}
                />
              </section>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Horaire du travail */}

        <Accordion
          type='single'
          collapsible
          className='w-full'
          defaultValue='item-1'
          disabled={!showForm}
        >
          <AccordionItem value='item-1'>
            <AccordionTrigger
              classNameArrow={cn('size-7 text-lynch-300 ', {
                hidden: !showForm,
              })}
              className={cn({ 'gap-3': showForm })}
            >
              <TitleDevider
                title={t('collaborators.form.workSchedule')}
                position={showForm ? 'left' : 'center'}
              />
            </AccordionTrigger>
            <AccordionContent>
              <section className='flex grid-cols-2 flex-col gap-x-8 gap-y-6 rounded-[30px] bg-white px-4 py-6 lg:grid'>
                <HoraireSection form={form} disabled={showForm} />
              </section>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className='flex items-center gap-2.5 rounded-3xl bg-white p-3 max-lg:rounded-bl-none max-lg:rounded-br-none lg:shadow-[#434E610F_0px_-5px_15px]'>
          {showForm ? (
            <Button
              variant={'destructive'}
              className='flex flex-1 items-center gap-3 border-coral-500 uppercase text-coral-500'
            >
              <span>{t('collaborators.form.archive').toUpperCase()}</span>
              <CheckCheck />
            </Button>
          ) : (
            <>
              <Button
                className='flex flex-1 items-center gap-3 uppercase'
                type='submit'
                variant={'outline'}
              >
                <span>{t('collaborators.form.save').toUpperCase()}</span>
                <Save />
              </Button>
              <Button
                className='flex flex-1 items-center gap-3 uppercase'
                type='submit'
              >
                <span>{t('collaborators.form.confirm').toUpperCase()}</span>
                <CircleCheckBig />
              </Button>
            </>
          )}
        </div>
      </form>
    </Form>
  )
}

export function CheckBoxOptions({
  form,
  name,
  options,
  disabled = false,
}: {
  form: UseFormReturn<AddCollabFormType>
  name: keyof Pick<AddCollabFormType, 'zone' | 'solution'>
  options: { id: string; name: string }[]
  disabled?: boolean
}) {
  const t = useDeliveryTranslations()
  
  return (
    <Command>
      <div className='mb-3 flex items-center rounded-xl bg-lynch-50 text-base'>
        <CommandInput
          className='flex-1 text-lynch-500 placeholder:text-lynch-300'
          classNameParent='flex-1 px-3 '
          placeholder={t('collaborators.form.searchZone')}
        />
      </div>

      <CommandEmpty>{t('collaborators.form.noResults')}</CommandEmpty>
      <FormField
        control={form.control}
        name={name}
        render={() => (
          <CommandList>
            {options.map((item) => (
              <CommandItem className='p-0 py-0.5'>
                <FormField
                  key={item.id}
                  control={form.control}
                  name={name}
                  disabled={disabled}
                  render={({ field }) => {
                    const isChecked = field.value?.includes(item.name)
                    return (
                      <FormItem
                        key={item.id}
                        className={cn(
                          'flex w-full items-center rounded-[6px] px-4',
                          {
                            'bg-mountain-500 text-white': isChecked,
                          }
                        )}
                      >
                        <FormControl>
                          <Checkbox
                            className='data-[state=checked]:border-white data-[state=checked]:bg-white data-[state=checked]:text-mountain-500'
                            Icon={<Check size={10} strokeWidth={5} />}
                            checked={isChecked}
                            onCheckedChange={(checked) =>
                              checked
                                ? field.onChange([
                                    ...(field.value || []),
                                    item.name,
                                  ])
                                : field.onChange(
                                    (field.value as string[])?.filter(
                                      (value) => value !== item.name
                                    )
                                  )
                            }
                          />
                        </FormControl>
                        <FormLabel className='!mt-0 h-full flex-1 cursor-pointer py-3 pl-3 text-sm font-normal capitalize'>
                          {item.name.replace('_', ' ')}
                        </FormLabel>
                      </FormItem>
                    )
                  }}
                />
              </CommandItem>
            ))}

            <FormMessage />
          </CommandList>
        )}
      />
    </Command>
  )
}

function FormFieldInput({
  form,
  name,
  disabled,
  type = 'text',
  label,
  placeholder,
  color = 'green',
}: {
  form: UseFormReturn<AddCollabFormType>
  name: keyof Pick<
    AddCollabFormType,
    'firstName' | 'lastName' | 'cin' | 'phone' | 'email' | 'address'
  >
  disabled: boolean
  type?: 'text' | 'tel' | 'email'
  label: string
  placeholder?: string
  color?: ColorsT
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      disabled={disabled}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <div
            className={cn(
              'flex items-center rounded-xl bg-lynch-50',
              type !== 'text' && 'pl-3'
            )}
          >
            {type !== 'text' && (
              <FormLabel>
                {type === 'tel' && (
                  <PhoneCall className={getActiveColorClassName(color)} />
                )}
                {type === 'email' && (
                  <Mail className={getActiveColorClassName(color)} />
                )}
              </FormLabel>
            )}
            <FormControl>
              <Input placeholder={placeholder || label} {...field} />
            </FormControl>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

function FromFieldSelect({
  form,
  name,
  disabled,
  label,
  placeholder,
  children,
}: {
  form: UseFormReturn<AddCollabFormType>
  name: keyof Pick<
    AddCollabFormType,
    'civility' | 'nationality' | 'role' | 'city' | 'manager' | 'address'
  >
  disabled: boolean
  label: string
  placeholder?: string
  children: React.ReactNode
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      disabled={disabled}
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            {field.disabled ? (
              <div className='rounded-xl bg-lynch-50 px-3 py-4 capitalize text-lynch-500'>
                {field.name === 'role'
                  ? roleFrenchName[field.value as Roles] || placeholder || label
                  : field.value || placeholder || label}
              </div>
            ) : (
              <>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={field.disabled}
                >
                  <FormControl>
                    <SelectTrigger
                      className='text-lynch-400'
                      disabled={field.disabled}
                    >
                      <SelectValue placeholder={placeholder || label} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>{children}</SelectContent>
                </Select>
                <FormMessage />
              </>
            )}
          </FormItem>
        )
      }}
    />
  )
}

function DialogCheckBoxes({
  form,
  name,
  disabled,
  label,
  placeholder,
  title,
  options,
}: {
  form: UseFormReturn<AddCollabFormType>
  name: keyof Pick<AddCollabFormType, 'zone' | 'solution'>
  disabled: boolean
  label: string
  placeholder?: string
  title: string
  options: { id: string; name: string }[]
}) {
  const selectedOptions = form.watch(name)
  return (
    <Dialog>
      <DialogTrigger
        className='flex flex-col gap-2 text-left'
        disabled={disabled}
      >
        {/* <div> */}
        <label className='w-full text-sm font-medium text-lynch-950'>
          {label}
        </label>
        <div className='flex w-full flex-wrap items-center gap-2 rounded-xl bg-lynch-50 px-3 py-4 text-lynch-400'>
          {selectedOptions && selectedOptions.length > 0 ? (
            selectedOptions.map((option, i) => {
              if (option === 'dlc')
                return <DealBadge key={i} badgeVariant='PRO_DLC' />

              if (option === 'pro_market')
                return <DealBadge key={i} badgeVariant='PRO_MARKET' />

              if (option === 'pro_donate')
                return (
                  <DealBadge
                    key={i}
                    badgeVariant='DONATE_CLIENT'
                    text='Pro Donate'
                  />
                )
              return (
                <span
                  key={i}
                  className='inline-block text-nowrap rounded-xl bg-lynch-100 px-3 py-1.5 text-[10px] font-bold uppercase text-lynch-500'
                >
                  {option}
                </span>
              )
            })
          ) : (
            <span>{placeholder}</span>
          )}
        </div>
        {/* </div> */}
      </DialogTrigger>
      <DialogContent
        className='max-w-[370px] rounded-3xl p-4 text-lynch-950'
        showContent={false}
      >
        <DialogHeader>
          <DialogTitle className='text-left text-sm font-medium'>
            {title}
          </DialogTitle>
        </DialogHeader>

        <CheckBoxOptions
          form={form}
          name={name}
          options={options || []}
          disabled={disabled}
        />
      </DialogContent>
    </Dialog>
  )
}
function HoraireSection({
  form,
  disabled = false,
}: {
  form: UseFormReturn<AddCollabFormType>
  disabled?: boolean
}) {
  return (
    <>
      {horaire_fields.days.map((data, index) => (
        <div key={data.day}>
          <div className='mb-3 flex items-center justify-between'>
            <h3 className='text-lg capitalize text-lynch-400'>
              {getFrenchDay[data.day]}
            </h3>
            {!disabled && (
              <FormField
                control={form.control}
                name={`workSchedules.${index}.enabled`}
                disabled={disabled}
                render={({ field }) => {
                  if (!form.watch(`workSchedules.${index}.enabled`)) {
                    form.setValue(`workSchedules.${index}.morning`, {
                      start: '',
                      end: '',
                    })
                    form.setValue(`workSchedules.${index}.afternoon`, {
                      start: '',
                      end: '',
                    })
                  }
                  return (
                    <FormItem>
                      <FormControl>
                        <Switch
                          key={data.day}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={field.disabled}
                        />
                      </FormControl>
                    </FormItem>
                  )
                }}
              />
            )}
          </div>
          <div className='flex items-center gap-3'>
            <FormField
              control={form.control}
              name={`workSchedules.${index}.morning`}
              disabled={disabled}
              render={({ field }) => {
                const isDisabled =
                  !form.getValues('workSchedules')[index].enabled

                const value = isDisabled ? { start: '', end: '' } : field.value

                return (
                  <FormItem className='flex-1'>
                    <FormLabel className='text-sm text-lynch-950'>
                      Horaire (matin)
                    </FormLabel>
                    <InputSchedule
                      value={!isDisabled ? value : undefined}
                      onChange={field.onChange}
                      className='min-w-0 text-base text-lynch-400'
                      disabled={isDisabled || field.disabled}
                    />
                  </FormItem>
                )
              }}
            />
            <FormField
              control={form.control}
              name={`workSchedules.${index}.afternoon`}
              disabled={disabled}
              render={({ field }) => {
                const isDisabled =
                  !form.getValues('workSchedules')[index].enabled
                const value = isDisabled ? { start: '', end: '' } : field.value

                return (
                  <FormItem className='flex-1'>
                    <FormLabel className='text-sm text-lynch-950'>
                      Horaire (après-midi)
                    </FormLabel>
                    <InputSchedule
                      value={!isDisabled ? value : undefined}
                      onChange={field.onChange}
                      className='min-w-0 text-base text-lynch-400'
                      disabled={isDisabled || field.disabled}
                    />
                  </FormItem>
                )
              }}
            />
          </div>
          {/* <InputSchedule /> */}
          <Separator className='mt-5 bg-lynch-100' />
        </div>
      ))}
    </>
  )
}
