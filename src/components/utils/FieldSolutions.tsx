import React, { FC } from 'react'
import { MultiSelectField } from '../custom/MultiSelectField'
import { Control } from 'react-hook-form'
import { cn } from '@/lib/utils'
import { PartnerSolutionType } from '@/types/GlobalType'
import { MultiSelectOptionsType } from '../tools/MultiSelect'
import { PartnerSolution } from './PartnerSolution'
import { useTranslations } from '@/hooks/useTranslations'

interface FieldSolutionProps {
    className?: string
    name?: string
    control: Control<any>
    disabled: boolean
    options?: MultiSelectOptionsType[]
    selectedSolution?: string[]
    onChange?: (value: string[]) => void
}

const defaultOptions: MultiSelectOptionsType[] = [
    {
        key: PartnerSolutionType.MARKET_PRO,
        label: PartnerSolutionType.MARKET_PRO,
    },
    {
        key: PartnerSolutionType.DONATE_PRO,
        label: PartnerSolutionType.DONATE_PRO,
    },
    {
        key: PartnerSolutionType.DLC_PRO,
        label: PartnerSolutionType.DLC_PRO,
    },
]

const FieldSolutions: FC<FieldSolutionProps> = ({
    className,
    control,
    name,
    options = defaultOptions,
    disabled,
    selectedSolution = [],
    onChange,
}) => {
    const { t } = useTranslations()
    
    return (
        <MultiSelectField
            control={control}
            name={name ? name : 'solutionsList'}
            className={cn('h-auto', className)}
            label={t('fields.solutions')}
            options={options}
            transform={(values) => {
                return values.map((value) => (
                    <PartnerSolution
                        key={value.key}
                        solution={value.label as PartnerSolutionType}
                        size={12}
                    />
                ))
            }}
            disabled={disabled}
            selected={selectedSolution}
        />
    )
}

export default FieldSolutions
