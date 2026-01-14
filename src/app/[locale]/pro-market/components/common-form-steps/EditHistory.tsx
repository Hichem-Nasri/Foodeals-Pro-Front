import AvatarAndFallBack from '@/components/tools/AvatarAndFallback'
import { AvatarAndName } from '@/components/tools/AvatarAndName'
import { Separator } from '@/components/ui/separator'
import TitleDevider from '@/components/utils/TitleDevider'
import { useGetRelaunchEditHistory } from '@/hooks/pro-market/queries/offrers-queries'
import { AxiosError } from 'axios'
import { format } from 'date-fns'
import { CalendarMinus2, Clock, LoaderCircle } from 'lucide-react'

export default function EditHistory({ boxId }: { boxId: string }) {
  const { data, error, isLoading } = useGetRelaunchEditHistory(boxId)
  if (isLoading)
    return (
      <div className='flex justify-center'>
        <LoaderCircle className='animate-spin text-mountain-400' size={30} />
      </div>
    )

  if (!isLoading && error) {
    if (error instanceof AxiosError) {
      if (
        error.status === 404 ||
        error.status === 401 ||
        error.status === 400
      ) {
        return null
      }
    }
    throw new Error(error.message)
  }

  if (data)
    return (
      <div className='flex flex-col gap-6'>
        <TitleDevider title='Historique des modifications' />
        <div className='flex flex-col gap-6 rounded-[30px] bg-white px-4 py-6 text-lynch-500'>
          <EditRelaunchedBy
            title='Relancée par'
            editorName={data.organizationNameRelaunch}
            date={data.relaunchDate}
          />
          <Separator className='bg-lynch-50 last:hidden' />
          <EditRelaunchedBy
            title='Modifiée par'
            editorName={data.organizationNameModifiy}
            date={data.modifiyDate}
          />
        </div>
      </div>
    )
}

function EditRelaunchedBy({
  title,
  editorName,
  editorAvatar = '',
  date,
}: {
  title: string
  editorName: string | null
  editorAvatar?: string
  date: string | Date | null
}) {
  if (!date || !editorName) return null
  return (
    <div className='flex flex-col gap-6'>
      <div>
        <LabelWithData label={title}>
          <AvatarAndName
            avatar={editorAvatar}
            name={editorName}
            classNameName='text-lynch-500'
          />
        </LabelWithData>
      </div>
      <div className='flex gap-3'>
        <LabelWithData label='Date'>
          <div className='flex items-center gap-3'>
            <CalendarMinus2 className='text-mountain-400' />
            <span>{format(date, 'dd/MM/yyyy')}</span>
          </div>
        </LabelWithData>
        <LabelWithData label='Heure'>
          <div className='flex items-center gap-3'>
            <Clock className='text-mountain-400' />
            <span>{format(date, "HH'h'mm")}</span>
          </div>
        </LabelWithData>
      </div>
    </div>
  )
}

function LabelWithData({
  children,
  label,
}: {
  children: React.ReactNode
  label: string
}) {
  return (
    <div className='flex flex-1 flex-col gap-3'>
      <label className='text-sm font-medium text-lynch-950'>{label}</label>
      <div className='rounded-[12px] bg-lynch-50 px-3 py-4'>{children}</div>
    </div>
  )
}
