'use client'
import { useNotification } from '@/context/NotifContext'
import { StoreSchema } from '@/schemas/gestion/store-schema'
import {
  ArchiveType,
  DetailsArchiveType,
  NotificationType,
} from '@/types/GlobalType'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { FormStore } from './StoreForm'
import TopBar from './TopBar'
import { createStore } from '@/actions/store'
import api from '@/utils/api'
import { CustomButton } from '@/components/custom/CustomButton'
import Archiver from '@/components/utils/Archiver'
import { Archive } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { AppRoutes } from '@/lib/routes'
import { useStoresTranslations, useMessagesTranslations } from '@/hooks/useTranslations'

interface Store {
  data: any
  id: string
  mode: string
  dialCode: string
}

const Store: React.FC<Store> = ({ data, id, mode, dialCode }) => {
  console.log('dialCode: ', dialCode)
  const [countryCode, setCountryCode] = useState(dialCode)
  const [storeId, setStoreId] = useState<string>(id == 'new' ? '' : id)
  const router = useRouter()
  const t = useStoresTranslations()
  const mt = useMessagesTranslations()

  const [readOnly, setReadOnly] = useState(storeId != '' && mode != 'edit')
  const [StoreData, setStoreData] = useState<z.infer<typeof StoreSchema>>(data!)
  const [saved, setSaved] = useState(StoreData.status == 'ACTIVE')
  const notif = useNotification()

  const storeSchema = useForm<z.infer<typeof StoreSchema>>({
    resolver: zodResolver(StoreSchema),
    mode: 'onBlur',
    defaultValues: {
      ...StoreData,
      avatarPath: StoreData?.avatarPath || undefined,
      coverPath: StoreData?.coverPath || undefined,
      phone: StoreData?.phone.replace(dialCode, ''),
    },
  })

  const { mutate, isPending } = useMutation({
    mutationKey: ['stores'],
    mutationFn: async (data: z.infer<typeof StoreSchema>) => {
      const formData = new FormData()
      const { avatarPath, coverPath, managerData, status, ...rest } = data
      const blob = new Blob(
        [
          JSON.stringify({
            ...rest,
            avatarPath: null,
            coverPath: null,
            phone: `${countryCode}${rest.phone}`,
          }),
        ],
        {
          type: 'application/json',
        }
      )

      formData.append('subEntity', blob)
      formData.append(
        'profilImage',
        (typeof avatarPath === 'string' ? null : avatarPath) || ''
      )
      formData.append(
        'coverImage',
        (typeof coverPath === 'string' ? null : coverPath) || ''
      )
      const url = storeId ? `/subentities/${storeId}` : `/subentities`
      const method = storeId ? 'put' : 'post'

      const response = await api[method](url, formData).catch((err) => {
        console.error(err)
        return { status: 500, data: null }
      })
      if (![200, 201, 202].includes(response.status)) {
        throw new Error('Failed to save partner')
      }
      return response.data
    },
    onSuccess: (data) => {
      setStoreId(data.id)
      notif.notify(NotificationType.SUCCESS, t('form.creationSuccess'))
    },
    onError: (err) => {
      console.error(err)
      notif.notify(NotificationType.ERROR, t('form.creationError'))
    },
  })
  const { mutate: archiveStore, isPending: pendingStore } = useMutation({
    mutationKey: ['archive'],
    mutationFn: async (data: ArchiveType) => {
      const { motif, raison } = data
      const response = await api.delete(
        `/subentities/${id}?motif=${motif}&reason=${raison}`
      )
      return response.data
    },
    onSuccess: (data) => {
      router.push(AppRoutes.stores)
      notif.notify(NotificationType.SUCCESS, t('form.archiveSuccess'))
    },
    onError: (err) => {
      notif.notify(NotificationType.ERROR, t('form.archiveError'))
      console.error(err)
    },
  })
  const { mutate: Confirmer, isPending: pendingConfirmer } = useMutation({
    mutationKey: ['stores'],
    mutationFn: async () => {
      const response = await api.get(
        `/subentities/confirm-subentity/${storeId}`
      )
      return response.data
    },
    onSuccess: (data) => {
      setSaved(true)
      setStoreData((prev) => ({ ...prev, status: 'ACTIVE' }))
      notif.notify(NotificationType.SUCCESS, t('form.confirmSuccess'))
    },
    onError: (err) => {
      notif.notify(NotificationType.ERROR, t('form.confirmError'))
      console.error(err)
    },
  })
  const handleSave = (data: any) => {
    console.log('data: ', data)
    mutate({
      ...data,
      managerId: 1,
    })
  }

  const handleSubmit = () => {
    if (storeId) {
      Confirmer()
    }
  }

  const handleArchive = (data: any) => {
    archiveStore(data)
  }
  console.log('StoreData: ', StoreData.status)
  return (
    <div className='mb-20 flex w-full flex-col gap-[0.625rem] overflow-auto lg:mb-0'>
      <TopBar
        form={storeSchema}
        onSave={handleSave}
        state={StoreData.status == 'ACTIVE'}
        onSubmit={handleSubmit}
        handleArchive={handleArchive}
        disabledFirst={readOnly}
        disabledSecond={readOnly || !storeId}
        handleEdit={() => {
          setStoreData((prev) => ({
            ...prev,
            status: 'IN_ACTIVE',
          }))
        }}
        isLoading={isPending}
      />
      <div className='flex h-full w-full flex-col gap-[1.875rem]'>
        <FormStore
          store={StoreData}
          onSubmit={handleSubmit}
          form={storeSchema}
          countryCode={countryCode}
          setCountryCode={setCountryCode}
          id={storeId}
          disabled={readOnly}
          handleEdit={() => {
            setStoreData((prev) => ({
              ...prev,
              status: prev.status == 'IN_ACTIVE' ? 'ACTIVE' : 'IN_ACTIVE',
            }))
          }}
          state={StoreData.status == 'ACTIVE'}
          saved={saved}
          t={t}
        />
      </div>
      {StoreData.status == 'ACTIVE' && (
        <div className='hidden w-full justify-end rounded-[18px] bg-white p-4 lg:flex'>
          <Archiver
            onSubmit={handleArchive}
            title={t('form.archiveStore')}
            isPending={pendingStore}
            asChild
          />
        </div>
      )}
    </div>
  )
}

export default Store
