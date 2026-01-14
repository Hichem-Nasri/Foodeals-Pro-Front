'use client'
import Image from 'next/image'
import { FormLogin } from './FormLogin'
import { useEffect, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useNotification } from '@/context/NotifContext'
import { NotificationType } from '@/types/GlobalType'
import SplashScreen from '@/components/custom/SplashScreen'
import { LoginSchema } from '@/schemas/login-schema'
import OnboardingScreen from './AnimationPart'
import { getAccessToken, LogIn } from '@/actions'
import { useMutation } from '@tanstack/react-query'
import { signOut } from '@/auth'
import { useAuthTranslations } from '@/hooks/useTranslations'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const notify = useNotification()
  const t = useAuthTranslations()
  
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  })

  useEffect(() => {
    if (localStorage.getItem('remember')) {
      form.setValue('email', localStorage?.getItem('email') || '')
      form.setValue('remember', true)
    }
  }, [])

  const { handleSubmit } = form

  const { mutate, isPending } = useMutation({
    mutationKey: ['login'],
    mutationFn: async (data: z.infer<typeof LoginSchema>) => {
      try {
        var result = await LogIn(data)
      } catch (e) {
        throw new Error("Erreur s'est produite lors de la connexion")
      }
      if (!result?.success) {
        console.log('result: ', result)
        throw new Error("Error s'est produite lors de la connexion")
      }
      return data
    },
    onSuccess: (data) => {
      notify.notify(NotificationType.SUCCESS, 'Connexion réussie')
      console.log('Data: ', data)
      if (data?.remember) {
        localStorage.setItem('remember', 'true')
        localStorage.setItem('email', data.email)
      }
      router.push('/')
    },
    onError: (error) => {
      notify.notify(NotificationType.ERROR, error.message)
    },
  })

  const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
    console.log('before signin: ', data)
    mutate(data)
  }

  const [loading, setLoading] = useState(true)
  const finishLoading = () => {
    setLoading(false)
  }

  const handleShowPassword = () => setShowPassword((prev) => !prev)

  return (
    <div className='h-full min-w-full overflow-hidden'>
      {loading ? (
        <SplashScreen finishLoading={finishLoading} />
      ) : (
        <div className="flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[url('/images/background-auth-partners.svg')] lg:flex-row lg:justify-between">
          {/* Language Switcher - Top Left */}
          <div className="absolute top-4 ltr:left-4 rtl:right-4 z-10">
            <LanguageSwitcher />
          </div>

          <div className='flex h-auto w-full flex-col items-center justify-center gap-6 p-4 lg:min-h-screen lg:w-1/2 lg:p-0'>
            <div className='flex h-auto flex-col items-center justify-center gap-4 lg:justify-between lg:gap-7'>
              <Image
                className='select-none'
                src={'/images/logo-pro.svg'}
                alt='Logo'
                width={200}
                height={200}
              />

              <h1 className='font-base select-none text-xl text-lynch-400'>
                {t('login.welcome')}
              </h1>
            </div>
            <FormLogin
              handleSubmit={handleSubmit(onSubmit)}
              form={form}
              handleShowPassword={handleShowPassword}
              showPassword={showPassword}
              isPending={isPending}
            />
          </div>
          <div className='hidden min-h-screen w-1/2 rtl:rounded-r-[48px] ltr:rounded-l-[48px] bg-primary lg:grid'>
            <OnboardingScreen />
          </div>
        </div>
      )}
    </div>
  )
}
