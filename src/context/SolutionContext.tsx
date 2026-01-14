'use client'
import { auth } from '@/auth'
import Notif from '@/components/layout/Notif'
import {
  DlcProPages,
  DonateProPages,
  mainPages,
  PageData,
  pagesData,
} from '@/lib/pages'
import { AppRoutes, DlcRoutes, DonateRoutes } from '@/lib/routes'
import { NotificationType, PartnerSolutionType } from '@/types/GlobalType'
import { CalendarClock, PieChart, ShoppingBasket } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import React, { createContext, useContext, useEffect, useState } from 'react'

interface SolutionsContextType {
  solution: SolutionData
  ChangeSolution: (solution: PartnerSolutionType) => void
}

const marketProPages = [
  pagesData[1],
  {
    label: 'Statistique',
    translationKey: 'navigation.statistics',
    href: AppRoutes.statistics,
    icon: PieChart,
  },
  ...pagesData.slice(2, pagesData.length),
]

export class SolutionData {
  solution: PartnerSolutionType
  pages: PageData[]
  AllSoltions: PartnerSolutionType[]
  mainPages: string[]
  colors: {
    color: string
    hover: string
    border: string
    text: string
  }
  constructor(
    solution: PartnerSolutionType,
    pages: PageData[],
    mainPages: string[],
    colors: {
      color: string
      hover: string
      border: string
      text: string
    } = {
      color: 'bg-primary',
      hover: 'hover:bg-primary',
      border: 'border-primary',
      text: 'text-primary',
    }
  ) {
    this.solution = solution
    this.pages = pages
    this.mainPages = mainPages
    this.AllSoltions = [
      PartnerSolutionType.MARKET_PRO,
      PartnerSolutionType.DLC_PRO,
      PartnerSolutionType.DONATE_PRO,
    ]
    this.colors = colors
  }
  getMainPages() {
    return (
      this.pages
        .map((page) =>
          page.subPage
            ? page.ListSubPage?.map((subPage) => subPage.href)
            : page.href
        )
        .flat() || []
    )
  }
  changeSolution(solution: PartnerSolutionType) {
    if (solution == PartnerSolutionType.MARKET_PRO) {
      this.pages = marketProPages
    }
    this.solution = solution
  }
  setSolution(solution: PartnerSolutionType) {
    this.solution = solution
  }
  setPages(pages: PageData[]) {
    this.pages = pages
  }
}

const SolutionsContext = createContext<SolutionsContextType | undefined>(
  undefined
)

export const SolutionsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [solution, setSolution] = useState<SolutionData>(
    new SolutionData(PartnerSolutionType.NONE, pagesData, mainPages as string[])
  )
  const path = usePathname()! || ''
  useEffect(() => {
    console.log('solution.solution: ', solution.solution)
    switch (solution.solution) {
      case PartnerSolutionType.MARKET_PRO:
        setSolution((prev) => {
          return new SolutionData(
            solution.solution,
            marketProPages,
            prev.mainPages
          )
        })
        break
      case PartnerSolutionType.DLC_PRO:
        setSolution((prev) => {
          return new SolutionData(
            solution.solution,
            DlcProPages,
            prev.mainPages,
            {
              color: 'bg-tulip-400/90',
              hover: 'hover:bg-tulip-400',
              border: 'border-tulip-400',
              text: 'text-tulip-400',
            }
          )
        })
        break
      case PartnerSolutionType.DONATE_PRO:
        setSolution((prev) => {
          return new SolutionData(
            solution.solution,
            DonateProPages,
            prev.mainPages,
            {
              color: 'bg-scooter-500/90',
              hover: 'hover:bg-scooter-500',
              border: 'border-scooter-500',
              text: 'text-scooter-500',
            }
          )
        })
        break
      default:
        setSolution((prev) => {
          return new SolutionData(solution.solution, pagesData, prev.mainPages)
        })
        break
    }
    if (
      path.includes(AppRoutes.MarketPro) &&
      solution.solution != PartnerSolutionType.MARKET_PRO
    ) {
      setSolution((prev) => {
        return new SolutionData(
          PartnerSolutionType.MARKET_PRO,
          marketProPages,
          prev.mainPages
        )
      })
    }
    if (
      path.includes(DlcRoutes.dlc) &&
      solution.solution != PartnerSolutionType.DLC_PRO
    ) {
      setSolution((prev) => {
        return new SolutionData(
          PartnerSolutionType.DLC_PRO,
          DlcProPages,
          prev.mainPages
        )
      })
    }
    if (
      path.includes(DonateRoutes.home) &&
      solution.solution != PartnerSolutionType.DONATE_PRO
    ) {
      setSolution((prev) => {
        return new SolutionData(
          PartnerSolutionType.DONATE_PRO,
          DonateProPages,
          prev.mainPages
        )
      })
    }
    //! TODO: Add other solutions
  }, [solution.solution, path])
  const ChangeSolution = (solution: PartnerSolutionType) => {
    // if (session.data) {
    //   // const solutions = session.data.user.solutions
    //   // if (solutions.includes(solution)) {
    //   setSolution((prev) => {
    //     return new SolutionData(solution, prev.pages, prev.mainPages)
    //   })
    // } else {
    // }
  }

  return (
    <SolutionsContext.Provider value={{ ChangeSolution, solution }}>
      {children}
    </SolutionsContext.Provider>
  )
}

export const useSolutions = () => {
  const context = useContext(SolutionsContext)
  if (!context) {
    throw new Error('useSolutions must be used within a SolutionsProvider')
  }
  return context
}
