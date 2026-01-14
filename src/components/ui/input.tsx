import * as React from 'react'

import { cn } from '@/lib/utils'

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    'flex h-14 w-full rounded-[12px] bg-lynch-50 px-3 py-4 text-sm outline-none file:bg-transparent file:text-base file:font-normal placeholder:text-lynch-400 disabled:cursor-default disabled:text-lynch-500',
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Input.displayName = 'Input'

export { Input }
