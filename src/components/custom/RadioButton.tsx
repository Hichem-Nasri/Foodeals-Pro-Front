import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from './Label'
import { Control } from 'react-hook-form'
import { FormField } from '../ui/form'

interface RadioButtonProps {
    control: Control<any>
    options: { key: string; label: string }[]
    name: string
    disabled?: boolean
    onChange?: (value: string) => void
}

export const RadioButton: React.FC<RadioButtonProps> = ({
    options,
    control,
    name,
    disabled,
    onChange,
}) => {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <RadioGroup
                    defaultValue={field.value}
                    className='flex flex-col gap-7 lg:flex-row lg:items-center'
                >
                    {options.map((option) => (
                        <div
                            className='flex items-center space-x-2'
                            key={option.key}
                        >
                            <RadioGroupItem
                                value={option.key}
                                id={option.key}
                                checked={field.value === option.key}
                                onClick={() =>
                                    onChange
                                        ? onChange(option.key)
                                        : field.onChange(option.key)
                                }
                                disabled={disabled}
                            />
                            <Label
                                htmlFor={option.key}
                                label={option.label}
                                className='cursor-pointer'
                            />
                        </div>
                    ))}
                </RadioGroup>
            )}
        />
    )
}
