import React from 'react'
import { useSupportTranslations } from '@/hooks/useTranslations'

interface SwitcherProps {
  state: string
  setState: React.Dispatch<
    React.SetStateAction<
      'READ' | 'UNREAD' | 'ALL'
    >
  >
  disabled: boolean
}

const Switcher: React.FC<
  SwitcherProps
> = ({ state, setState, disabled }) => {
  const t = useSupportTranslations()
  
  return (
    <div className='flex w-full flex-col items-center gap-4 p-4 lg:p-0'>
      <div className='relative flex h-11 w-full min-w-fit items-center justify-evenly divide-x-2 divide-lynch-200 rounded-[18px] bg-white lg:min-w-60 lg:justify-between lg:divide-x-0 lg:bg-transparent'>
        <button
          disabled={disabled}
          className={`${
            state == 'ALL'
              ? 'text-primary lg:text-white'
              : 'text-lynch-400'
          } z-10 w-full text-base font-normal`}
          type='button'
          onClick={() =>
            setState('ALL')
          }
        >
          {t('switcher.all')}
        </button>
        {/* <hr className='h-6 w-[1px] bg-lynch-200' /> */}
        <button
          disabled={disabled}
          className={`${
            state == 'UNREAD'
              ? 'text-primary lg:text-white'
              : 'text-lynch-400'
          } z-10 w-full text-base font-normal`}
          type='button'
          onClick={() =>
            setState('UNREAD')
          }
        >
          {t('switcher.unread')}
        </button>
        {/* <hr className='h-6 w-[1px] bg-lynch-200' /> */}
        <button
          disabled={disabled}
          className={`${
            state == 'READ'
              ? 'text-primary lg:text-white'
              : 'text-lynch-400'
          } z-10 w-full text-base font-normal`}
          type='button'
          onClick={() =>
            setState('READ')
          }
        >
          {t('switcher.read')}
        </button>
        <div
          className={`absolute rtl:right-0 ltr:left-0 top-0 z-0 hidden h-11 w-1/3 rounded-lg ${!disabled ? 'bg-primary' : 'bg-lynch-400'} lg:flex ${
            state == 'READ'
              ? 'rtl:translate-x-[-200%] ltr:translate-x-[200%]'
              : state == 'UNREAD'
                ? 'rtl:-translate-x-full ltr:translate-x-full'
                : 'translate-x-0'
          } transition-all`}
        />
      </div>
    </div>
  )
}

export default Switcher
