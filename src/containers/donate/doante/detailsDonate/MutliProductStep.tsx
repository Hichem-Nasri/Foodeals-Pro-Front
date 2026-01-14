'use client'
import { InputFieldForm } from '@/components/custom/InputField'
import { SelectField } from '@/components/custom/SelectField'
import {
  FormField,
  FormMessage,
  FormItem,
  Form,
  FormLabel,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import HeaderLine from '@/components/utils/HeaderLine'
import { capitalize } from '@/utils/utils'
import React from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'
import FieldImages from './FieldImages'
import { MultiSelectOptionsType } from '@/components/tools/MultiSelect'
import { Label } from '@/components/custom/Label'
import { CustomButton } from '@/components/custom/CustomButton'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import { MultiProductSchema, MultiProductType } from '@/schemas/donate-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarMinus2, Plus, X } from 'lucide-react'
import { DialogClose } from '@radix-ui/react-dialog'
import MobileHeader from '@/components/custom/MobileHeader'
import { AvatarField } from '@/components/custom/AvatarField'
import QuntityLabel from '@/containers/market/components/Quntity'
import { on } from 'events'
import { NotificationType } from '@/types/GlobalType'
import { useNotification } from '@/context/NotifContext'
import { DatePicker } from '@/components/tools/DatePicker'

interface MutliProductStepProps {
  form: UseFormReturn<any>
  disabled: boolean
  type: string
  onSubmit: (data: MultiProductType) => void
  edit?: boolean
}

const CheckData = (data: MultiProductType) => {
  const errors: Record<string, string> = {}
  if (!data.title || data.title === '') {
    errors.title = 'Champ obligatoire'
  }
  if (!data.description || data.description === '') {
    errors.description = 'Champ obligatoire'
  }
  if (!data.unity || data.unity === '') {
    errors.unity = 'Champ obligatoire'
  }
  if (!data.quantity || data.quantity === 0) {
    errors.quantity = 'Champ obligatoire'
  }
  if (!data.productImages) {
    errors.productImages = 'Champ obligatoire'
  }
  if (!data.quantity || data.quantity === 0) {
    errors.quantity = 'Champ obligatoire'
  }
  if (!data.expirationDate) {
    errors.expirationDate = 'Champ obligatoire'
  }
  return errors
}

const MutliProductStep: React.FC<MutliProductStepProps> = ({
  form,
  disabled,
  type,
  onSubmit,
  edit,
}) => {
  const { notify } = useNotification()
  return (
    <>
      <DialogTitle className='sticky left-0 right-0 top-0 z-30 hidden items-center justify-between rounded-b-[18px] bg-white p-3 py-4 text-lg text-lynch-900 lg:flex'>
        <span>Ajoute un produit</span>
        <DialogClose className='text-lynch-500'>
          <X size={24} />
        </DialogClose>
      </DialogTitle>
      <MobileHeader
        title='Ajoute un produit'
        onClick={() => {}}
        buttonType='dialog'
        color='blue'
      />
      <div className='flex flex-col gap-3 p-3'>
        <AvatarField
          form={form}
          classNameAvatar='w-full aspect-square rounded-[18px] bg-white h-fit max-h-[200px] '
          name='productImages'
          label=''
          className='aspect-square max-h-[200px] w-full'
          disabled={false}
        />
        <HeaderLine title='Informations de deal' className='lg:flex' />
        <div className='flex w-full flex-col gap-3 rounded-[18px] bg-white p-4 py-5'>
          <div className='flex w-full flex-col gap-3'>
            <InputFieldForm
              control={form.control}
              name='title'
              label='Titre'
              placeholder='Titre'
              disabled={disabled}
            />
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <div className='flex flex-col gap-3'>
                  <Label label='Description' />
                  <Textarea
                    {...field}
                    placeholder='Description'
                    disabled={disabled}
                    className='h-32 w-full rounded-[8px] p-4 text-base text-lynch-400 disabled:cursor-text disabled:opacity-100'
                    onChange={(e) => field.onChange(e.target.value)}
                    value={field.value}
                  />
                  <FormMessage {...field} />
                </div>
              )}
            />
            <FormField
              control={form.control}
              name='expirationDate'
              render={({ field }) => (
                <FormItem className='flex flex-1 flex-col gap-2 text-sm font-medium'>
                  <Label label='Date d expiration' htmlFor='expirationDate' />
                  <DatePicker
                    myFormat='dd/MM/yyyy'
                    id='expirationDate'
                    triggerClassName='text-base text-lynch-500'
                    iconClassName='text-scooter-500'
                    placeholder='Choisir une date'
                    onChange={field.onChange}
                    Icon={CalendarMinus2}
                    disabled={field.disabled}
                    value={field.value}
                    color='blue'
                  />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className='container-item'>
          <SelectField
            control={form.control}
            label='Type de unite'
            options={['Kg', 'Litre', 'Pièce'].map((item: string) => ({
              label: capitalize(item),
              key: item,
            }))}
            disabled={false}
            name={'unity'}
          />
          <FormField
            name='quantity'
            control={form.control}
            disabled={disabled}
            render={({ field }) => (
              <FormItem>
                <QuntityLabel
                  label='Quantité'
                  value={+field.value || 0}
                  onChange={(value: number) => field.onChange(value)}
                  min={1}
                  disabled={field.disabled || disabled}
                  color='blue'
                />
              </FormItem>
            )}
          />
        </div>
      </div>
      <div className='item-center sticky bottom-0 left-0 right-0 z-30 flex w-full justify-center gap-3 rounded-t-[18px] bg-white p-3 lg:justify-end'>
        <DialogClose asChild>
          <CustomButton
            label={'ANNULER'}
            variant='outline'
            onClick={() => {}}
            className='w-full lg:h-12 lg:w-fit'
            IconRight={X}
          />
        </DialogClose>
        <CustomButton
          label={edit ? 'MODIFIER' : 'AJOUTER'}
          IconRight={Plus}
          onClick={() => {
            const data = form.getValues()
            const errors = CheckData(data)
            console.log('errors', form.formState.errors)
            // show error message in the form
            if (Object.keys(errors).length === 0) {
              console.log('submiting...')
              form.handleSubmit(onSubmit)()
            }
            for (const key in errors) {
              form.setError(key, { message: errors[key] })
            }
          }}
          disabled={!form.formState.isValid || !form.formState.isDirty}
          className='w-full bg-scooter-500 hover:bg-scooter-100 hover:text-scooter-500 lg:h-12 lg:w-fit'
        />
      </div>
    </>
  )
}

export const DialogMultiProduct = ({
  open,
  setOpen,
  onSubmit,
  type,
  form,
  edit,
}: {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  onSubmit: (data: MultiProductType) => void
  type: string
  form: UseFormReturn<any>
  edit: boolean
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className='top-0 flex h-screen min-h-full min-w-full translate-y-[0%] flex-col justify-start gap-0 overflow-auto rounded-none bg-lynch-50 px-0 py-0 lg:top-1/2 lg:h-[90%] lg:min-h-fit lg:min-w-[700px] lg:-translate-y-[50%] lg:gap-4 lg:rounded-[14px]'
        // showContent={false}
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex h-full w-full flex-col gap-2 lg:mt-0 lg:space-y-0'
          >
            <MutliProductStep
              form={form}
              disabled={false}
              type={type}
              onSubmit={onSubmit}
              edit={edit}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default DialogMultiProduct
