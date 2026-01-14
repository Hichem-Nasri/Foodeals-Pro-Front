import { cn } from '@/lib/utils'
import React from 'react'

export default function TitleDevider({
    title,
    className = '',
    position = 'center',
    classNameLine,
}: {
    title: string
    className?: string
    position?: 'left' | 'center'
    classNameLine?: string
}) {
    return (
        <div
            className={cn(
                'relative flex w-full items-center gap-4 text-lg text-lynch-400',
                className
            )}
        >
            {position === 'center' && (
                <span
                    className={cn(
                        'h-[0.5px] flex-1 bg-lynch-200',
                        classNameLine
                    )}
                />
            )}

            <h2>{title}</h2>

            <span
                className={cn('h-[0.5px] flex-1 bg-lynch-200', classNameLine)}
            />
        </div>
    )
}
