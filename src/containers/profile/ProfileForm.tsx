import IconAndText from '@/app/[locale]/pro-market/components/IconAndText'
import { Label } from '@/components/custom/Label'
import InputProfile from '@/components/utils/InputProfile'
import { useTranslations } from '@/hooks/useTranslations'
import { profileSchema } from '@/schemas/gestion/profile-schema'
import { Mail, PhoneCall } from 'lucide-react'
import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import z from 'zod'

interface ProfileFormProps {
  form: UseFormReturn<z.infer<typeof profileSchema>>
  disabled?: boolean
}

const ProfileForm: React.FC<ProfileFormProps> = ({ form, disabled }) => {
  const { t } = useTranslations()
  const { phone, email } = form.watch()
  return (
    <div className='flex w-full flex-col gap-4 rounded-[30px] bg-white px-4 py-[25px]'>
      <InputProfile
        label={t('profilePage.fields.firstName')}
        name='name.firstName'
        control={form.control}
        disabled={disabled}
      />
      <hr className='h-[0.55px] w-full bg-lynch-200' />
      <InputProfile
        label={t('profilePage.fields.lastName')}
        name='name.lastName'
        control={form.control}
        disabled={disabled}
      />
      <hr className='h-[0.55px] w-full bg-lynch-200' />

      <InputProfile
        label={t('profilePage.fields.position')}
        name='role'
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
          text={phone || ''}
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
          text={email || ''}
          IconLeft={Mail}
          classNameParent='text-primary'
          className='text-lynch-500'
        />
      </div>
    </div>
  )
}

export default ProfileForm
