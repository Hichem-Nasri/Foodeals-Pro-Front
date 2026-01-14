import { CustomButton } from '@/components/custom/CustomButton'
import { Filter, ListFilter } from 'lucide-react'
import React from 'react'

interface SwitcherProps {
  state: string
  setState: React.Dispatch<React.SetStateAction<'list' | 'localistion'>>
  disabled: boolean
}

const Switcher: React.FC<SwitcherProps> = ({ state, setState, disabled }) => {
  return (
    <div className='flex w-full flex-col items-center py-4 lg:w-fit lg:p-0'>
      <div className='relative flex h-11 w-full min-w-fit items-center justify-evenly gap-4 divide-x-2 divide-lynch-200 rounded-[18px] bg-white lg:h-12 lg:min-w-60 lg:justify-between lg:divide-x-0 lg:rounded-[11px] lg:bg-lynch-100 lg:bg-transparent lg:px-2.5 lg:py-2'>
        {/* <hr className='h-6 w-[1px] bg-lynch-200' /> */}
        <button
          disabled={disabled}
          className={`${
            state == 'list' ? 'text-primary lg:text-white' : 'text-lynch-400'
          } z-10 w-full min-w-24 text-lg font-normal lg:font-semibold`}
          type='button'
          onClick={() => setState('list')}
        >
          Par liste
        </button>
        <button
          disabled={disabled}
          className={`${
            state == 'localistion'
              ? 'text-primary lg:text-white'
              : 'text-lynch-400'
          } z-10 w-full min-w-24 text-lg font-normal lg:font-semibold`}
          type='button'
          onClick={() => setState('localistion')}
        >
          Localisation
        </button>
        {/* <hr className='h-6 w-[1px] bg-lynch-200' /> */}
        <div
          className={`absolute left-0 top-1/2 z-0 hidden h-10 w-1/2 -translate-y-1/2 rounded-lg ${!disabled ? 'bg-primary' : 'bg-lynch-400'} lg:flex ${
            state == 'list' ? 'translate-x-0' : 'translate-x-[calc(100%)]'
          } transition-all`}
        />
      </div>
    </div>
  )
}

export default Switcher
