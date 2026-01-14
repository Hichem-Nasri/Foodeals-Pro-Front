'use client'
import React, { useEffect, useState } from 'react'
import anime from 'animejs'

import OnboardingScreen from '@/containers/auth/AnimationPart'
import { useMediaQuery } from 'react-responsive'
import Loading from '@/app/[locale]/loading'

const SplashScreen = ({
    finishLoading,
    loop = false,
}: {
    finishLoading: Function
    loop?: boolean
}) => {
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' })
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        if (loop) {
            return
        }
        setIsMounted(true)
        setTimeout(() => {
            return true
        }, 1000)
        const loader = anime.timeline({
            complete: () => finishLoading(),
        })
        loader.add({
            overflow: 'hidden',
            targets: '#logo',
            delay: 0,
            scale: !isMobile ? 2 : 1,
            duration: 4000,
            easing: 'easeInOutExpo',
        })
    }, [finishLoading])
    if (!isMounted) return null
    return (
        <div className='grid h-full w-full' id='logo'>
            <div className='hidden h-full w-full lg:grid'>
                <Loading />
            </div>
            <div className='grid h-full w-full lg:hidden'>
                <OnboardingScreen />
            </div>
        </div>
    )
}

export default SplashScreen
