import Image from 'next/image'
import { Label } from '../ui/label'

export const Footer: React.FC = () => {
  return (
    <div className='hidden w-full items-center justify-between bg-lynch-50 px-6 py-[0.625rem] lg:flex'>
      <div className='flex items-center gap-[0.625rem] text-lynch-700'>
        <Image
          src='/images/symbole-foodeals.svg'
          alt='logo'
          width={32}
          height={32}
        />
        <Label>Foodeals pro @ 2025</Label>
      </div>
      <div className='text-lynch-700'>
        <Label>
          <span className='cursor-pointer underline underline-offset-1 transition-all hover:scale-90 hover:underline-offset-2'>
            Conditions générales
          </span>{' '}
          &{' '}
          <span className='cursor-pointer underline underline-offset-1 transition-all hover:scale-90 hover:underline-offset-2'>
            Politique de confidentialité
          </span>
        </Label>
      </div>
    </div>
  )
}
