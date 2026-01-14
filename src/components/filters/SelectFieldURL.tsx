import { FC, useEffect, useRef, useState } from 'react'
import { Control } from 'react-hook-form'
import { MultiSelectField } from '../custom/MultiSelectField'
import { AvatarAndName } from '../tools/AvatarAndName'
import { MultiSelectOptionsType } from '../tools/MultiSelect'
import api from '@/utils/api'
import { SelectField } from '../custom/SelectField'
import { useSession } from 'next-auth/react'

interface FilterOrganizationsProps {
    control: Control<any>
    disabled?: boolean
    name: string
    label: string
    placeholder?: string
    url?: string
    withSearch?: string
    fn: (data: any) => MultiSelectOptionsType[]
    onSelect?: boolean
}

export const FilterOrganizations: FC<FilterOrganizationsProps> = ({
    control,
    disabled = false,
    name,
    placeholder = 'Selectionner',
    label,
    url = '',
    fn,
    withSearch,
    onSelect = false,
}) => {
    const [options, setOptions] = useState<MultiSelectOptionsType[]>([])
    const inputRef = useRef<HTMLInputElement>(null)
    const [search, setSearch] = useState('')
    const session = useSession()
    useEffect(() => {
        if (inputRef.current) inputRef.current.focus()
        const fetchFilters = async () => {
            const urlFetch = withSearch
                ? withSearch
                : url.replace(':search', search)
            const data = await api.get(urlFetch).catch((err) => {
                console.error('error Fetching organization')
                return { status: 500, data: [] }
            })
            if (data.status !== 200) {
                console.error('error Fetching organization')
                return
            }
            if (fn) setOptions(fn(data.data))
            // const data = await fetchOragnizations(search, type)
            //
            // setOptions(data)
        }
        fetchFilters()
    }, [search])
    return (
        <>
            {onSelect ? (
                <SelectField
                    control={control}
                    name={name}
                    label={label}
                    options={options}
                    placeholder={placeholder}
                    disabled={disabled}
                    onChange={(value) => {
                        const id = options.find(
                            (values) => values.key === value
                        )?.id
                    }}
                />
            ) : (
                <MultiSelectField
                    options={options}
                    control={control}
                    name={name}
                    label={label}
                    placeholder={'Selectionner'}
                    transform={(value) => {
                        return value.map((item, index) => {
                            return (
                                <AvatarAndName
                                    key={index}
                                    name={item.label}
                                    avatar={item.avatar}
                                />
                            )
                        })
                    }}
                    ref={inputRef}
                    emptyAvatar='/images/emptyPartner.png'
                />
            )}
        </>
    )
}
