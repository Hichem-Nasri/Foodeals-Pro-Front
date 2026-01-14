import { FC } from 'react'
import Link from 'next/link'
import { House, ShoppingBasket, X, Salad, LineChart } from 'lucide-react'
import { CustomButton } from '@/components/custom/CustomButton'

interface FooterNavProps {
  isSelectionMode?: boolean
  handleValorisation?: () => void
  onCancelSelection?: () => void
}

export const FooterNav: FC<FooterNavProps> = ({
  isSelectionMode = false,
  onCancelSelection,
  handleValorisation,
}) => {
  if (isSelectionMode) {
    return (
      <nav className='flex w-full items-center justify-around gap-3 rounded-t-[32px] bg-white p-4 shadow-lg'>
        <CustomButton
          variant='outline'
          label='ANNULER'
          onClick={onCancelSelection}
          className='w-full'
          IconLeft={X}
        />

        <CustomButton
          label='VALORISER'
          onClick={handleValorisation}
          className='w-full bg-[#FAC215] text-white hover:bg-[#FAC215]'
          IconRight={Salad}
        />
      </nav>
    )
  }

  return (
    <nav className='flex w-full items-center justify-around rounded-t-[32px] bg-white py-4 shadow-lg'>
      <Link
        href='/dlc'
        className='flex w-1/3 flex-col items-center justify-center'
      >
        <div className='flex flex-col items-center gap-1'>
          <div className='flex h-10 w-10 items-center justify-center rounded-full bg-white'>
            <House className='h-5 w-5 text-yellow-400' />
          </div>
          <span className='text-[10px] font-medium text-yellow-400'>DLC</span>
        </div>
      </Link>
      <Link
        href='/decisions'
        className='flex w-1/3 flex-col items-center justify-center'
      >
        <div className='flex flex-col items-center gap-1'>
          <div className='flex h-10 w-10 items-center justify-center rounded-full bg-white'>
            <ShoppingBasket className='h-5 w-5 text-gray-400' />
          </div>
          <span className='text-[10px] font-medium text-gray-400'>
            Décisions
          </span>
        </div>
      </Link>
      <Link
        href='/statistiques'
        className='flex w-1/3 flex-col items-center justify-center'
      >
        <div className='flex flex-col items-center gap-1'>
          <div className='flex h-10 w-10 items-center justify-center rounded-full bg-white'>
            <LineChart className='h-5 w-5 text-gray-400' />
          </div>
          <span className='text-[10px] font-medium text-gray-400'>
            Statistiques
          </span>
        </div>
      </Link>
    </nav>
  )
}
