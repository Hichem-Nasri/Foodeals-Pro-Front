'use client'
import { PartnerSolutionType } from '@/types/GlobalType'
import React, {
  FC,
  useCallback,
  useMemo,
} from 'react'
import { Select } from '../custom/Select'
import { PartnerSolution } from './PartnerSolution'
import {
  LucideSquareSplitVertical,
  Salad,
} from 'lucide-react'
import { useSolutions } from '@/context/SolutionContext'
import { useRouter } from 'next/navigation'
import {
  DlcRoutes,
  DonateRoutes,
  MarketRoutes,
} from '@/lib/routes'

interface SelectSolutionProps {}
const SelectSolution: FC<
  SelectSolutionProps
> = ({}) => {
  const { solution, ChangeSolution } =
    useSolutions()
  const router = useRouter()

  const options = useMemo(() => [
    {
      label: 'gestion des solutions',
      key: 'gestion_solutions',
    },
    {
      label: 'pro_market',
      key: 'pro_market',
    },
    {
      label: 'pro_dlc',
      key: 'pro_dlc',
    },
    {
      label: 'pro_donate',
      key: 'pro_donate',
    },
  ], [])

  const handleChange = useCallback((value: string) => {
    // Prevent infinite loops by checking if the value is actually different
    if (value === solution?.solution) return
    
    console.log('SelectSolution value change: ', value)
    ChangeSolution(value as PartnerSolutionType)
    
    // Add logic to change solution
    if (value === 'pro_market') {
      router.push(MarketRoutes.market)
    } else if (value === 'pro_dlc') {
      router.push(DlcRoutes.dlc)
    } else if (value === 'pro_donate') {
      router.push(DonateRoutes.home)
    }
  }, [ChangeSolution, router, solution?.solution])

  const transformOption = useCallback((option: string | number) => {
    return (
      <PartnerSolution
        solution={option as PartnerSolutionType}
        size={18}
        className='text-[10px]'
        Icon={Salad}
        classNameSolution='bg-moutain-100 text-moutain-400'
        emptySolutionName='Gestion des solutions'
      />
    )
  }, [])

  const transformItem = useCallback((option: string | number) => {
    return (
      <PartnerSolution
        solution={option as PartnerSolutionType}
        size={18}
        className='min-w-fit flex-1 text-[10px] lg:min-w-36'
        Icon={Salad}
        classNameSolution='bg-moutain-100 text-moutain-400'
        emptySolutionName='Gestion des solutions'
      />
    )
  }, [])

  return (
    <Select
      classNameParent='hidden lg:flex w-fit bg-transparent [&>.label]:hidden [&>.select]:bg-transparent '
      className='w-fit text-xs'
      value={solution?.solution || ''}
      options={options}
      onChange={handleChange}
      label={''}
      transform={transformOption}
      transformItem={transformItem}
    />
  )
}

export default SelectSolution
