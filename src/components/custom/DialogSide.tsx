import React, { FC, ForwardRefExoticComponent, RefAttributes } from 'react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { CustomButton } from './CustomButton'
import { LucideProps } from 'lucide-react'
import { cn } from '@/lib/utils'

type DialogSideProps = {
    side: 'left' | 'right'
    trigger: string
    triggerIconLeft?: ForwardRefExoticComponent<
        Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
    >
    triggerIconRight?: ForwardRefExoticComponent<
        Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
    >
    triggerClassName?: string
    children: React.ReactNode
    className?: string
    props?: any
    open?: boolean
    setOpen?: (value: boolean) => void
}

const DialogSide: FC<DialogSideProps> = ({
    side,
    trigger,
    triggerIconLeft,
    triggerIconRight,
    triggerClassName,
    children,
    className,
    props,
    open,
    setOpen,
}) => {
    const sideClassName =
        side === 'left'
            ? 'left-0 top-[50%] translate-y-[-50%] data-[state=open]:translate-x-[0] gap-4 border border-neutral-200 bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-none data-[state=closed]:animate-none data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-0 data-[state=open]:zoom-in-0 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[0%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[0%] sm:rounded-none sm:rounded-r-xl rounded-none'
            : ' top-[50%] translate-y-[-50%] data-[state=open]:translate-x-[50%] gap-4 border border-neutral-200 bg-white p-6 shadow-lg duration-200 data-[state=closed]:animate-none data-[state=open]:animate-none data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-0 data-[state=open]:zoom-in-0 data-[state=closed]:slide-out-to-right-full data-[state=closed]:slide-out-to-top-[0%] data-[state=open]:slide-in-from-right-full data-[state=open]:slide-in-from-top-[0%] sm:rounded-none sm:rounded-l-xl rounded-none'
    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => {
                setOpen && setOpen(isOpen)
            }}
        >
            <DialogTrigger>
                <CustomButton
                    label={trigger}
                    className={triggerClassName}
                    IconLeft={triggerIconLeft}
                    IconRight={triggerIconRight}
                />
            </DialogTrigger>
            <DialogContent
                className={cn(
                    `${sideClassName} flex min-w-full flex-col items-start justify-start border border-neutral-200 bg-white p-6 shadow-lg duration-200 sm:rounded-lg lg:w-auto`,
                    className
                )}
                {...props}
                showContent={false}
            >
                {children}
            </DialogContent>
        </Dialog>
    )
}

export default DialogSide
