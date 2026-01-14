import { InputFieldForm } from '@/components/custom/InputField'
import InputProfile from '@/components/utils/InputProfile'
import ParnterProfile from '@/components/utils/PartnerProfile'
import { useTranslations } from '@/hooks/useTranslations'
import { passwordSchema } from '@/schemas/gestion/profile-schema'
import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import z from 'zod'

interface PasswordFormProps {
  form: UseFormReturn<z.infer<typeof passwordSchema>>
  disabled?: boolean
}

const PasswordForm: React.FC<PasswordFormProps> = ({ form, disabled }) => {
  const { t } = useTranslations()
  const { newPassword, confirmPassword } = form.watch()
  return (
    <div className='flex w-full flex-col gap-4 rounded-[30px] bg-white px-4 py-[25px]'>
      <InputFieldForm
        type='password'
        label={t('profilePage.fields.oldPassword')}
        name='oldPassword'
        placeholder='********'
        control={form.control}
        disabled={disabled}
      />
      <hr className='h-[0.55px] w-full bg-lynch-200' />
      <InputFieldForm
        type='password'
        label={t('profilePage.fields.newPassword')}
        name='newPassword'
        placeholder='********'
        control={form.control}
        disabled={disabled}
      />
      <hr className='h-[0.55px] w-full bg-lynch-200' />
      <InputFieldForm
        type='password'
        label={t('profilePage.fields.confirmPassword')}
        name='confirmPassword'
        placeholder='********'
        control={form.control}
        disabled={disabled}
      />
      {newPassword !== '' &&
        confirmPassword !== '' &&
        newPassword !== confirmPassword && (
          <p className='text-start text-xs font-medium text-coral-500'>
            {t('profilePage.fields.passwordsDoNotMatch')}
          </p>
        )}
    </div>
  )
}

export default PasswordForm
