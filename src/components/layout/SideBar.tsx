import React, { Fragment } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight, LogOut } from 'lucide-react'
import { Skeleton } from '../ui/skeleton'
import MySolutions from '../utils/MySolutions'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { SubPageType } from './Header'
import Link from 'next/link'
import { User } from 'next-auth'
import { useMutation } from '@tanstack/react-query'
import { SignOut } from '@/actions'
import { useNotification } from '@/context/NotifContext'
import { NotificationType } from '@/types/GlobalType'
import { useSolutions } from '@/context/SolutionContext'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { useTranslations } from '@/hooks/useTranslations'

interface SideBarProps {
  user: User | null
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  subPage: SubPageType | null
  setSubPage: React.Dispatch<React.SetStateAction<SubPageType | null>>
}

const SideBar: React.FC<SideBarProps> = ({
  user,
  open,
  setOpen,
  subPage,
  setSubPage,
}) => {
  const { notify } = useNotification()
  const { solution } = useSolutions()
  const { t } = useTranslations()
  const { mutate, isPending } = useMutation({
    mutationKey: ['logout'],
    mutationFn: async () => {
      return SignOut()
    },
    onSuccess: () => {
      notify(NotificationType.SUCCESS, t('messages.success.logout', 'Déconnexion réussie'))
    },
    onError: (error) => {
      notify(NotificationType.ERROR, t('messages.error.logout', 'Erreur de déconnexion'))
    },
  })

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className='inline-flex lg:hidden'>
        {user == null ? (
          <Skeleton className='h-12 w-12 rounded-full bg-lynch-50' />
        ) : (
          <Avatar className='border-bg-lynch-400 size-12 rounded-full border-[1px] bg-white text-lynch-500'>
            <AvatarImage src={user?.image! || ''} />
            <AvatarFallback>
              {user?.name && user?.name.slice(0, 2).toLocaleUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}
      </SheetTrigger>
      <SheetContent
        side='left'
        className={`min-w-full overflow-auto p-0 pt-3 lg:min-w-fit ${
          subPage ? '[&>.icon-sheet]:hidden' : ''
        }`}
      >
        <SheetHeader className={`border-b-[1px] border-lynch-100 p-4`}>
          <SheetTitle
            className={cn(
              `flex-end ml-auto`,
              `${
                subPage
                  ? 'w-full flex-center-between [&>.icon-sheet]:hidden'
                  : ''
              }`
            )}
            onClick={() => setSubPage(null)}
          >
            <button
              className={`icon flex items-center justify-center rounded-full bg-transparent text-lynch-950 ${!subPage ? 'hidden' : ''}`}
              onClick={() => setSubPage(null)}
            >
              <ChevronLeft />
            </button>
            <span>{subPage ? t(subPage.translationKey, subPage.label) : t('sidebar.myProfile')}</span>
          </SheetTitle>
        </SheetHeader>

        <SheetDescription className='mb-10 flex flex-col gap-6 px-3'>
          {subPage ? (
            <Fragment>
              {/* <div className='flex w-full shrink-0 items-center justify-between gap-2 border-b-[1px] border-lynch-100 bg-transparent p-4 text-[14px] text-lynch-950'>
                                            <button
                                                className='icon flex items-center justify-center rounded-full bg-transparent p-[0.625rem] pl-0 text-lynch-950'
                                                onClick={() => setSubPage(null)}
                                            >
                                                <ChevronLeft />
                                            </button>
                                            <span className='text-[16px] font-semibold'>
                                                Menu principal
                                            </span>
                                        </div> */}
              <MySolutions />
              {subPage.ListSubPage.map((page, index) => (
                <Link
                  key={index}
                  href={page.href}
                  onClick={() => {
                    setOpen((prev) => !prev)
                  }}
                  passHref
                >
                  <Button className='w-full shrink-0 justify-normal gap-2 rounded-[6px] bg-transparent px-0 py-[0.375rem] text-lynch-500 hover:bg-lynch-50'>
                    <div className='icon flex items-center justify-center rounded-full bg-primary p-[0.625rem] text-white'>
                      <page.icon />
                    </div>
                    {t(page.translationKey, page.label)}
                  </Button>
                </Link>
              ))}
            </Fragment>
          ) : (
            <Fragment>
              <MySolutions />
              <div className='w-full px-3 mb-6'>
                <div className='space-y-2'>
                  <span className='text-sm font-medium text-lynch-600'>{t('sidebar.language')}</span>
                  <LanguageSwitcher />
                </div>
                <div className='mt-4 h-px w-full bg-lynch-100' />
              </div>
              {solution.pages.map((page, index) => (
                <Fragment key={index}>
                  {page.subPage ? (
                    <Button
                      className='w-full shrink-0 justify-normal gap-2 rounded-[6px] bg-transparent px-0 py-[0.375rem] text-lynch-500 hover:bg-lynch-50'
                      onClick={() => setSubPage(page as SubPageType)}
                    >
                      <div className='icon flex items-center justify-center rounded-full bg-primary p-[0.625rem] text-white'>
                        <page.icon />
                      </div>
                      {t(page.translationKey, page.label)}
                      <ChevronRight className='ml-auto' />
                    </Button>
                  ) : (
                    <Link key={index} href={page.href} passHref>
                      <Button className='w-full shrink-0 justify-normal gap-2 rounded-[6px] bg-transparent px-0 py-[0.375rem] text-lynch-500 hover:bg-lynch-50'>
                        <div className='icon flex items-center justify-center rounded-full bg-primary p-[0.625rem] text-white'>
                          <page.icon />
                        </div>
                        {t(page.translationKey, page.label)}
                      </Button>
                    </Link>
                  )}
                  {page.href === '/marketing' && (
                    <span className='h-[1px] w-full bg-lynch-100' />
                  )}
                </Fragment>
              ))}
              {subPage == null && (
                <Button
                  className='w-full shrink-0 justify-normal gap-2 rounded-[6px] bg-transparent px-0 py-[0.375rem] text-lynch-500 hover:bg-lynch-50 disabled:[&>.icon]:bg-lynch-500'
                  onClick={() => {
                    mutate()
                  }}
                  disabled={isPending}
                >
                  <div className='icon flex items-center justify-center rounded-full bg-red-500 p-[0.625rem] text-white'>
                    <LogOut />
                  </div>
                  {t('sidebar.logout')}
                  <ChevronRight className='ml-auto' />
                </Button>
              )}
            </Fragment>
          )}
        </SheetDescription>
      </SheetContent>
    </Sheet>
  )
}

export default SideBar
