import { CustomButton } from '@/components/custom/CustomButton'
import { Filter, ListFilter } from 'lucide-react'
import React from 'react'
import { useMarketTranslations } from '@/hooks/useTranslations'

interface SwitcherProps {
  state: string
  setState: React.Dispatch<React.SetStateAction<'pending' | 'valid' | 'cancel'>>
  disabled: boolean
}

const Switcher: React.FC<SwitcherProps> = ({ state, setState, disabled }) => {
  const t = useMarketTranslations()
  
  return (
    <div className='flex w-full flex-col items-center gap-4'>
      <div className='relative flex h-11 w-full min-w-fit items-center justify-evenly divide-x-2 divide-lynch-200 rounded-[18px] bg-white lg:h-14 lg:min-w-60 lg:justify-between lg:divide-x-0 lg:rounded-[11px] lg:bg-lynch-100 lg:bg-transparent'>
        {/* <hr className='h-6 w-[1px] bg-lynch-200' /> */}
        <button
          disabled={disabled}
          className={`${
            state == 'pending' ? 'text-primary lg:text-white' : 'text-lynch-400'
          } z-10 w-full min-w-[100px] text-nowrap text-lg font-medium`}
          type='button'
          onClick={() => setState('pending')}
        >
          {disabled ?"..." : t('dashboard.tabs.pending')}
        </button>
        <button
          disabled={disabled}
          className={`${
            state == 'valid' ? 'text-primary lg:text-white' : 'text-lynch-400'
          } z-10 w-full min-w-[100px] text-lg font-medium`}
          type='button'
          onClick={() => setState('valid')}
        >
          {disabled ?"..." : t('dashboard.tabs.delivered')}
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
          {disabled ?"..." : t('dashboard.tabs.cancelled')}
        </button>
        <div
          className={`absolute rtl:right-0 ltr:left-0 top-1/2 z-0 hidden h-12 rtl:w-[calc(100%/3)] w-[100px] -translate-y-1/2 rounded-lg ${!disabled ? 'bg-primary' : 'bg-lynch-400'} lg:flex ${
            state == 'pending'
              ? 'translate-x-0'
              : state == 'valid'
                ? 'rtl:-translate-x-[calc(100%+2px)] ltr:translate-x-[calc(100%)]'
                : 'rtl:-translate-x-[calc(200%+2px)] ltr:translate-x-[calc(200%)]'
          } transition-all`}
        />
      </div>
    </div>
  )
}

export default Switcher
