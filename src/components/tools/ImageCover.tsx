'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useState } from 'react'
import { Label } from '../custom/Label'
import { Input } from '../ui/input'

interface ImageCoverProps {
    src: string
    alt?: string
}

export const ImageCover: React.FC<ImageCoverProps> = ({ alt = '' }) => {
    const [src, setSrc] = useState('https://via.placeholder.com/740x223')
    return (
        <div className='flex flex-col gap-3'>
            <Label label='Image du logo' />
            <Avatar className='h-[223px] w-[740px] rounded-[24px] border border-lynch-200'>
                <Input
                    type='file'
                    className='absolute left-0 top-0 h-full w-full cursor-pointer opacity-0'
                    onChange={(e) =>
                        e.currentTarget.files &&
                        setSrc(URL.createObjectURL(e.currentTarget.files[0]))
                    }
                />
                <AvatarImage src={src} />
                <AvatarFallback>{alt[0].toUpperCase()}</AvatarFallback>
            </Avatar>
        </div>
    )
}
