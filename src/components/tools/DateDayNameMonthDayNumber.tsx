import { format } from 'date-fns'
import { Calendar, Timer } from 'lucide-react'

export default function DateDayNameMonthDayNumber({
  date,
}: {
  date: string | number | Date
}) {
  return (
    <div className='flex flex-1 flex-col gap-2'>
      <h3 className='text-lynch-950'>Date</h3>
      <div className='flex items-center gap-1.5'>
        <Calendar />
        <span>{format(date, 'eee, MMMM d')}</span>
      </div>
      <div className='flex items-center gap-1.5'>
        <Timer />
        <span>{format(date, 'HH:mm')}</span>
      </div>
    </div>
  )
}
