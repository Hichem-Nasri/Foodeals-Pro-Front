import { InputFieldForm } from '@/components/custom/InputField'
import { Select } from '@/components/custom/Select'
import { FC } from 'react'
import { Control } from 'react-hook-form'

interface AmountAndCurrencyProps {
    control: Control<FormData>
    currencies: string
    setCurrencies: (value: string) => void
    label?: string
    name?: string
}

const AmountAndCurrency: FC<AmountAndCurrencyProps> = ({
    control,
    currencies,
    setCurrencies,
    label = 'Montant a payer',
    name = 'amount',
}) => {
    const currenciesOptions = [
        'MAD',
        'USD',
        'EUR',
        'GBP',
        'JPY',
        'AUD',
        'CAD',
    ].map((currency) => ({
        key: currency,
        label: currency,
    }))
    return (
        <div className='flex w-full items-end gap-4'>
            <InputFieldForm
                label={label}
                name={name}
                control={control}
                placeholder='Enter amount'
                type='number'
            />
            <Select
                classNameParent='w-auto text-nowrap'
                label=''
                value={currencies}
                options={currenciesOptions}
                onChange={(value) => {
                    setCurrencies(value as string)
                }}
            />
        </div>
    )
}

export default AmountAndCurrency
