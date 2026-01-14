import { Checkbox } from '@/components/ui/checkbox'
import { FormField, FormMessage } from '@/components/ui/form'
import { Label } from '@/components/ui/label'

interface CheckboxFieldProps {
  control: any
  name: string
  label: string
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  control,
  name,
  label,
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <>
          <div className='flex items-center gap-2'>
            <Checkbox
              {...field}
              checked={field.value}
              onCheckedChange={field.onChange}
              id={name}
            />
            <Label
              htmlFor={name}
              className='cursor-pointer text-sm font-normal text-lynch-400'
            >
              {label}
            </Label>
          </div>
          <FormMessage />
        </>
      )}
    />
  )
}
