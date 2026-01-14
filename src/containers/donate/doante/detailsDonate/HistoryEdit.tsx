import { Input } from '@/components/custom/Input'
import { LabelAndAvatar } from '@/components/custom/LabelAndAvatar'
import { Separator } from '@/components/ui/separator'
import HeaderLine from '@/components/utils/HeaderLine'
import { format } from 'date-fns'
import { CalendarMinus, Clock4 } from 'lucide-react'
import React from 'react'

interface HistoryEditProps {
  organizationNameRelaunch: string | null
  relaunchDate: string | null
  organizationNameModifiy: string | null
  modifiyDate: string | null
}

const HistoryEdit: React.FC<HistoryEditProps> = ({
  organizationNameRelaunch,
  relaunchDate,
  organizationNameModifiy,
  modifiyDate,
}) => {
  if (
    !organizationNameRelaunch &&
    !relaunchDate &&
    !organizationNameModifiy &&
    !modifiyDate
  ) {
    return <HeaderLine title='Aucune modification n’a été effectuée' />
  }
  const [dateRelance, hourRelance] = format(
    new Date(relaunchDate!),
    'dd/MM/yyyy HH:mm'
  ).split(' ')
  const [dateModif, hourModif] = format(
    new Date(modifiyDate!),
    'dd/MM/yyyy HH:mm'
  ).split(' ')
  return (
    <>
      <HeaderLine title='Historique des modifications' />
      <div className='container-items'>
        {organizationNameRelaunch && (
          <div className='flex flex-col items-start gap-3'>
            <LabelAndAvatar
              label={'Relancee par'}
              avatar=''
              onChange={() => {}}
              value={organizationNameRelaunch || ''}
              name='organizationNameRelaunch'
            />
            <DateAndHour date={dateRelance} hour={hourRelance} />
          </div>
        )}
        <Separator className='h-[0.5px] w-full bg-lynch-200' />
        {organizationNameModifiy && (
          <div className='flex flex-col items-start gap-3'>
            <LabelAndAvatar
              label={'Modifiee par'}
              avatar=''
              onChange={() => {}}
              value={organizationNameModifiy || ''}
              name='organizationNameModifiy'
            />
            <DateAndHour date={dateModif} hour={hourModif} />
          </div>
        )}
      </div>
    </>
  )
}

const DateAndHour: React.FC<{ date: string; hour: string }> = ({
  date,
  hour,
}) => {
  return (
    <div className='flex items-center gap-2'>
      <Input
        IconLeft={CalendarMinus}
        label='Date'
        placeholder='Date'
        value={date}
        onChange={() => {}}
        disabled
        name={''}
      />
      <Input
        IconLeft={Clock4}
        label='Heure'
        placeholder='Heure'
        value={hour}
        onChange={() => {}}
        disabled
        name={''}
      />
    </div>
  )
}

export default HistoryEdit
