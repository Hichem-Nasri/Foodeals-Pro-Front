'use client'

import * as React from 'react'
import * as SwitchPrimitives from '@radix-ui/react-switch'

import { cn } from '@/lib/utils'

const Switch = React.forwardRef<
    React.ElementRef<typeof SwitchPrimitives.Root>,
    React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
    <SwitchPrimitives.Root
        className={cn(
            'peer inline-flex h-[18px] w-[30px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-transparent transition-colors data-[state=checked]:border-primary data-[state=unchecked]:border-lynch-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:data-[state=checked]:bg-neutral-50 dark:data-[state=unchecked]:bg-neutral-800 dark:focus-visible:ring-neutral-300 dark:focus-visible:ring-offset-neutral-950',
            className
        )}
        {...props}
        ref={ref}
    >
        <SwitchPrimitives.Thumb
            className={cn(
                'pointer-events-none block h-[9px] w-[9px] rounded-full border-[2px] border-lynch-300 shadow-lg ring-0 transition-transform ltr:data-[state=checked]:translate-x-[14px] ltr:data-[state=unchecked]:translate-x-[2px] rtl:data-[state=checked]:-translate-x-[14px] rtl:data-[state=unchecked]:-translate-x-[2px] data-[state=checked]:border-primary dark:bg-neutral-950'
            )}
        />
    </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
