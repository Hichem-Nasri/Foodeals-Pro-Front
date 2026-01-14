import React, { FC, useEffect, useState } from 'react'
import { Control } from 'react-hook-form'
import { getRoles } from '@/actions/global'
import { SelectField } from '@/components/custom/SelectField'
import { MultiSelectOptionsType } from '@/components/tools/MultiSelect'

interface FieldRoleProps {
    control: Control<any>
    disabled: boolean
    name?: string
    label?: string
    placeholder?: string
}

const FieldRole: FC<FieldRoleProps> = ({
    control,
    disabled,
    name = 'roleId',
    label = 'Role',
    placeholder = 'Sélectionner le role',
}) => {
    const [roles, setRoles] = useState<MultiSelectOptionsType[]>([])
    useEffect(() => {
        const fetchCountry = async () => {
            const roles = await getRoles()
            setRoles(roles)
        }
        fetchCountry()
    }, [])
    return (
        <SelectField
            control={control}
            name={name}
            label={label}
            options={roles}
            placeholder={placeholder}
            disabled={disabled}
            onChange={(value) => {
                const id = roles.find((values) => values.key === value)?.id
            }}
        />
    )
}

export default FieldRole
