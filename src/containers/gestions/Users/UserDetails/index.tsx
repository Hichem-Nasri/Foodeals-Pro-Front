'use client'
import React, { useState } from 'react'
import TopBar from './TopBar'
import { CollaboratorDetailsSchema } from '@/schemas/user-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { CollaboratorDetails } from './DetailsOfUser'
import Archiver from '@/components/utils/Archiver'
import { useMutation } from '@tanstack/react-query'
import api from '@/utils/api'
import { useNotification } from '@/context/NotifContext'
import {
  ArchiveType,
  NotificationType,
} from '@/types/GlobalType'
import { useRouter } from 'next/navigation'
import { AppRoutes } from '@/lib/routes'
import { User } from 'next-auth'
import { useCollaboratorsTranslations, useMessagesTranslations } from '@/hooks/useTranslations'

interface UserDetailsProps {
  id: string
  mode: string
  partner: string
  User: any
  session: User
  dialCode: string
}

const UserDetails: React.FC<
  UserDetailsProps
> = ({
  id,
  mode,
  User,
  partner,
  session,
  dialCode,
}) => {
  const notif = useNotification()
  const tc = useCollaboratorsTranslations()
  const tm = useMessagesTranslations()
  const [UserId, setUserId] =
    useState(id)
  const [edit, setEdit] = useState(
    id && User.status != 'IN_ACTIVE'
      ? false
      : true
  )
  const [countryCode, setCountryCode] =
    useState('+212')
  const router = useRouter()
  const [readOnly, setReadOnly] =
    useState(
      () => !edit && mode != 'edit'
    )
  const { mutate, isPending } =
    useMutation({
      mutationKey: ['users'],
      mutationFn: async (data: any) => {
        const formData = new FormData()
        const {
          avatarPath,
          status,
          ...rest
        } = data
        console.log('rest: ', rest)
        const blob = new Blob(
          [
            JSON.stringify({
              ...rest,
              avatarPath: null,
              managerId:
                +rest.managerId,
              phone: `${countryCode}${rest.phone}`,
            }),
          ],
          {
            type: 'application/json',
          }
        )
        formData.append(
          'collaborator',
          blob
        )
        formData.append(
          'profilImage',
          (typeof avatarPath ===
          'string'
            ? null
            : avatarPath) || ''
        )
        const url = UserId
          ? `/users/collaborators/update/${UserId}`
          : `/users/collaborators/add`
        const method = UserId
          ? 'patch'
          : 'post'
        const response = await api({
          url,
          method,
          data: formData,
        })
        if (
          ![
            200, 201, 204, 203,
          ].includes(response.status)
        )
          throw new Error(
            response.data.message
          )
        return response.data
      },
      onSuccess: (data) => {
        notif.notify(
          NotificationType.SUCCESS,
          tc('messages.saveSuccess')
        )

        setUserId(data.id)
      },
      onError: (error) => {
        console.error('error', error)
        notif.notify(
          NotificationType.ERROR,
          error.message
        )
      },
    })

  const form = useForm<
    z.infer<
      typeof CollaboratorDetailsSchema
    >
  >({
    resolver: zodResolver(
      CollaboratorDetailsSchema
    ),
    mode: 'onBlur',
    defaultValues: {
      ...User,
      subEntityId:
        partner == 'account'
          ? session?.organizationId
          : partner,
      organizationEntityId:
        partner == 'account'
          ? session?.organizationId
          : '',
      phone: User.phone.replace(
        dialCode,
        ''
      ),
      managerId: '14',
    },
  })
  const {
    mutate: Confirmer,
    isPending: pendingConfirmer,
  } = useMutation({
    mutationKey: ['stores'],
    mutationFn: async () => {
      const response = await api.get(
        `/users/confirm-collaborator/${UserId}`
      )
      return response.data
    },
    onSuccess: (data) => {
      setEdit(false)
      User.status = 'ACTIVE'
      notif.notify(
        NotificationType.SUCCESS,
        tc('messages.confirmSuccess')
      )
    },
    onError: (err) => {
      notif.notify(
        NotificationType.ERROR,
        tc('messages.confirmError')
      )
      console.error(err)
    },
  })
  const onSubmit = () => {
    if (!UserId) {
      notif.notify(
        NotificationType.INFO,
        tc('messages.pleaseRegisterFirst')
      )
      return
    }
    Confirmer()
  }

  const onSave = (
    data: z.infer<
      typeof CollaboratorDetailsSchema
    >
  ) => {
    // if (form.formState.errors) {
    //   notif.notify(NotificationType.INFO, 's`il vous plait remplir les champs')
    //   return
    // }
    const {
      organizationInfo,
      id,
      workingHours,
      ...rest
    } = data
    const working = Object.entries(
      workingHours
    )
      .filter(
        ([day, value]) => value.selected
      )
      .map(([day, value]) => ({
        dayOfWeek: day.toUpperCase(),
        morningStart:
          value.morningStart,
        morningEnd: value.morningEnd,
        afternoonStart:
          value.afternoonStart,
        afternoonEnd:
          value.afternoonEnd,
      }))
    mutate({
      ...rest,
      isEmailVerified: true,
      password: null,
      workSchedules: working,
    })
  }

  const {
    mutate: archiveUser,
    isPending: pendingArchive,
  } = useMutation({
    mutationKey: ['archive'],
    mutationFn: async (
      data: ArchiveType
    ) => {
      const { motif, raison } = data
      const response = await api.delete(
        `/users/collaborators/delete-collaborator/${id}?motif=${motif}&reason=${raison}`
      )
      return response.data
    },
    onSuccess: (data) => {
      router.push(
        AppRoutes.collaborators
      )
      notif.notify(
        NotificationType.SUCCESS,
        tc('messages.archiveSuccess')
      )
    },
    onError: (err) => {
      notif.notify(
        NotificationType.ERROR,
        tc('messages.archiveError')
      )
      console.error(err)
    },
  })

  const handleArchive = (data: any) => {
    archiveUser(data)
  }
  console.log(
    'errros: ',
    form.formState.errors
  )
  const { handleSubmit } = form
  return (
    <div className='flex w-full flex-col items-start gap-3'>
      <TopBar
        form={form}
        onSave={handleSubmit(onSave)}
        onSubmit={onSubmit}
        edit={edit}
        disabledFirst={
          readOnly ||
          isPending ||
          pendingConfirmer ||
          pendingArchive
        }
        disabledSecond={
          readOnly ||
          isPending ||
          pendingConfirmer ||
          pendingArchive
        }
        handleArchive={handleArchive}
        handleEdit={() =>
          setEdit((prev) => !prev)
        }
      />
      <CollaboratorDetails
        form={form}
        collaborator={User}
        onSubmit={onSave}
        disabled={
          readOnly ||
          isPending ||
          pendingConfirmer ||
          pendingArchive
        }
        setCountryCode={setCountryCode}
        countryCode={countryCode}
        type={id}
        edit={edit}
        handleEdit={() => {
          if (edit && !readOnly) {
            setReadOnly(true)
          } else if (
            !edit &&
            readOnly
          ) {
            setReadOnly(false)
          }
          setEdit((prev) => !prev)
        }}
        id={UserId}
      />
      {!edit && (
        <div className='hidden w-full justify-end rounded-[18px] bg-white p-4 lg:flex'>
          <Archiver
            onSubmit={handleArchive}
            title='Archive'
            asChild
            isPending={isPending}
          />
        </div>
      )}
    </div>
  )
}
//84da6cee-1e96-45c2-a9bd-e31266e3921f
export default UserDetails
