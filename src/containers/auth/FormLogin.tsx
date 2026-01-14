import { Eye, EyeOffIcon, Lock, LockKeyhole, User } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'
import { Form } from '@/components/ui/form'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { z } from 'zod'
import { CheckboxField } from '@/components/custom/CheckboxField'
import { CustomButton } from '@/components/custom/CustomButton'
import { InputFieldForm } from '@/components/custom/InputField'
import { LoginSchema } from '@/schemas/login-schema'
import { useAuthTranslations } from '@/hooks/useTranslations'

interface FormLoginProps {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  form: UseFormReturn<z.infer<typeof LoginSchema>>
  showPassword: boolean
  handleShowPassword: () => void
  isPending: boolean
}

export const FormLogin: React.FC<FormLoginProps> = ({
  handleSubmit,
  form,
  handleShowPassword,
  showPassword,
  isPending,
}) => {
  const { control } = form
  const t = useAuthTranslations()
  
  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className='w-full' autoComplete='on'>
        <div className='mx-auto flex max-w-[438px] flex-col gap-[20px] lg:gap-[1.875rem]'>
          <InputFieldForm
            control={control}
            name='email'
            placeholder={t('login.email')}
            label={t('login.username')}
            className='h-12 lg:h-14'
            IconLeft={User}
          />
          <InputFieldForm
            type='password'
            control={control}
            name='password'
            placeholder={t('login.password')}
            label={t('login.password')}
            IconLeft={Lock}
            className='h-12 lg:h-14'
            onClickIconRight={handleShowPassword}
          />
          <div className='flex items-center justify-between gap-1'>
            <CheckboxField
              control={control}
              name='remember'
              label={t('login.rememberMe')}
            />
            <div className='flex gap-1 text-primary underline-offset-1 transition-all flex-center hover:underline'>
              <LockKeyhole className='size-4 lg:size-5' />
              <Link href='/forgot-password' className='text-xs lg:text-sm'>
                {t('login.forgotPassword')}
              </Link>
            </div>
          </div>
          <CustomButton
            label={t('login.loginButton')}
            IconRight={User}
            type='submit'
            className='h-12 lg:h-14'
            isPending={isPending}
            disabled={isPending}
          />
        </div>
      </form>
    </Form>
  )
}
