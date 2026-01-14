'use client'

import { cn } from '@/lib/utils'
import {
  ColorsT,
  getActiveColorClassName,
} from '@/utils/getActiveColorClassName'
import Link from 'next/link'
import React, { Fragment } from 'react'
import { motion } from 'framer-motion'
import { CustomButton } from './CustomButton'
import { ListFilter, Archive } from 'lucide-react'
import { useOffersTranslations } from '@/hooks/useTranslations'

export type Tab = {
  label: string
  query?: string
}

type OrderStatusTabsProps = {
  tabs: Tab[]
  activeColor?: ColorsT
  selectedTab?: string
  disabled?: boolean
}

export default function TopTabs({
  tabs,
  activeColor = 'green',
  selectedTab = '',
  disabled = false,
}: OrderStatusTabsProps) {
  const t = useOffersTranslations()
  
  return (
    <>
      {/* Mobile tabs */}
      <div className='relative flex items-stretch justify-around overflow-hidden rounded-2xl bg-white py-2.5 text-lg font-medium text-lynch-300 lg:hidden'>
        {tabs.map((tab, index, arr) => {
          const isActive = selectedTab === tab.query || (!selectedTab && index === 0)
          return (
            <Fragment key={tab.label}>
              <Link
                href={{
                  query: `tab=${tab.query}`,
                }}
                shallow
                className={cn(
                  'relative flex items-center justify-center sm:px-5 md:flex-1',
                  isActive && 'text-white z-10'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="mobile-active-tab"
                    className={cn(
                      'absolute inset-0 rounded-xl',
                      getActiveColorClassName(activeColor, 'bg')
                    )}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30
                    }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </Link>
              {index < arr.length - 1 && (
                <span
                  key={`separ-${index}`}
                  className='block min-h-[34px] w-[0.5px] bg-lynch-300'
                />
              )}
            </Fragment>
          )
        })}
      </div>

      {/* Desktop Tabs */}
      <div className='sticky left-0 top-0 z-30 hidden items-center rounded-[18px] bg-white shadow-[0px_5px_5px_2px_#00000005] lg:flex'>
        <div className='relative flex items-center gap-2.5 p-2.5'>
          {tabs.map((tab, index) => {
            const isActive = selectedTab === tab.query || (!selectedTab && index === 0)
            return (
              <Link
                key={tab.label}
                className={cn(
                  'relative rounded-[4px] px-5 py-2.5 text-sm font-semibold transition-colors z-10',
                  isActive ? 'text-white' : 'text-lynch-400'
                )}
                href={{
                  query: `tab=${tab.query}`,
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="desktop-active-tab"
                    className={cn(
                      'absolute inset-0 rounded-[4px]',
                      getActiveColorClassName(activeColor, 'bg')
                    )}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30
                    }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </Link>
            )
          })}
          <CustomButton
            label={t('filterBy')}
            IconRight={ListFilter}
            onClick={() => {}}
            variant='outline'
            size={'sm'}
          />
          <CustomButton
            size={'sm'}
            label={t('archive')}
            IconRight={Archive}
            onClick={() => {}}
            variant='outline'
          />
        </div>
      </div>
    </>
  )
}
export type TabLink = {
  label: string
  href: string
  isActive?: boolean
}

type TabLinksProps = {
  tabs: TabLink[]
  activeColor?: ColorsT
  // selectedTab?: string
  disabled?: boolean
}

export function TopTabsLinks({
  tabs,
  activeColor = 'green',
  // selectedTab = '',
  disabled = false,
}: TabLinksProps) {
  return (
    <>
      {/* Mobile tabs */}
      <div className='relative flex items-stretch justify-around overflow-hidden rounded-2xl bg-white py-2.5 text-lg font-medium text-lynch-300 lg:hidden lg:rounded-[14px] lg:py-2'>
        {tabs.map((tab, index, arr) => (
          <Fragment key={tab.label}>
            <Link
              href={tab.href}
              shallow
              className={cn(
                'relative flex items-center justify-center sm:px-5 md:flex-1 w-full h-full',
                tab.isActive && 'text-white z-10 '
              )}
            >
              {tab.isActive && (
                <motion.div
                  layoutId="mobile-active-tab-links"
                  className={cn(
                    'absolute inset-0 rounded-xl',
                    getActiveColorClassName(activeColor, 'bg')
                  )}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30
                  }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </Link>
            {index < arr.length - 1 && (
              <span
                key={`separ-${index}`}
                className='block min-h-[34px] w-[0.5px] bg-lynch-300'
              />
            )}
          </Fragment>
        ))}
      </div>

      {/* Desktop Tabs */}
      <div className='hidden items-center rounded-[18px] bg-white p-2 lg:flex'>
        <div className='relative flex gap-2.5 px-2.5 py-2'>
          {tabs.map((tab, index) => (
            <Link
              key={tab.label}
              className={cn(
                'relative rounded-[4px] px-5 py-2.5 text-sm font-semibold transition-colors z-10',
                tab.isActive ? 'text-white' : 'text-lynch-400'
              )}
              href={tab.href}
            >
              {tab.isActive && (
                <motion.div
                  layoutId="desktop-active-tab-links"
                  className={cn(
                    'absolute inset-0 rounded-[4px]',
                    getActiveColorClassName(activeColor, 'bg')
                  )}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30
                  }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
