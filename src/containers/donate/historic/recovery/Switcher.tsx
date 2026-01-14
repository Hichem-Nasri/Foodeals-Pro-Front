import React from 'react'
import { useDonateTranslations } from '@/hooks/useTranslations'

interface SwitcherProps {
  state: string
  setState: (newStatus: 'valid' | 'cancel') => void
  disabled: boolean
}

const Switcher: React.FC<SwitcherProps> = ({ state, setState, disabled }) => {
  const donateT = useDonateTranslations()
  
  return (
    <div className='flex w-full flex-col items-center gap-4'>
      <div className='relative flex h-11 w-full min-w-fit items-center justify-evenly divide-x-2 divide-lynch-200 rounded-[18px] bg-white lg:h-14 lg:min-w-60 lg:justify-between lg:divide-x-0 lg:rounded-[11px] lg:bg-lynch-100 lg:bg-transparent lg:px-2.5 lg:py-2'>
        {/* <hr className='h-6 w-[1px] bg-lynch-200' /> */}
        <button
          disabled={disabled}
          className={`${
            state == 'valid'
              ? 'text-scooter-500 lg:text-white'
              : 'text-lynch-400'
          } z-10 w-full min-w-[100px] text-lg font-medium`}
          type='button'
          onClick={() => setState('valid')}
        >
          {donateT('history.delivered')}
        </button>
        {/* <hr className='h-6 w-[1px] bg-lynch-200' /> */}
        <button
          disabled={disabled}
          className={`${
            state == 'cancel'
              ? 'text-coral-500 lg:text-white'
              : 'text-lynch-400'
          } z-10 w-full min-w-[100px] text-lg font-medium`}
          type='button'
          onClick={() => setState('cancel')}
        >
          {donateT('history.cancelled')}
        </button>
        <div
          className={`absolute rtl:right-0 ltr:left-0 top-1/2 z-0 hidden h-12 w-[100px] -translate-y-1/2 rounded-lg ${!disabled ? 'bg-scooter-500' : 'bg-lynch-400'} lg:flex ${
            state == 'valid'
              ? 'rtl:-translate-x-3 ltr:translate-x-2.5'
              : 'rtl:-translate-x-[calc(100%+25px)] ltr:translate-x-[calc(100%+10px)]'
          } transition-all`}
        />
      </div>
    </div>
  )
}

export default Switcher
