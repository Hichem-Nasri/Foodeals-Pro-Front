import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CalendarMinus2, Eye, Mail, PhoneCall, TextQuote } from 'lucide-react'
import React, { FC } from 'react'
import Link from 'next/link'
import { AppRoutes } from '@/lib/routes'
import { SupportType } from '@/types/support'
import { capitalize } from '@/utils/utils'
import { useSupportTranslations } from '@/hooks/useTranslations'

interface SupportCardProps {
    message: SupportType
}

const SupportCard: FC<SupportCardProps> = ({ message }) => {
    const { sender, title, id } = message
    const createdAtDate = new Date(message.creationDate)
    const date = createdAtDate.toLocaleDateString()
    const hour = createdAtDate.getHours()
    const minutes = createdAtDate.getMinutes()
    const fullName = `${capitalize(sender?.name?.firstName)} ${capitalize(sender?.name?.lastName)}`
    const t = useSupportTranslations()
    
    return (
        <div className='col-span-1 m-auto flex min-h-[160px] w-full flex-col items-center justify-center space-y-4 rounded-2xl bg-white p-4'>
            <div className='flex w-full items-center justify-between'>
                <div className='flex flex-col items-center justify-start space-y-2'>
                    <div className='flex h-12 w-full items-center justify-center space-x-2'>
                        <Avatar className='h-12 w-12'>
                            <AvatarImage src={sender.avatarPath!} />
                            <AvatarFallback>
                                {fullName.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className='flex flex-col items-start justify-center'>
                            <p className='w-full text-xl font-normal text-lynch-950'>
                                {fullName}
                            </p>
                            <p className='font-medium text-mountain-400'>
                                {capitalize(message?.sender?.role?.name)}
                            </p>
                        </div>
                    </div>
                    <div className='text-md flex flex-1 items-center justify-center space-x-2 text-lynch-400'>
                        <CalendarMinus2 className='text-lynch-500' />
                        <p>
                            {date +
                                ' ' + t('at') + ' ' +
                                hour.toString().padStart(2, '0') +
                                'h' +
                                minutes.toString().padStart(2, '0')}
                        </p>
                    </div>
                </div>
                <div className='flex w-auto flex-row-reverse flex-wrap items-center justify-around gap-x-[10px]'>
                    <Link
                        href={`${AppRoutes.supportDetails.replace(':id', id)}`}
                        className='grid size-11 cursor-pointer place-items-center rounded-full bg-lynch-300 text-white transition-all hover:border-2 hover:border-lynch-400 hover:bg-transparent hover:text-lynch-400'
                    >
                        <Eye />
                    </Link>
                    <Link
                        href={`mailto:${sender.email}`}
                        className='grid size-11 cursor-pointer place-items-center rounded-full bg-amethyst-500 text-white transition-all hover:border-2 hover:border-amethyst-500 hover:bg-transparent hover:text-amethyst-500'
                    >
                        <Mail />
                    </Link>
                    <Link
                        href={`tel:${sender.phone}`}
                        className='grid size-11 cursor-pointer place-items-center rounded-full bg-mountain-400 text-white transition-all hover:border-2 hover:border-mountain-400 hover:bg-transparent hover:text-mountain-400'
                    >
                        <PhoneCall />
                    </Link>
                </div>
            </div>
            <span className='h-[1px] w-full bg-lynch-100' />
            <div className='relative m-auto flex h-auto w-full flex-col items-center justify-center rounded-full bg-lynch-100 px-4 py-2 pl-8 text-start font-semibold text-lynch-500'>
                <TextQuote className='absolute left-4 top-2 size-6 font-semibold' />
                <p className='h-full px-4 text-sm'>
                    {t('object').toUpperCase()}: {title.toUpperCase()}
                </p>
            </div>
        </div>
    )
}

export default SupportCard
