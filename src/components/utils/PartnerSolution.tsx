import { cn } from '@/lib/utils'
import { PartnerSolutionType } from '@/types/GlobalType'
import {
  HandCoins,
  HeartHandshake,
  ShoppingBag,
  Smartphone,
} from 'lucide-react'
import { FC } from 'react'

interface PartnerSolutionProps {
  solution: PartnerSolutionType
  className?: string
  size?: number
  onClick?: () => void
  emptySolutionName?: string
  classNameSolution?: string
  Icon?: FC<any>
}

export const PartnerSolution: FC<
  PartnerSolutionProps
> = ({
  solution,
  className,
  size = 14,
  onClick,
  emptySolutionName = 'Pas de Solution'.toUpperCase(),
  classNameSolution = 'bg-lynch-100 text-lynch-500 border-lynch-500',
  Icon = Smartphone,
}) => {
  var solutionColor: {
    name: string
    className: string
    Icon: FC<any>
  } = {
    name: emptySolutionName,
    className: classNameSolution,
    Icon: Icon,
  }
  switch (solution) {
    case PartnerSolutionType.MARKET_PRO:
      solutionColor = {
        name: 'PRO MARKET',
        className:
          'bg-mountain-100 text-mountain-500 border-mountain-500',
        Icon: ShoppingBag,
      }
      break
    case PartnerSolutionType.DONATE_PRO:
      solutionColor = {
        name: 'PRO DONATE',
        className:
          'bg-scooter-100 text-scooter-500 border-scooter-500',
        Icon: HeartHandshake,
      }
      break
    case PartnerSolutionType.DLC_PRO:
      solutionColor = {
        name: 'PRO DLC',
        className:
          'bg-tulip-100 text-tulip-500 border-tulip-500',
        Icon: HandCoins,
      }
      break
  }
  return (
    <div
      className={cn(
        `flex h-fit w-fit flex-nowrap items-center justify-center gap-[0.375rem] text-nowrap rounded-full px-3 py-[0.375rem] text-[0.625rem] font-bold ${solutionColor.className}`,
        className
      )}
      onClick={onClick}
    >
      <solutionColor.Icon size={size} />
      {solutionColor.name}
    </div>
  )
}
