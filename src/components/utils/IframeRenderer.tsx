import { Link2, MapPinned } from 'lucide-react'
import React, { FC, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { FormField } from '../ui/form'
import { Input } from '../custom/Input'

interface IframeRendererProps {
    name: string
    form: UseFormReturn<z.infer<any>>
    disabled?: boolean
}

export const IframeRenderer: FC<IframeRendererProps> = ({
    form,
    disabled,
    name,
}) => {
    const [iframeSrc, setIframeSrc] = useState<string>('')

    const handleInputChange = (e: string | number) => {
        const value = e + ''
        setIframeSrc(value)
        form.setValue(name, value) // Update form state
    }

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <div className='flex flex-col gap-2'>
                    <Input
                        {...field}
                        type='text'
                        label='Iframe URL'
                        value={field.value}
                        IconLeft={Link2}
                        disabled={disabled}
                        onChange={handleInputChange}
                    />
                    <div className='relative h-[300px] w-full rounded-[24px] border-[3px] border-lynch-100 text-lynch-300'>
                        <div
                            className='z-50 h-full w-full rounded-[24px]'
                            dangerouslySetInnerHTML={{
                                __html: iframeSrc
                                    ?.replace(
                                        /width="[^"]+"/,
                                        `width="100%"` // Make width 100% for responsiveness
                                    )
                                    ?.replace(
                                        /height="[^"]+"/,
                                        `height="100%"` // Adjust height accordingly
                                    )
                                    ?.replace(
                                        /style="[^"]+"/,
                                        'style="border-radius:24px;border=0;' // Remove style attribute,
                                    ), // Remove style attribute,
                            }}
                        />
                        {!iframeSrc && (
                            <div className='absolute inset-0 z-0 flex flex-col items-center justify-center'>
                                <MapPinned size={48} />
                                <h4 className='text-center'>Google Map</h4>
                            </div>
                        )}
                    </div>
                </div>
            )}
        />
    )
}
