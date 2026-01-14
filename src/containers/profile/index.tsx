'use client'
import { AvatarField } from '@/components/custom/AvatarField'
import { Form } from '@/components/ui/form'
import HeaderLine from '@/components/utils/HeaderLine'
import { useTranslations } from '@/hooks/useTranslations'
import {
  passwordSchema,
  profileSchema,
  ProfileType,
} from '@/schemas/gestion/profile-schema'
import { NotificationType } from '@/types/GlobalType'
import { zodResolver } from '@hookform/resolvers/zod'
import { CircleCheck, MessageCircleMore, PencilLine, X } from 'lucide-react'
import React, { FC, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import ProfileForm from './ProfileForm'
import PartnerForm from './PartnerForm'
import PasswordForm from './PassordForm'
import { CustomButton } from '@/components/custom/CustomButton'
import Link from 'next/link'
import { AppRoutes } from '@/lib/routes'
import { useMutation } from '@tanstack/react-query'
import api from '@/utils/api'
import { User } from 'next-auth'
import { useNotification } from '@/context/NotifContext'

interface ProfileProps {
  user: User
  profile: ProfileType
}

const Profile: FC<ProfileProps> = ({ profile, user }) => {
  const { t } = useTranslations()
  const { notify } = useNotification()
  const [modify, setModify] = useState(true)
  const { mutate, isPending } = useMutation({
    mutationKey: ['profile'],
    mutationFn: async (data: z.infer<typeof profileSchema>) => {
      const formData = new FormData()
      const { avatar, responsible, ...rest } = data
      formData.append('profilImage', avatar)
      const response = await api.patch(
        `/users/change-avatar/${user.id}`,
        formData
      )
      return response.data
    },
    onSuccess: () => {
      notify(NotificationType.SUCCESS, t('profilePage.notifications.profileUpdated'))
      setModify(true)
    },
    onError: () => {
      notify(NotificationType.ERROR, t('profilePage.notifications.updateError'))
    },
  })
  const { mutate: mutatePassword, isPending: isPendingPassword } = useMutation({
    mutationKey: ['profile'],
    mutationFn: async (data: z.infer<typeof passwordSchema>) => {
      const body = {
        currentPassword: data.oldPassword,
        newPassword: data.newPassword,
        idUser: user.id,
      }

      const response = await api.patch(`/users/change-password`, body)
      return response.data
    },
    onSuccess: () => {
      passwordForm.reset()
      notify(NotificationType.SUCCESS, t('profilePage.notifications.passwordUpdated'))
      setModify(true)
    },
    onError: (error) => {
      notify(NotificationType.ERROR, t('profilePage.notifications.passwordError'))
    },
  })
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    mode: 'onBlur',
    defaultValues: {
      ...profile,
      name: {
        firstName: profile.name.firstName,
        lastName: profile.name.lastName,
      },
    },
  })
  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    mode: 'onBlur',
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })
  const { handleSubmit } = form
  // const onSubmit = (data: any) => {
  //   mutate(data)
  // }
  // const SubmitPassword = (data: any) => {
  //   mutatePassword(data)
  // }
  const handleConfirm = async () => {
    console.log('form: ', form.formState.isDirty)
    console.log('passwordForm: ', passwordForm.formState.isDirty)
    // if (form.formState.isDirty) form.handleSubmit(onSubmit)()
    const errors = await passwordForm.trigger()
    console.log('errors: ', errors)
    if (errors) {
      // passwordForm.handleSubmit(SubmitPassword)()
    }
  }
  console.log('erros form: ', form.formState.errors)
  return (
    <div className='w-full container mx-auto'>
      <Form {...form}>
        <form
          onSubmit={handleConfirm}
          className='mb-20 flex w-full flex-col items-center gap-6'
        >
          <div className='sticky bottom-0 left-0 right-0 z-50 h-fit w-full rounded-t-[24px] bg-white p-2 flex-center-end lg:top-0 lg:rounded-[14px]'>
            {modify ? (
              <CustomButton
                variant='default'
                type='submit'
                size={'sm'}
                onClick={() => setModify(!modify)}
                className='h-12 w-full rounded-[18px] lg:w-fit lg:rounded-[12px]'
                label={t('profilePage.editProfile')}
                IconRight={PencilLine}
              />
            ) : (
              <div className='w-full gap-3 flex-center-end'>
                <CustomButton
                  variant='outline'
                  type='button'
                  size={'sm'}
                  onClick={() => setModify(!modify)}
                  className='h-12 w-full rounded-[18px] lg:w-fit lg:rounded-[12px]'
                  label={t('profilePage.cancel')}
                  IconRight={X}
                />
                <CustomButton
                  variant='default'
                  type='submit'
                  size={'sm'}
                  disabled={isPending || isPendingPassword}
                  className='h-12 w-full rounded-[18px] lg:w-fit lg:rounded-[12px]'
                  label={t('profilePage.confirm')}
                  IconRight={CircleCheck}
                />
              </div>
            )}
          </div>
          <AvatarField
            name='avatar'
            form={form}
            alt={'upload image'}
            label={t('profilePage.fields.productPhoto')}
            className='flex size-[130px] items-center justify-center !rounded-full bg-white lg:bg-transparent'
            classNameAvatar={`!rounded-full size-[130px] lg:bg-transparent bg-white  border-mountain-400 ${modify ? 'border-none' : 'border-[4px]'} `}
            disabled={modify}
          />
          <HeaderLine title={t('profilePage.profileInfo')} />
          <ProfileForm form={form} disabled={true} />
          <HeaderLine title={t('profilePage.partnerInfo')} />
          <PartnerForm form={form} disabled={true} />
          <HeaderLine title={t('profilePage.security')} />
          <PasswordForm form={passwordForm} disabled={modify} />
          <Link
            href={AppRoutes.supportDetails.replace(':id', 'new')}
            className='flex w-full items-center justify-start gap-2 justify-self-start py-3 text-[14px] font-semibold text-mountain-500 hover:underline'
          >
            <MessageCircleMore size={20} />
            {t('profilePage.contactSupport')}
          </Link>
        </form>
      </Form>
    </div>
  )
}

export default Profile
