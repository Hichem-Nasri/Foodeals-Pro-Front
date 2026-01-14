import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
    'inline-flex items-center justify-center whitespace-nowrap rounded-[18px] text-sm font-medium transition-colors focus-visible:outline-none  disabled:pointer-events-none disabled:opacity-50',
    {
        variants: {
            variant: {
                default:
                    'bg-primary text-neutral-50 hover:bg-primary/90 disabled:bg-lynch-300',
                destructive:
                    'border-lynch-200 opacity-100 disabled:h-12 disabled:rounded-[12px] disabled:text-lynch-400 text-lynch-400 font-semibold disabled:opacity-100 text-lg disabled:border-lynch-200 py-3 px-5 disabled:py-3 disabled:p-0 disabled:px-5 bg-transparent border-[1px] gap-2',
                outline:
                    'border border-lynch-300 text-lynch-500 bg-transparent hover:bg-neutral-100 hover:text-black disabled:border-lynch-300 disabled:text-lynch-300 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-800 dark:hover:text-neutral-50',
                secondary:
                    'bg-transparent text-mountain-400 hover:bg-mountain-500 hover:text-white border border-primary',
                ghost: 'hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-50',
                link: 'text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-50',
            },
            size: {
                default: 'h-16 p-5',
                sm: 'p-3 h-fit rounded-[12px]',
                lg: 'h-11 rounded-md px-8',
                icon: 'h-10 w-10',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : 'button'
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
