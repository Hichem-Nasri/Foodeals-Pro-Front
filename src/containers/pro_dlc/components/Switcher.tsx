import { CustomButton } from '@/components/custom/CustomButton'
import { useLocale, useTranslations } from '@/hooks/useTranslations'
import { cn } from '@/lib/utils'
import { Filter, ListFilter } from 'lucide-react'
import React from 'react'

interface SwitcherProps {
  state: string
  setState: React.Dispatch<
    React.SetStateAction<'all' | 'urgente' | 'exigee' | 'souhaitable'>
  >
  disabled: boolean
}

const Switcher: React.FC<SwitcherProps> = ({ state, setState, disabled }) => {
  const { t } = useTranslations();
  const locale = useLocale()
  
  return (
    <div className='flex w-full flex-col items-center gap-4'>
      <div className='relative flex h-11 w-full min-w-fit items-center justify-evenly divide-x-2 divide-lynch-200 rounded-[18px] bg-white shadow-sm shadow-black/10 lg:h-14 lg:min-w-60 lg:justify-between lg:divide-x-0 lg:rounded-[11px] lg:bg-lynch-100 lg:bg-transparent lg:px-0 lg:py-2 lg:shadow-none'>
        {/* <hr className='h-6 w-[1px] bg-lynch-200' /> */}
        <button
          disabled={disabled}
          className={`${
            state == 'all' ? 'text-tulip-400 lg:text-white' : 'text-lynch-400'
          } z-10 w-full min-w-[60px] text-nowrap text-sm font-medium sm:text-lg lg:min-w-[100px]`}
          type='button'
          onClick={() => setState('all')}
        >
          {t('dlc.tabs.all')}
        </button>
        <button
          disabled={disabled}
          className={`${
            state == 'urgente'
              ? 'text-coral-500 lg:text-white'
              : 'text-lynch-400'
          } z-10 w-full min-w-[60px] text-sm font-medium sm:text-lg lg:min-w-[100px]`}
          type='button'
          onClick={() => setState('urgente')}
        >
          {t('dlc.tabs.urgent')}
        </button>
        {/* <hr className='h-6 w-[1px] bg-lynch-200' /> */}
        <button
          disabled={disabled}
          className={`${
            state == 'exigee'
              ? 'text-tulip-400 lg:text-white'
              : 'text-lynch-400'
          } z-10 w-full min-w-[60px] text-sm font-medium sm:text-lg lg:min-w-[100px]`}
          type='button'
          onClick={() => setState('exigee')}
        >
          {t('dlc.tabs.required')}
        </button>
        <button
          disabled={disabled}
          className={`${
            state == 'souhaitable'
              ? 'text-primary lg:text-white'
              : 'text-lynch-400'
          } z-10 w-full min-w-[60px] text-sm font-medium sm:text-lg lg:min-w-[100px]`}
          type='button'
          onClick={() => setState('souhaitable')}
        >
          {t('dlc.tabs.desirable')}
        </button>
        <div
          className={cn(
            `absolute rtl:right-0 ltr:left-0 top-1/2 z-0 hidden h-10 w-[100px] -translate-y-1/2 rounded-lg ${!disabled ? 'bg-tulip-400' : 'bg-lynch-400'} lg:flex ${
              state == 'all'
                ? 'translate-x-0'
                : state == 'urgente'
                  ? 'rtl:-translate-x-[calc(100%+2px)] ltr:translate-x-[calc(100%+2px)]'
                  : state == 'exigee'
                    ? 'rtl:-translate-x-[calc(200%+2px)] ltr:translate-x-[calc(200%+2px)]'
                    : 'rtl:-translate-x-[calc(300%-2px)] ltr:translate-x-[calc(300%-2px)]'
            } transition-all`,
            state == 'souhaitable' && locale == "fr" && 'w-[120px] ltr:translate-x-[calc(300%-60px)]'
          )}
        />
      </div>
    </div>
  )
}

export default Switcher
