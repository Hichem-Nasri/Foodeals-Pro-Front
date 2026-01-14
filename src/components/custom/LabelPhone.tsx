import React, { FC, ForwardRefExoticComponent, RefAttributes } from 'react'
import { LucideProps } from 'lucide-react'
// import { countryCodes } from '@/utils/utils'

interface LabelPhoneProsps {
    label: string
    value: string
    countryCode: string
    IconLeft?: ForwardRefExoticComponent<
        Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
    >
    IconRight?: ForwardRefExoticComponent<
        Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
    >
}

const LabelPhone: FC<LabelPhoneProsps> = ({
    label,
    value,
    countryCode,
    IconLeft,
    IconRight,
}) => {
    return (
        <div className='flex w-full flex-col items-start justify-center gap-3 text-lynch-500'>
            <label className='text-sm font-semibold text-lynch-950'>
                {label}
            </label>
            <div className='flex h-14 w-full items-center justify-center space-x-1'>
                <div className='flex h-full w-fit min-w-fit items-center justify-center gap-[0.625rem] rounded-[12px] border-0 bg-lynch-50 px-2 text-base font-light'>
                    {([] as { label: string; key: string }[]).map((option) =>
                        option.label == countryCode ? option.key : null
                    )}
                    <span>{countryCode}</span>
                </div>
                <div className='flex h-full flex-1 items-center justify-start space-x-1 rounded-[12px] bg-lynch-50 text-base font-normal'>
                    {IconLeft && (
                        <IconLeft className='ml-2 text-mountain-400' />
                    )}
                    <span>{value}</span>
                    {IconRight && (
                        <IconRight className='mr-2 text-mountain-400' />
                    )}
                </div>
            </div>
        </div>
    )
}

export default LabelPhone
