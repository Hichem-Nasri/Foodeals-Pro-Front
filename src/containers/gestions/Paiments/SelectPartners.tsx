import React, {
  useEffect,
  useState,
  useRef,
} from 'react'
import { Control } from 'react-hook-form'

import { usePathname } from 'next/navigation'
import { PartnerInfoDto } from '@/types/GlobalType'
import { SelectField } from '@/components/custom/SelectField'
import { MultiSelectOptionsType } from '@/components/tools/MultiSelect'

const SelectParnter = ({
  control,
  disabled = false,
  name,
  label,
  type,
  id,
  onBlurMode,
  state = 'commissions',
  handleChange,
}: {
  control: Control<any>
  disabled?: boolean
  name: string
  label: string
  type: string
  onBlurMode?: 'onBlur' | 'onChange'
  state: 'commissions' | 'subscriptions'
  handleChange?: () => void
  id?: string
}) => {
  const [search, setSearch] =
    useState('') // Initial search state
  const inputRef =
    useRef<HTMLInputElement>(null)
  const [options, setOptions] =
    useState<MultiSelectOptionsType[]>(
      []
    )
  const path = usePathname()

  useEffect(() => {
    if (inputRef.current)
      inputRef.current.focus()
    // const fetchManagerData = async () => {
    //     const delivery = path.includes('partenaire-livraisons')
    //     const data = await getPartners(type, search, id, state)
    //
    //     setOptions([
    //         ...data.map((partner: PartnerInfoDto) => ({
    //             key: partner.id,
    //             label: partner.name,
    //             avatar: partner.avatarPath,
    //         })),
    //     ])
    //     if (!delivery) {
    //         setOptions((prev) => [
    //             {
    //                 key: 'all',
    //                 label: 'Tous les partenaires',
    //                 avatar: '/all-partners.svg',
    //             },
    //             ...prev,
    //         ])
    //     }
    // }
    // fetchManagerData()
  }, [search, id, type])

  return (
    <SelectField
      onChange={(value) => {
        if (onBlurMode === 'onChange') {
          handleChange && handleChange()
          // handleSubmit(onSubmit)()
        }
      }}
      control={control}
      name={name}
      label={label}
      options={options}
      disabled={disabled}
      search={true} // Enable search
      onChangeSearch={(value) => {
        inputRef.current?.focus()

        setSearch(value) // Update search term
      }}
      placeholder='Selectionner un partenaire'
    />
  )
}

export default SelectParnter
function getPartners(
  type: string,
  search: string,
  id: string | undefined,
  state: string
) {
  throw new Error(
    'Function not implemented.'
  )
}
