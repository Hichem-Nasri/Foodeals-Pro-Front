import { FC } from 'react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { InputFieldForm } from '@/components/custom/InputField'
import { Form, FormField } from '@/components/ui/form'
import { SelectField } from '@/components/custom/SelectField'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/custom/Label'
import DialogImage from '@/components/utils/DialogImage'
import { SupportSchema } from '@/schemas/support-schema'
import { FilterOrganizations } from '@/components/filters/FilterOrganizations'
import { MultiSelectOptionsType } from '@/components/tools/MultiSelect'
import AttachmenentDialog from './AttachmenentDialog'
import { useSupportTranslations } from '@/hooks/useTranslations'

interface FormDemandeSupportProps {
  form: UseFormReturn<z.infer<typeof SupportSchema>>
  onSubmit: (data: z.infer<typeof SupportSchema>) => void
  disabled?: boolean
}

export const FormDemandeSupport: FC<FormDemandeSupportProps> = ({
  form,
  onSubmit,
  disabled,
}) => {
  const t = useSupportTranslations()
  
  return (
    <>
      <div className='hidden w-full lg:flex'>
        <Accordion
          type='single'
          collapsible
          className='min-w-full rounded-[14px] bg-white p-0 py-6 lg:p-5'
          defaultValue='partnerInfo'
        >
          <AccordionItem
            value='partnerInfo'
            className='min-w-full text-[1.375rem] font-normal text-lynch-400'
          >
            <AccordionTrigger className='py-0 text-[1.375rem] font-normal'>
              {t('form.newRequest')}
            </AccordionTrigger>
            <AccordionContent className='w-full pt-7'>
              <FormDemande
                form={form}
                onSubmit={onSubmit}
                disabled={disabled}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div className='flex min-w-full items-start justify-center gap-4 lg:hidden'>
        <FormDemande form={form} onSubmit={onSubmit} disabled={disabled} />
      </div>
    </>
  )
}

interface FormDemandeProps {
  form: UseFormReturn<z.infer<typeof SupportSchema>>
  onSubmit: (data: z.infer<typeof SupportSchema>) => void
  disabled?: boolean
}

const FormDemande: FC<FormDemandeProps> = ({ form, onSubmit, disabled }) => {
  const { handleSubmit, control } = form
  const t = useSupportTranslations()
  
  return (
    <Form {...form}>
      <form
        title={t('form.newRequest')}
        onSubmit={handleSubmit(onSubmit)}
        className='mb-0 flex h-full w-full flex-col items-center justify-center gap-[1.875rem] rounded-[30px] bg-white p-3 px-5 py-[25px] lg:mb-0 lg:rounded-none lg:bg-transparent'
      >
        <div className='flex w-full flex-col gap-3'>
          <div className='flex flex-col gap-3 lg:grid lg:grid-cols-3 lg:pb-0'>
            <SelectField
              disabled={disabled}
              control={control}
              label={t('form.typeRequest')}
              options={[
                { key: 1, label: t('form.supportType') },
                { key: 2, label: t('form.partnerType') },
              ]}
              name={'typeRequest'}
              className='col-span-1'
            />
            <FilterOrganizations
              name={'subEntityId'}
              label={t('form.store')}
              control={control}
              disabled={disabled}
              url='/subentities/filter?raisonSociale=:search'
              withSearch='/subentities/all'
              fn={(data) => {
                if (data.content) {
                  return data.content.map((item: any) => ({
                    key: item.id,
                    label: item.name,
                    avatar: item.avatarPath,
                  }))
                }
                return data.map((item: any) => ({
                  key: item.id,
                  label: item.name,
                  avatar: item.avatarPath,
                }))
              }}
              oneSelect
            />
            <InputFieldForm
              control={control}
              name='content'
              label='Object'
              placeholder='Ecrire un titre d’objet'
              disabled={disabled}
              classNameParent={` ${
                form.getValues('content')?.length >= 28
                  ? 'col-span-3'
                  : 'col-span-1'
              }`}
            />
          </div>
          <div className='flex flex-col gap-3'>
            <div className='flex flex-col items-start gap-3 lg:flex-row'>
              <FormField
                control={control}
                name={'title'}
                render={({ field }) => {
                  return (
                    <div className='flex w-full flex-col items-start space-y-2'>
                      <Label
                        label={t('form.request')}
                        className='text-sm font-semibold'
                      />
                      <Textarea
                        {...field}
                        value={field.value}
                        onChange={(e) =>
                          field.onChange(
                            (e.target as HTMLTextAreaElement).value
                          )
                        }
                        placeholder={t('form.requestPlaceholder')}
                        name='demande'
                        className='flex h-full min-h-64 w-full items-start justify-start text-start text-base font-normal text-lynch-400 outline-none focus:ring-0 focus-visible:ring-0'
                        rows={5}
                      />
                    </div>
                  )
                }}
              />
            </div>
            <div className='flex w-full flex-col items-start gap-3 lg:flex-row'>
              <FormField
                control={control}
                name='attachment'
                render={({ field }) => {
                  return (
                    <div className='flex w-full flex-col items-start space-y-2'>
                      <Label
                        label={t('form.attachment')}
                        className='text-sm font-semibold'
                      />
                      {typeof field.value == 'string' ? (
                        <AttachmenentDialog attachment={field.value} />
                      ) : (
                        <DialogImage
                          file={field.value || null}
                          onChange={field.onChange}
                        />
                      )}
                    </div>
                  )
                }}
              />
            </div>
          </div>
        </div>
      </form>
    </Form>
  )
}

export default FormDemande
