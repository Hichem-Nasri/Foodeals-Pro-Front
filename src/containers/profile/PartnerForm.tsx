import IconAndText from '@/app/[locale]/pro-market/components/IconAndText'
import { Label } from '@/components/custom/Label'
import InputProfile from '@/components/utils/InputProfile'
import ParnterProfile from '@/components/utils/PartnerProfile'
import { useTranslations } from '@/hooks/useTranslations'
import { profileSchema } from '@/schemas/gestion/profile-schema'
import { Mail, Phone, PhoneCall } from 'lucide-react'
import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import z from 'zod'

interface PartnerFormProps {
  form: UseFormReturn<z.infer<typeof profileSchema>>
  disabled?: boolean
}

const PartnerForm: React.FC<PartnerFormProps> = ({ form, disabled }) => {
  const { t } = useTranslations()
  const { responsible } = form.watch()
  return (
    <div className='flex w-full flex-col gap-4 rounded-[30px] bg-white px-4 py-[25px]'>
      <ParnterProfile
        label={t('profilePage.fields.partner')}
        name='organization'
        control={form.control}
        disabled={disabled}
      />
      <hr className='h-[0.55px] w-full bg-lynch-200' />
      <ParnterProfile
        label={t('profilePage.fields.responsible')}
        name='responsible'
        control={form.control}
        disabled={disabled}
      />
      <hr className='h-[0.55px] w-full bg-lynch-200' />
      <div className='flex w-full items-start justify-between py-4'>
        <Label
          label={t('profilePage.fields.phone')}
          className='text-base font-semibold text-lynch-950'
        />
        <IconAndText
          text={responsible?.phone || ''}
          IconLeft={PhoneCall}
          classNameParent='text-primary'
          className='text-lynch-500'
        />
      </div>

      <hr className='h-[0.55px] w-full bg-lynch-200' />

      <div className='flex w-full items-start justify-between py-4'>
        <Label
          label={t('profilePage.fields.email')}
          className='text-base font-semibold text-lynch-950'
        />
        <IconAndText
          text={responsible?.email || ''}
          IconLeft={Mail}
          classNameParent='text-primary'
          className='text-lynch-500'
        />
      </div>
    </div>
  )
}

export default PartnerForm
