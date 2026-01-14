import { cn } from '@/lib/utils'
import {
  HandCoins,
  HeartHandshake,
  LucideProps,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react'

export type BadgeType = 'DEAL_PRO' | 'PRO_MARKET' | 'DONATE_CLIENT' | 'PRO_DLC'

export default function DealBadge({
  badgeVariant,
  text,
  className = '',
}: {
  badgeVariant: BadgeType
  text?: string
  className?: string
}) {
  const data = getIconAndTitle(badgeVariant, text)
  return (
    <div
      className={cn(
        'flex items-center justify-center gap-1.5 self-start rounded-full px-3 py-1.5 text-[10px] font-bold uppercase',
        data.className,
        className
      )}
    >
      <data.Icon size={12} />
      <span>{data.text}</span>
    </div>
  )
}

function getIconAndTitle(badgeType: BadgeType, text?: string) {
  const badgeData: Record<
    BadgeType,
    {
      text: string
      className: string
      Icon: React.ForwardRefExoticComponent<
        Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
      >
    }
  > = {
    DEAL_PRO: {
      text: text || 'deal pro',
      className: 'bg-amethyst-500 text-white ',
      Icon: ShieldCheck,
    },
    PRO_MARKET: {
      text: text || 'pro market',
      className: 'bg-mountain-100 text-mountain-500',
      Icon: ShoppingBag,
    },
    DONATE_CLIENT: {
      text: text || 'donatation client',
      className: 'bg-scooter-200 text-white text-scooter-700',
      Icon: HeartHandshake,
    },
    PRO_DLC: {
      text: text || 'pro dlc',
      className:
        'bg-scooter-200 text-white text-scooter-700 bg-tulip-100 text-tulip-500',
      Icon: HandCoins,
    },
  }

  return badgeData[badgeType]
}
