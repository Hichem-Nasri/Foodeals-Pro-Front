import { SelectField } from '@/components/custom/SelectField'
import { MultiSelectOptionsType } from '@/components/tools/MultiSelect'
import React, { FC } from 'react'
import { Control } from 'react-hook-form'

interface SubCategorySelectProps {
    control: Control<any>
    disabled: boolean
    subCategoryOptions: MultiSelectOptionsType[]
    onSubCategoryChange: (subCategoryId: string) => void
    name: string
}

const SubCategorySelect: FC<SubCategorySelectProps> = ({
    control,
    disabled,
    subCategoryOptions,
    onSubCategoryChange,
    name,
}) => {
    return (
        <SelectField
            control={control}
            placeholder={'Saisir les sous categories'}
            name={name}
            label='Sous Catégories'
            onChange={(e) => onSubCategoryChange(e)}
            options={subCategoryOptions}
            disabled={disabled}
            className='text-lynch-500'
        />
    )
}

export default SubCategorySelect
