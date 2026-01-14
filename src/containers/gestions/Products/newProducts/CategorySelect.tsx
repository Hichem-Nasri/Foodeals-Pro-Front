import { SelectField } from '@/components/custom/SelectField'
import { MultiSelectOptionsType } from '@/components/tools/MultiSelect'
import api from '@/utils/api'
import React, { FC, useEffect, useState } from 'react'
import { Control } from 'react-hook-form'

interface CategorySelectProps {
    control: Control<any>
    disabled: boolean
    categoryOptions: MultiSelectOptionsType[]
    onCategoryChange: (categoryId: string) => void
    name: string
}

const CategorySelect: FC<CategorySelectProps> = ({
    control,
    disabled,
    categoryOptions,
    onCategoryChange,
    name,
}) => {
    return (
        <SelectField
            control={control}
            placeholder={'Saisir les categories'}
            name={name}
            label='Catégories'
            onChange={(e) => onCategoryChange(e)}
            options={categoryOptions}
            disabled={disabled}
            className='text-lynch-500'
        />
    )
}

export default CategorySelect
