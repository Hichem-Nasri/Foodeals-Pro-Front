import { useTitle } from '@/context/TitleContext'
import { Footer } from './Footer'
import { Header } from './Header'
import { Navigation } from './Navigation'
import { JSX } from 'react'
interface LayoutProps {
  children?: JSX.Element | JSX.Element[]
  formTitle?: string
}

export const Layout: React.FC<
  LayoutProps
> = ({ children, formTitle }) => {
  return (
    <App formTitle={formTitle}>
      {children}
    </App>
  )
}

export const App: React.FC<
  LayoutProps
> = ({ children, formTitle }) => {
  return (
    <div className='wrapper relative flex h-full flex-col gap-y-2 bg-lynch-50'>
      <div className='background-black absolute z-50 hidden h-screen w-screen bg-black/50 lg:hidden' />
      <Header formTitle={formTitle} />
      <div
        // className={`relative flex h-full w-full flex-1 gap-2 overflow-auto`}
        className={`content relative flex flex-[1] gap-x-2 overflow-hidden`}
      >
        <Navigation />
        <main className='flex grow flex-col overflow-y-auto lg:pr-2 rtl:lg:pl-2 rtl:lg:pr-0'>
          {children}
        </main>
      </div>
      <Footer />
    </div>
  )
}
