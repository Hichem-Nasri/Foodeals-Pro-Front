import { LucideProps } from 'lucide-react'
import React, { FC, ForwardRefExoticComponent, RefAttributes } from 'react'
import { cn } from '@/lib/utils'
import { AvatarAndName } from '../tools/AvatarAndName'

type CustomeLabelProps = {
    label: string
    input: string
    IconLeft?: ForwardRefExoticComponent<
        Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
    >
    IconRight?: ForwardRefExoticComponent<
        Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
    >
    type?: 'avatar' | 'normal'
    className?: string
    classNameParent?: string
    avatar?: string
    onClick?: () => void
}

const CustomLabel: FC<CustomeLabelProps> = ({
    label,
    IconLeft,
    IconRight,
    type = 'normal',
    className,
    classNameParent,
    input,
    avatar,
    onClick,
}) => {
    return (
        <div
            className={cn(
                'flex h-full w-full flex-col items-start justify-normal space-y-2',
                classNameParent
            )}
        >
            <div className='text-sm font-semibold text-lynch-950'>{label}</div>
            <div
                className={cn(
                    'flex min-h-14 w-full items-center justify-start space-x-2 text-wrap rounded-[12px] bg-lynch-50 p-2 px-4 text-start text-base font-normal text-lynch-400',
                    className
                )}
                onClick={onClick}
            >
                {type === 'avatar' ? (
                    <AvatarAndName avatar={avatar} name={input} />
                ) : (
                    <>
                        {IconLeft && (
                            <IconLeft className='icon mr-2 shrink-0 text-mountain-400' />
                        )}
                        {input}
                        {IconRight && (
                            <IconRight className='icon ml-2 shrink-0 text-mountain-400' />
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default CustomLabel
