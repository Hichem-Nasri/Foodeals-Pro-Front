'use client'

import React from 'react'
import dynamic from 'next/dynamic'

const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

interface ErrorProps {
    message?: string
}

const Error: React.FC<ErrorProps> = ({ message }) => {
    return (
        <div className='m-auto h-full w-full flex-col-center'>
            <Lottie
                animationData={require('@/lotties/404.json')}
                loop={true}
                autoplay={true}
                rendererSettings={{
                    preserveAspectRatio: 'xMidYMid slice',
                }}
            />
            {message && (
                <h4 className='text-center text-2xl font-semibold text-coral-500'>
                    {message}
                </h4>
            )}
        </div>
    )
}

export default Error
