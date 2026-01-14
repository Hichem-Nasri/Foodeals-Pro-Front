import { FC } from 'react'
import Link from 'next/link'
import { Mail } from 'lucide-react'

export const EmailBadge: FC<{ email: string }> = ({ email }) => {
    return (
        <>
            <Link
                href={`mailto:${email}`}
                className='hidden w-fit cursor-pointer items-center gap-1 rounded-full border border-lynch-400 px-5 py-[0.625rem] text-sm font-medium text-lynch-400 hover:border-amethyst-500 hover:text-amethyst-500 lg:flex'
            >
                <Mail size={18} />
                {email}
            </Link>
            <Link
                href={`mailto:${email}`}
                className='flex size-11 cursor-pointer items-center justify-center text-nowrap rounded-full bg-amethyst-500 p-2 text-sm font-medium text-white lg:hidden'
            >
                <Mail size={24} />
            </Link>
        </>
    )
}
