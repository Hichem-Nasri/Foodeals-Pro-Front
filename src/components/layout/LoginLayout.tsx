'use client'
import { JSX } from 'react'
import Lottie from 'react-lottie'

interface LoginLayoutProps {
  children?: JSX.Element | JSX.Element[]
}

export const LoginLayout: React.FC<
  LoginLayoutProps
> = ({ children }) => {
  // const defaultOptions = {
  // 	loop: true,
  // 	autoplay: true,
  // 	animationData: animationData,
  // 	rendererSettings: {
  // 		preserveAspectRatio: "xMidYMid slice",
  // 	},
  // }
  return (
    <main className='grid h-screen w-full grid-cols-1 lg:min-h-[43.75rem] lg:grid-cols-2'>
      <div
        className='flex h-full items-center justify-center bg-center bg-repeat p-4'
        style={{
          backgroundImage:
            'url(/pattern/login.svg)',
          backgroundSize: 'cover',
        }}
      >
        {children}
      </div>
      <div className='hidden items-center justify-center rounded-l-[48px] bg-primary p-4 lg:flex'>
        <div className='h-[25.625rem] w-[38.75rem]'>
          {/* <Lottie options={defaultOptions} width='100%' /> */}
        </div>
      </div>
    </main>
  )
}
