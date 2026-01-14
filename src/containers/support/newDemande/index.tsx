'use client'
import { useMutation, useQuery } from '@tanstack/react-query'
import { FC, useState } from 'react'
import TopBar from './TopBar'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormDemandeSupport } from './formDemandeSupport'
import { useRouter } from 'next/navigation'
import { NotificationType, PartnerStatusType } from '@/types/GlobalType'
import { SupportSchema } from '@/schemas/support-schema'
import { SupportType } from '@/types/support'
import api from '@/utils/api'
import { useNotification } from '@/context/NotifContext'
import { useSupportTranslations } from '@/hooks/useTranslations'

interface DemandeSupportProps {
  data: any
  id: string
  mode: string
}

const DemandeSupport: FC<DemandeSupportProps> = ({ data, id, mode }) => {
  const [demandeId, setDemendeId] = useState<string>(id)
  const [readOnly, setReadOnly] = useState(id != '')
  const notif = useNotification()
  const t = useSupportTranslations()
  // const { data, isLoading } = useDemandeSupport(id)
  const { mutate, isPending } = useMutation({
    mutationKey: ['support'],
    mutationFn: async (data: z.infer<typeof SupportSchema>) => {
      try {
        const formData = new FormData()
        const { attachment, ...rest } = data
        const blob = new Blob(
          [
            JSON.stringify({
              ...rest,
            }),
          ],
          {
            type: 'application/json',
          }
        )
        formData.append('request', blob)
        formData.append('file', attachment || '')
        const response = await api.post(`/notifications`, formData)
        if (![200, 201, 204, 203].includes(response.status))
          throw new Error(response.data.message)
        return response.data
      } catch (error) {
        throw new Error(t('messages.addError'))
      }
    },
    onSuccess: (data) => {
      notif.notify(NotificationType.SUCCESS, t('messages.addSuccess'))
      setDemendeId(data.id)
      setReadOnly(true)
    },
    onError: (error) => {
      notif.notify(
        NotificationType.ERROR,
        t('messages.addError')
      )
    },
  })
  // if (isLoading) return <Loading />
  const form = useForm<z.infer<typeof SupportSchema>>({
    resolver: zodResolver(SupportSchema),
    mode: 'onBlur',
    defaultValues: data,
  })
  const { handleSubmit, control } = form
  const onSaveData = async (data: z.infer<typeof SupportSchema>) => {
    if (!demandeId) mutate(data)
  }
  const onSubmit = async (data: z.infer<typeof SupportSchema>) => {}

  const router = useRouter()
  return (
    <div className='mb-20 flex w-full flex-col-reverse gap-[0.625rem] overflow-auto lg:mb-0 lg:flex-col'>
      <TopBar
        status={PartnerStatusType.DRAFT}
        onSaveData={handleSubmit(onSaveData)}
        onSubmit={handleSubmit(onSubmit)}
        disableFirst={
          (form.formState.isValid && form.formState.isDirty) ||
          demandeId != '' ||
          readOnly
        }
        disableSecond={false}
        isLoading={isPending}
      />
      <FormDemandeSupport form={form} onSubmit={onSubmit} disabled={false} />
    </div>
  )
}

export default DemandeSupport
