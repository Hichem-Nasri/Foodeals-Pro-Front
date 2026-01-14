'use client'
import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import * as foodealsLoading from '@/lotties/foodealsLoading.json'

// Dynamically import the Lottie component
const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

export const IsLoading = () => {
    return (
        <div className='flex h-screen min-w-full items-center justify-center gap-2 bg-primary'>
            <div className='w-fit'>
                <Lottie
                    style={{
                        width: '50px',
                        height: '50px',
                        marginBottom: '30px',
                    }}
                    animationData={foodealsLoading}
                    loop={false}
                    autoplay={true}
                    rendererSettings={{
                        preserveAspectRatio: 'xMidYMid slice',
                    }}
                />
            </div>
            <div className='text-white flex-col-center'>
                <h1 className='text-3xl font-semibold lg:text-5xl'>Foodeals</h1>
                <h5 className='self-end rounded-full bg-coral-500 px-2 text-xs font-medium'>
                    PRO
                </h5>
            </div>
        </div>
    )
}
