import { Skeleton } from '@/components/ui/skeleton'

export default function OffreDetailsFormLoading({
  type = 'normal',
}: {
  type?: 'normal' | 'surprise'
}) {
  return (
    <div className='flex flex-col gap-3 px-2'>
      {type === 'normal' && (
        <div className='rounded-[30px] bg-white p-4'>
          <Skeleton className='h-96 w-full rounded-[16px] bg-lynch-100' />
        </div>
      )}
      {'abc'.split('').map((s) => (
        <div
          key={s}
          className='flex flex-col gap-3 rounded-[30px] bg-white p-4'
        >
          {'abc'.split('').map((l) => (
            <div key={`input-${l}`} className='flex flex-col gap-2'>
              <Skeleton className='h-3 w-28 bg-lynch-100' />
              <Skeleton className='h-14 w-full bg-lynch-50' />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
