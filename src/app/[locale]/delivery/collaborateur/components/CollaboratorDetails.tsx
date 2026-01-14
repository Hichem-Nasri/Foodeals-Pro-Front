'use client'
import { collaboratorQueries } from '@/hooks/delivery/queries/collaborator-queries'
import {
  addCollabFormDefaultValues,
  AddCollabFormType,
  testCollaborator,
} from './AddNewCollabISchema'
import AddnewCollabForm from './AddNewCollaboratorForm'
import { useMemo } from 'react'
import { useCommonTranslations } from '@/hooks/useTranslations'

export default function CollaboratorDetails({ id }: { id: string }) {
  const tCommon = useCommonTranslations()
  const { data, isLoading, error } =
    collaboratorQueries.useGetCollaboratorById(id)

  const fetchedCollabDetails: AddCollabFormType = useMemo(() => {
    const defaultWorkScheduleData = addCollabFormDefaultValues.workSchedules
    return {
      avatarPath: data?.avatarPath || '',
      civility: data?.civility || '',
      firstName: data?.name.firstName || '',
      lastName: data?.name.lastName || '',
      nationality: data?.nationality || '',
      cin: data?.cin || '',
      role: data?.role.name || '',
      phone: data?.phone || '',
      email: data?.email || '',
      city: data?.address?.city && data?.address.city.name,
      manager: data?.managerName
        ? `${data.managerName.firstName} ${data.managerName.lastName}`
        : '',
      solution: data?.solutions.map((s) => s.name) || [],
      zone: [],
      address: data?.address?.address || '',

      workSchedules: defaultWorkScheduleData.map((d) => {
        const dataDay = data?.workSchedules.find(
          (day) => day.dayOfWeek === d.day
        )

        if (dataDay) {
          const {
            morningStart = '',
            morningEnd = '',
            afternoonStart = '',
            afternoonEnd = '',
          } = dataDay
          const formatTime = (time: string) => {
            if (!time) return ''
            return time.replace(/:00:00$/, 'h')
          }

          return {
            day: dataDay.dayOfWeek,
            morning: {
              start: formatTime(morningStart),
              end: formatTime(morningEnd),
            },
            afternoon: {
              start: formatTime(afternoonStart),
              end: formatTime(afternoonEnd),
            },
            enabled: true,
          }
        }
        return d
      }),
    }
  }, [data])

  if (isLoading) {
    return <pre>{tCommon('loading')}</pre>
  }

  if (error) {
    return <pre>{error.message}</pre>
  }

  return <AddnewCollabForm defaultValues={fetchedCollabDetails} showForm />
}
