import Image from 'next/image'
import { FC, useEffect, useState } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ChevronDown, LogOut, Settings, UserCircle } from 'lucide-react'
import { Skeleton } from '../ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { capitalize } from '@/utils/utils'
import { User } from 'next-auth'
import { SignOut } from '@/actions'
import { useTranslations } from '@/hooks/useTranslations'

export const format = (name: string) => {
    if (!name) {
        return ''
    }
    const memo: { [key: string]: string } = {}

    if (memo[name]) {
        return memo[name]
    }

    const [firstName, lastName] = name.split(' ')

    const formattedName = `${capitalize(name)}`
    memo[name] = formattedName

    return formattedName
}
interface UserMenuProps {
    user: User | null
    loading: boolean
}

export const UserMenu: FC<UserMenuProps> = ({ user, loading }) => {
    const { t } = useTranslations()
    const handleLogout = () => {
        SignOut()
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild className=''>
                <Button
                    variant='ghost'
                    className='hidden shrink-0 items-center gap-3 p-0 hover:bg-white lg:inline-flex'
                >
                    <div className='flex items-center gap-3'>
                        {loading && !user?.name ? (
                            <Skeleton className='h-12 w-12 rounded-full bg-lynch-50' />
                        ) : (
                            <Avatar className='border-bg-lynch-400 size-12 rounded-full border-[1px] bg-white text-lynch-500'>
                                <AvatarImage src={user?.image! || ''} />
                                <AvatarFallback>
                                    {user?.name &&
                                        format(user?.name)
                                            .slice(0, 2)
                                            .toLocaleUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        )}
                        <div className='hidden flex-col items-start gap-[3px] lg:flex'>
                            {loading && !user?.name ? (
                                <Skeleton className='h-6 w-24 rounded-full bg-lynch-50' />
                            ) : (
                                <p className='text-base font-normal text-mountain-500'>
                                    {format(user?.name!)}
                                </p>
                            )}
                            {loading && !user?.role ? (
                                <Skeleton className='h-6 w-12 rounded-full bg-lynch-50' />
                            ) : (
                                <p className='text-xs font-semibold text-subtitle'>
                                    {user?.role?.replace('_', ' ')}
                                </p>
                            )}
                        </div>
                        <ChevronDown className='h-4 w-4' />
                    </div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='start' className='min-w-44'>
                <DropdownMenuItem className='flex w-full cursor-pointer items-center justify-between gap-1 p-4 text-lynch-500 transition-all hover:scale-105 hover:bg-lynch-100 hover:text-primary'>
                    <UserCircle className='icon' />
                    <span>{t('header.myProfile')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem className='peer flex w-full cursor-pointer items-center justify-between gap-1 p-4 text-lynch-500 transition-all hover:scale-105 hover:bg-lynch-100 hover:text-primary'>
                    <Settings className='icon' />
                    <span>{t('navigation.settings')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                    className='flex w-full cursor-pointer items-center justify-between gap-1 p-4 text-coral-500 transition-all hover:bg-coral-500 hover:text-white'
                    onClick={() => {
                        handleLogout()
                    }}
                >
                    <LogOut />
                    <span>{t('navigation.logout')}</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
