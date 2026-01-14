'use client'
import {
  MarketWeb,
  pagesData,
  pagesMarketPro,
  PageData,
} from '@/lib/pages'
import {
  FC,
  ForwardRefExoticComponent,
  Fragment,
  RefAttributes,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  memo,
} from 'react'
import { CustomButton } from '../custom/CustomButton'
import Link from 'next/link'
import {
  usePathname,
  useRouter,
} from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  AppRoutes,
  DeliveryRoutes,
  DlcRoutes,
  DonateRoutes,
  MarketRoutes,
} from '@/lib/routes'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion'
import { LucideProps, Truck } from 'lucide-react'
import { useSolutions } from '@/context/SolutionContext'
import { PartnerSolutionType, Roles } from '@/types/GlobalType'
import { useTranslations } from '@/hooks/useTranslations'
import { useUserRole } from '@/context/UserRoleContext';
import { useSession } from 'next-auth/react';

const AllHome = [
  AppRoutes.home,
  MarketRoutes.market,
  DonateRoutes.home,
]

interface NavigationProps {}

// Helper function to debounce scroll events
function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Memoized navigation item component
const NavigationItem = memo<{
  page: PageData
  index: number
  pathname: string
  color: { color: string; hover: string }
  t: (key: string, fallback?: string) => string
  router: ReturnType<typeof useRouter>
  openAccordions: string[]
  onAccordionChange: (value: string[]) => void
}>(({ page, index, pathname, color, t, router, openAccordions, onAccordionChange }) => {
  const isActive = useMemo(() => {
    if (AllHome.some(item => page.href === item)) {
      return pathname === page.href
    }
    return pathname.includes(page.href) && page.href !== AppRoutes.home
  }, [pathname, page.href])

  if (page.subPage) {
    return (
      <Accordion
        type="multiple"
        className="w-full"
        value={openAccordions}
        onValueChange={onAccordionChange}
      >
        <AccordionItem
          value={page.label + index}
          className="w-full justify-normal gap-2 rounded-[6px] bg-transparent text-lynch-500"
        >
          <AccordionTrigger
            className={cn(
              `group peer h-auto w-full justify-normal rounded-[6px] bg-transparent py-0 text-lynch-500 hover:text-white transition-all duration-200`,
              isActive ? `${color.color} text-white` : '',
              color.hover
            )}
            classNameArrow="w-7 h-7 shrink-0 mr-2 m-auto"
          >
            <div
              className={cn(
                'child inline-flex w-full cursor-pointer items-center justify-normal whitespace-nowrap rounded-[6px] bg-transparent p-4 py-5 text-sm font-medium text-lynch-500 transition-colors peer-hover:text-white hover:bg-transparent hover:text-white focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 max-w-52 text-ellipsis overflow-hidden',
                isActive ? 'text-white' : 'group-hover:text-white'
              )}
            >
              <page.icon className="icon rtl:ml-2 rtl:mr-0 mr-2 shrink-0" />
              {t(page.translationKey, page.label)}
            </div>
          </AccordionTrigger>
          <AccordionContent className="ml-1 space-y-1 border-l-[2px] border-lynch-100 py-1 pl-2">
            {page.ListSubPage?.map((item, subIndex) => (
              <SubNavigationItem
                key={`${index}-${subIndex}`}
                item={item}
                pathname={pathname}
                color={color}
                t={t}
                router={router}
              />
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    )
  }

  return (
    <Link href={page.href} passHref>
      <AnimatedTextButton
        className={cn(
          'w-full justify-normal truncate whitespace-nowrap rounded-[6px] bg-transparent p-4 text-lynch-500 hover:text-white transition-all duration-200',
          isActive ? `${color.color} text-white` : '',
          color.hover
        )}
        label={t(page.translationKey, page.label)}
        IconLeft={page.icon}
      />
    </Link>
  )
})

NavigationItem.displayName = 'NavigationItem'

// Memoized sub-navigation item component
const SubNavigationItem = memo<{
  item: PageData
  pathname: string
  color: { color: string; hover: string }
  t: (key: string, fallback?: string) => string
  router: ReturnType<typeof useRouter>
}>(({ item, pathname, color, t, router }) => {
  const isActive = pathname.includes(item.href)

  return (
    <CustomButton
      onClick={() => router.push(item.href)}
      className={cn(
        'w-full justify-normal rounded-[6px] bg-transparent p-4 text-lynch-500 hover:text-white transition-all duration-200',
        isActive ? 'bg-lynch-100' : '',
        color.hover
      )}
      label={t(item.translationKey, item.label)}
      IconLeft={item.icon}
    />
  )
})

SubNavigationItem.displayName = 'SubNavigationItem'
/* Optimized Navigation component with performance improvements and better UX */
export const Navigation: FC<NavigationProps> = () => {
  const { solution } = useSolutions()
  const user = useSession()
  const { t } = useTranslations()
  const pathname = usePathname() || ''
  const router = useRouter()
  const navRef = useRef<HTMLElement>(null)
  
  // State for scroll shadows
  const [showTopShadow, setShowTopShadow] = useState(false)
  const [showBottomShadow, setShowBottomShadow] = useState(false)
  const [openAccordions, setOpenAccordions] = useState<string[]>([])

  // Memoized pages data
  const pages = useMemo(() => {
    if([Roles.MANAGER, Roles.MANAGER_REGIONALE].includes(user?.data?.user.role! || "")) {
      return [...pagesData, {
        label: "Delivery",
        href: DeliveryRoutes.delivery,
        icon: Truck,
        translationKey: 'delivery.navigation.deliveryMen',
      }]
    }
    return solution.solution === PartnerSolutionType.MARKET_PRO
      ? [...MarketWeb, ...solution.pages]
      : solution.pages
  }, [solution])

  // Memoized color configuration
  const color = useMemo(() => {
    let data = ''
    if (pathname.includes('pro-dlc')) {
      data = 'bg-tulip-400/90'
    } else if (pathname.includes('pro-donate')) {
      data = 'bg-scooter-500/90'
    } else {
      data = 'bg-primary/90'
    }
    return {
      color: data,
      hover: `hover:${data.replace('/90', '')}`,
    }
  }, [pathname])

  // Function to get default open accordions based on current path
  const getDefaultOpenAccordions = useCallback(() => {
    const openItems: string[] = []
    pages.forEach((page, index) => {
      if (page.subPage && page.ListSubPage) {
        const hasMatchingSubpage = page.ListSubPage.some((subpage) =>
          pathname.includes(subpage.href)
        )
        if (hasMatchingSubpage) {
          openItems.push(page.label + index)
        }
      }
    })
    return openItems
  }, [pages, pathname])

  // Debounced scroll handler for performance
  const handleScroll = useCallback(
    debounce(() => {
      if (!navRef.current) return

      const { scrollTop, scrollHeight, clientHeight } = navRef.current

      setShowTopShadow(scrollTop > 0)
      setShowBottomShadow(scrollTop + clientHeight < scrollHeight)
    }, 16), // ~60fps
    []
  )

  // Initialize accordion state and set up scroll handlers
  useEffect(() => {
    const defaultOpen = getDefaultOpenAccordions()
    setOpenAccordions(defaultOpen)
  }, [getDefaultOpenAccordions])

  // Scroll event listener setup
  useEffect(() => {
    const navElement = navRef.current
    if (!navElement) return

    navElement.addEventListener('scroll', handleScroll)
    handleScroll() // Initial check

    return () => {
      navElement.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  // Auto-scroll to active item on route change
  useEffect(() => {
    if (!navRef.current) return

    const scrollToActiveItem = () => {
      const activeButton = navRef.current?.querySelector(
        '.bg-primary\\/90, .bg-tulip-400\\/90, .bg-scooter-500\\/90, .bg-lynch-100'
      )

      if (activeButton) {
        activeButton.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
      }
    }

    const timeoutId = setTimeout(scrollToActiveItem, 100)
    return () => clearTimeout(timeoutId)
  }, [pathname])

  // Accordion change handler
  const handleAccordionChange = useCallback((value: string[]) => {
    setOpenAccordions(value)
  }, [])

  return (
    <div className="relative h-full">
      {/* Top shadow */}
      {showTopShadow && (
        <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-black/5 to-transparent pointer-events-none z-10 rounded-t-[14px]" />
      )}
      
      {/* Navigation */}
      <nav
        ref={navRef}
        className="custom-scrollbar nav-bar hidden h-full w-full max-w-60 overflow-x-hidden scroll-m-1 flex-col gap-[0.625rem] overflow-y-auto rounded-[14px] bg-white p-0 lg:flex lg:p-[0.625rem]"
      >
        {pages.map((page, index) => (
          <NavigationItem
            key={`${page.href}-${index}`}
            page={page}
            index={index}
            pathname={pathname}
            color={color}
            t={t}
            router={router}
            openAccordions={openAccordions}
            onAccordionChange={handleAccordionChange}
          />
        ))}
      </nav>

      {/* Bottom shadow */}
      {showBottomShadow && (
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-black/5 to-transparent pointer-events-none z-10 rounded-b-[14px]" />
      )}
    </div>
  )
}
// Optimized AnimatedTextButton component with better performance
const AnimatedTextButton = memo<{
  className?: string
  label: string
  IconLeft?: ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
  >
}>(({ className, label, IconLeft }) => {
  const textRef = useRef<HTMLDivElement>(null)
  const parentRef = useRef<HTMLDivElement>(null)
  const [isOverflowing, setIsOverflowing] = useState(false)

  // Check for text overflow with ResizeObserver for better performance
  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current && parentRef.current) {
        setIsOverflowing(
          textRef.current.scrollWidth + 100 > parentRef.current.clientWidth
        )
      }
    }

    checkOverflow()

    // Use ResizeObserver for better performance than checking on every render
    const resizeObserver = new ResizeObserver(checkOverflow)
    if (parentRef.current) {
      resizeObserver.observe(parentRef.current)
    }

    return () => {
      resizeObserver.disconnect()
    }
  }, [label])

  return (
    <div ref={parentRef} className="relative overflow-hidden">
      <CustomButton
        className={cn(
          className,
          isOverflowing
            ? '[&>.icon]:mr-2 hover:[&>.label]:animate-scrollText'
            : ''
        )}
        label={label}
        IconLeft={IconLeft}
      />
    </div>
  )
})

AnimatedTextButton.displayName = 'AnimatedTextButton'
