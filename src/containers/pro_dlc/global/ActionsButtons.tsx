'use client'

import React from 'react'
import { ArrowLeft, Salad } from 'lucide-react'
import { CustomButton } from '@/components/custom/CustomButton'
import { useTranslations } from '@/hooks/useTranslations'

interface SelectionActionsProps {
    onClearSelection?: () => void
    onValorisation?: () => void
    valorisationText?: string
    showValorisation?: boolean
    className?: string
}

const SelectionActions: React.FC<SelectionActionsProps> = ({
    onClearSelection,
    onValorisation,
    valorisationText,
    showValorisation = true,
    className = '',
}) => {
    const { t } = useTranslations();
    const defaultText = t('dlc.valorization');
    
    return (
        <div
            className={`sticky bottom-0 hidden w-full items-center justify-between gap-3 rounded-2xl bg-white p-4 lg:flex ${className}`}
        >
            <CustomButton
                variant='outline'
                size={'sm'}
                onClick={onClearSelection}
                className='w-fit'
                label={t('common.back')}
                IconLeft={ArrowLeft}
            />

            {showValorisation && (
                <CustomButton
                    size='sm'
                    onClick={onValorisation}
                    className='w-fit bg-tulip-400 text-white hover:border-tulip-400 hover:bg-tulip-100 hover:text-tulip-400'
                    label={valorisationText || defaultText}
                    IconRight={Salad}
                />
            )}
        </div>
    )
}

export default SelectionActions
