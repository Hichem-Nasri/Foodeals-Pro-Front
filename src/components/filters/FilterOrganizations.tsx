import {
  FC,
  useEffect,
  useRef,
  useState,
} from 'react'
import { Control } from 'react-hook-form'
import { MultiSelectField } from '../custom/MultiSelectField'
import { AvatarAndName } from '../tools/AvatarAndName'
import { MultiSelectOptionsType } from '../tools/MultiSelect'
import api from '@/utils/api'
import { SelectField } from '../custom/SelectField'
import { useSession } from 'next-auth/react'
import useDebounce from '../tools/useDebouncing'

interface FilterOrganizationsProps {
  control: Control<any>
  disabled?: boolean
  name: string
  label: string
  placeholder?: string
  url?: string
  withSearch?: string
  fn: (
    data: any
  ) => MultiSelectOptionsType[]
  oneSelect?: boolean
  emptyAvatar?: string
  transform?: (value: any) => any
}

export const FilterOrganizations: FC<
  FilterOrganizationsProps
> = ({
  control,
  disabled = false,
  name,
  placeholder = 'Selectionner',
  label,
  url = '',
  fn,
  withSearch,
  oneSelect = false,
  emptyAvatar = '/images/emptyPartner.png',
  transform,
}) => {
  const [options, setOptions] =
    useState<MultiSelectOptionsType[]>(
      []
    )
  const inputRef =
    useRef<HTMLInputElement>(null)
  const [search, setSearch] =
    useState('')
  const debouncedSearch = useDebounce(
    search,
    300
  )
  const session = useSession()
  useEffect(() => {
    const fetchFilters = async () => {
      const urlFetch =
        withSearch && search == ''
          ? withSearch
          : url.replace(
              ':search',
              search
            )
      console.log(
        'urlFetch: ',
        urlFetch
      )
      const data = await api
        .get(urlFetch)
        .catch((err) => {
          console.error(
            'error Fetching organization'
          )
          return {
            status: 500,
            data: [],
          }
        })
      if (data.status !== 200) {
        console.error(
          'error Fetching organization'
        )
        return
      }
      if (fn) setOptions(fn(data.data))
      // const data = await fetchOragnizations(search, type)
      //
      // setOptions(data)
    }

    if (
      debouncedSearch ||
      search === ''
    ) {
      fetchFilters()
    }
  }, [debouncedSearch, search])

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [options])
  return (
    <>
      {oneSelect ? (
        <SelectField
          control={control}
          name={name}
          label={label}
          options={options}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(value) => {
            const id = options.find(
              (values) =>
                values.key === value
            )?.id
          }}
          transform={transform}
          // emptyAvatar={emptyAvatar}
          search
          onChangeSearch={setSearch}
        />
      ) : (
        <MultiSelectField
          options={options}
          control={control}
          name={name}
          label={label}
          placeholder={placeholder}
          transform={
            transform
              ? transform
              : (value) => {
                  return value.map(
                    (item, index) => {
                      return (
                        <AvatarAndName
                          key={index}
                          name={
                            item.label
                          }
                          avatar={
                            item.avatar
                          }
                        />
                      )
                    }
                  )
                }
          }
          ref={inputRef}
          emptyAvatar={emptyAvatar}
        />
      )}
    </>
  )
}
