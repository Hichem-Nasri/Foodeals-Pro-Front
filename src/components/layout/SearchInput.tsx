'use client'
import { FC } from 'react'
import { Input } from '../custom/Input'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '../ui/form'
import { Search } from 'lucide-react'
import { InputFieldForm } from '../custom/InputField'
import { useCommonTranslations } from '@/hooks/useTranslations'

interface SearchInputProps {
  onChange: (value: string) => void
}

export const SearchInput: FC<SearchInputProps> = ({ onChange }) => {
  const t = useCommonTranslations()
  const schema = z.object({
    search: z.string().optional(),
  })
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: {
      search: '',
    },
  })
  const { handleSubmit, control } = form

  const onsubmit = (data: z.infer<typeof schema>) => {
    onChange(data.search!)
  }
  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onsubmit)} className='w-full'>
        <InputFieldForm
          control={control}
          name='search'
          placeholder={t('search')}
          className='h-fit bg-white py-3 lg:w-[23.438rem] lg:bg-lynch-50'
          iconLeftColor='text-lynch-300'
          IconLeft={Search}
        />
      </form>
    </Form>
  )
}

