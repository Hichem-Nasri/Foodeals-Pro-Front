'use client'

import { motion } from 'framer-motion'
import {
    HandPlatterIcon as Plate,
    TreesIcon as Plant,
    HandHeart,
} from 'lucide-react'
import Image from 'next/image'
import { useAuthTranslations } from '@/hooks/useTranslations'

export default function OnboardingScreen() {
    const t = useAuthTranslations()
    
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.5,
            },
        },
    }

    const itemVariants = {
        hidden: {
            opacity: 0,
            x: -30,
        },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.7,
                ease: 'easeOut',
            },
        },
    }

    return (
        <motion.div
            className='relative h-screen min-w-full bg-primary p-2 flex-col-center-evenly lg:h-full lg:bg-transparent'
            variants={containerVariants}
            initial='hidden'
            animate='visible'
            // id='logo'
        >
            {/* Dashed line connector */}
            {/* <div className='absolute bottom-24 left-16 top-24 -z-10 border-l-2 border-dashed border-white/30' /> */}

            {/* First section */}
            <motion.div
                className='ml-8 flex items-center gap-4 self-start p-0 lg:gap-8 lg:p-8'
                variants={itemVariants}
            >
                <Image
                    alt='auth'
                    width={96}
                    height={96}
                    src='/icons/auth-icon-1.svg'
                    className='h-32 w-32 animate-smoothBounce lg:h-32 lg:w-32 z-10'
                />
                <span className='text-xl font-medium text-white lg:text-2xl'>
                    {t('onboarding.eatWell')}
                </span>
            </motion.div>
            <img
                alt='auth'
                src='/icons/Linev2.svg'
                className='absolute left-0 right-0 top-1/4 min-w-full'
            />
            {/* Second section */}
            <motion.div
                className='ml-8 flex items-center gap-4 p-0 lg:gap-8 lg:p-8'
                variants={itemVariants}
            >
                <span className='text-wrap text-xl font-medium text-white lg:text-2xl'>
                    {t('onboarding.giveToNeedy')}
                </span>
                <Image
                    alt='auth'
                    width={96}
                    height={96}
                    src='/icons/auth-icon-3.svg'
                    className='h-32 w-32 animate-smoothBounceRotate lg:h-32 lg:w-32'
                />
            </motion.div>
            <img
                alt='auth'
                src='/icons/Linev1.svg'
                className='absolute bottom-1/4 left-0 right-0 flex min-w-full lg:hidden'
            />
            <img
                alt='auth'
                src='/icons/Linev3.svg'
                className='absolute bottom-1/4 hidden w-full max-w-[80%] lg:flex-center'
            />
            {/* Third section */}
            <motion.div
                className='mr-8 flex items-center gap-4 self-end p-0 lg:gap-8 lg:p-8'
                variants={itemVariants}
            >
                <Image
                    alt='auth'
                    width={96}
                    height={96}
                    src='/icons/auth-icon-2.svg'
                    className='h-32 w-32 animate-[smoothBounceRotate_4s_infinite] lg:h-32 lg:w-32 z-10'
                />
                <span className='text-xl font-medium text-white lg:text-2xl'>
                    {t('onboarding.transformLossesToGains')}
                </span>
            </motion.div>
        </motion.div>
    )
}
