'use client'
import Image from 'next/image'
import { SearchInput } from './SearchInput'
import {
  ForwardRefExoticComponent,
  useState,
  useEffect,
  RefAttributes,
} from 'react'
import { CustomButton } from '../custom/CustomButton'
import { Label } from '@/components/custom/Label'
import { cn } from '@/lib/utils'
import {
  usePathname,
  useRouter,
} from 'next/navigation'

import {
  LucideProps,
  ChevronLeft,
} from 'lucide-react'
import { UserMenu } from './UserMenu'
import SelectSolution from '../utils/SelectSolution'
import { useMediaQuery } from 'react-responsive'
import { User } from 'next-auth'
import { getUser } from '@/actions'
import SideBar from './SideBar'
import Notifications from './Notifications'
import { useSolutions } from '@/context/SolutionContext'
import { useTitle } from '@/context/TitleContext'
import { PartnerSolutionType } from '@/types/GlobalType'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import {
  DlcRoutes,
  DonateRoutes,
  HiddenHeaderRoutes,
} from '@/lib/routes'
import { useTranslations } from '@/hooks/useTranslations'

interface HeaderProps {
  formTitle?: string
}
export interface SubPageType {
  label: string
  translationKey: string
  href: string
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> &
      RefAttributes<SVGSVGElement>
  >
  subPage: boolean
  ListSubPage: SubPageType[]
}

export const Header: React.FC<
  HeaderProps
> = ({ formTitle }) => {
  const { title, setTitle } = useTitle()
  const { t } = useTranslations()
  const router = useRouter()
  const path = usePathname()
  const [open, setOpen] = useState(
    () => false
  )
  const [subPage, setSubPage] =
    useState<SubPageType | null>(null)
  const { solution } = useSolutions()
  const [user, setUser] =
    useState<User | null>(null)
  const [imagePath] = useState(() => {
    return path?.includes('pro-dlc')
      ? '/images/logo-dlc.svg'
      : path?.includes(
            DonateRoutes.home
          )
        ? '/images/logo-donate.svg'
        : '/images/logo-pro.svg'
  })

  useEffect(() => {
    if (formTitle) {
      // Check if formTitle is a translation key (contains dots) or plain text
      const translatedTitle = formTitle.includes('.') ? t(formTitle) : formTitle;
      if (title !== translatedTitle) {
        setTitle(translatedTitle!)
      }
    }
    return () => {
      setTitle('')
    }
  }, [formTitle])

  useEffect(() => {
    const fetUser = async () => {
      const user = await getUser()
      setUser(user)
    }
    fetUser()
  }, [formTitle])
  return (
    <>
      <div
        className={cn(
          'z-30 hidden w-full items-center justify-between border-b-2 border-primary bg-white px-2 py-3',
          title && title.length > 0
            ? 'flex lg:hidden'
            : '',
          solution.colors.border
        )}
      >
        <CustomButton
          label=''
          variant='ghost'
          size={'sm'}
          IconLeft={ChevronLeft}
          className='p-2 text-base font-medium text-lynch-300 hover:bg-transparent hover:text-lynch-300'
          onClick={() => {
            if (
              solution
                .getMainPages()
                .find(
                  (page) =>
                    path == page!
                )
            ) {
              setOpen(true)
            } else {
              setTitle('')
              router.back()
            }
          }}
        />
        <Label
          label={title ? title : ''}
          className='text-[1.125rem] font-normal text-lynch-950'
        />
      </div>
      <div
        className={cn(
          'z-30 flex flex-col rounded-b-[30px] bg-white pb-2 lg:flex-row lg:rounded-none lg:pb-0',
          title && title.length > 0
            ? 'hidden lg:flex'
            : ''
        )}
      >
        <div className='flex h-fit w-full items-center justify-between gap-4 px-4 py-2 lg:gap-11'>
          <div className='gap-6 flex-center'>
            <Image
              src={imagePath} // TODO: change logo depending on the solution selected
              alt='login Illustrator'
              width={192}
              height={64}
              className='mr-auto h-16 w-fit cursor-pointer overflow-hidden object-contain lg:mr-0'
              onClick={() =>
                router.push('/')
              }
            />
            <div className='mr-auto hidden lg:inline-flex'>
              <SearchInput
                onChange={() => {}}
              />
            </div>
          </div>
          <div className='hidden items-center justify-end gap-3 lg:flex'>
            <SelectSolution />
            <LanguageSwitcher />

            <UserMenu
              user={user!}
              loading={user == null}
            />
          </div>
          <div className='flex items-center justify-end gap-3 lg:hidden'>
            <Notifications
              notificationData={[]}
            />
            <SideBar
              user={user}
              open={open}
              setOpen={setOpen}
              subPage={subPage}
              setSubPage={setSubPage}
            />
          </div>
          {/* Sheet and other UI components remain unchanged */}
        </div>
        <div className='inline-flex w-full lg:hidden'>
          <SearchInput
            onChange={() => {}}
          />
        </div>
      </div>
    </>
  )
}
