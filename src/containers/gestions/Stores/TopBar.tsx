import { CustomButton } from '@/components/custom/CustomButton'
import { Filter, ListFilter } from 'lucide-react'
import React from 'react'
import { useStoresTranslations } from '@/hooks/useTranslations'

interface TopBarProps {
    state: string
    setState: React.Dispatch<
        React.SetStateAction<'active' | 'desactive' | 'archive'>
    >
    disabled: boolean
}

const TopBar: React.FC<TopBarProps> = ({ state, setState, disabled }) => {
    const t = useStoresTranslations()
    
    return (
        <div className='flex h-fit w-full flex-col items-center gap-4 p-4 lg:p-0'>
            <div className='relative flex h-11 w-full min-w-fit items-center justify-evenly divide-x-2 divide-lynch-200 rounded-[18px] bg-white lg:min-w-60 lg:justify-between lg:divide-x-0 lg:bg-transparent'>
                <button
                    disabled={disabled}
                    className={`${
                        state == 'active'
                            ? 'text-primary lg:text-white'
                            : 'text-lynch-400'
                    } z-10 w-full text-base font-normal`}
                    type='button'
                    onClick={() => setState('active')}
                >
                    {t('activate')}
                </button>
                {/* <hr className='h-6 w-[1px] bg-lynch-200' /> */}
                <button
                    disabled={disabled}
                    className={`${
                        state == 'desactive'
                            ? 'text-primary lg:text-white'
                            : 'text-lynch-400'
                    } z-10 w-full text-base font-normal`}
                    type='button'
                    onClick={() => setState('desactive')}
                >
                    {t('deactivate')}
                </button>
                {/* <hr className='h-6 w-[1px] bg-lynch-200' /> */}
                <button
                    disabled={disabled}
                    className={`${
                        state == 'archive'
                            ? 'text-coral-500 lg:text-white'
                            : 'text-lynch-400'
                    } z-10 w-full text-base font-normal lg:hidden`}
                    type='button'
                    onClick={() => setState('archive')}
                >
                    {t('archive')}
                </button>
                <div
                    className={`absolute rtl:right-0 ltr:left-0 top-0 z-0 hidden h-11 w-1/3 rounded-lg lg:w-1/2 ${!disabled ? 'bg-primary' : 'bg-lynch-400'} lg:flex ${
                        state == 'active'
                            ? 'translate-x-0'
                            : state == 'desactive'
                              ? 'ltr:translate-x-full rtl:-translate-x-full'
                              : 'bg-transparent'
                    } transition-all`}
                />
            </div>
        </div>
    )
}

export default TopBar
