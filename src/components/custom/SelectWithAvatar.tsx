import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Controller, Control } from 'react-hook-form'
import AvatarAndFallBack from '@/components/tools/AvatarAndFallback'

interface SelectWithAvatarProps
  extends Omit<React.ComponentProps<typeof Select>, 'onValueChange'> {
  options: Array<{ value: string; label: string; image?: string }>
  name: string
  control: Control<any>
  id?: string
  placeholder?: string
}

export default function SelectWithAvatar({
  options,
  name,
  control,
  id = '',
  placeholder,
  ...props
}: SelectWithAvatarProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Select onValueChange={field.onChange} value={field.value} {...props}>
          <SelectTrigger className='w-full border-none text-lynch-400' id={id}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>

          <SelectContent>
            {options.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className='pl-0'
              >
                <div className='flex items-center gap-2'>
                  <AvatarAndFallBack
                    src={option.image}
                    alt={option.label}
                    fallback={option.label}
                  />
                  <span>{option.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
  )
}
