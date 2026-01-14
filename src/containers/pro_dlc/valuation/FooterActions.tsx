'use client'

import React from 'react'
import { ArrowLeft, Salad } from 'lucide-react'
import { CustomButton } from '@/components/custom/CustomButton'
import { useRouter } from 'next/navigation'
import { useCommonTranslations, useDlcTranslations } from '@/hooks/useTranslations'

interface SelectionActionsProps {
    onClearSelection?: () => void
    onValorisation?: () => void
    valorisationText?: string
    showValorisation?: boolean
    className?: string
}

export const SelectionActions: React.FC<SelectionActionsProps> = ({
    onClearSelection,
    onValorisation,
    valorisationText,
    showValorisation = true,
    className = '',
}) => {
    const router = useRouter()
    const tCommon = useCommonTranslations()
    const tDlc = useDlcTranslations()
    
    const buttonText = valorisationText || tDlc('actions.valorize')
    
    return (
        <div
            className={`hidden w-full justify-between rounded-2xl bg-white p-4 lg:flex ${className}`}
        >
            <CustomButton
                variant='outline'
                size={'sm'}
                onClick={() => router.back()}
                className=''
                label={tCommon('back')}
                IconLeft={ArrowLeft}
            />

            {showValorisation && (
                <button
                    className='flex h-[48px] w-[189px] items-center justify-center gap-3 rounded-xl bg-[#FAC215] px-5 py-3'
                    onClick={onValorisation}
                >
                    <span className='font-montserrat text-[14px] font-medium leading-[17.07px] text-white'>
                        {buttonText}
                    </span>
                    <Salad
                        size={24}
                        className='text-white'
                        style={{ padding: '3.32px 2.47px 3px 3px' }}
                    />
                </button>
            )}
        </div>
    )
}

export default SelectionActions
