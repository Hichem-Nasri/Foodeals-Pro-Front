import {
  AreaChart,
  BaggageClaim,
  BarChartBig,
  CalendarClock,
  Clock4,
  CreditCard,
  FileBox,
  HeartHandshake,
  HomeIcon,
  LineChart,
  LucideProps,
  MessageSquareDot,
  Package2,
  PieChart,
  Salad,
  Settings,
  ShoppingBag,
  ShoppingBasket,
  ShoppingCart,
  Star,
  Store,
  UserPen,
  Users,
} from 'lucide-react'
import {
  ForwardRefExoticComponent,
  RefAttributes,
} from 'react'
import {
  AppRoutes,
  DlcRoutes,
  DonateRoutes,
  MarketRoutes,
} from './routes'

/* This TypeScript code defines an interface `PageData` and an array `pagesData` that contains objects
conforming to the `PageData` interface. */
export interface PageData {
  label: string
  translationKey: string
  href: string
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> &
      RefAttributes<SVGSVGElement>
  >
  subPage?: boolean
  ListSubPage?: PageData[]
}

/**
 * Array of objects containing data for each page in the app.
 * @label - The name of the page (fallback for translation).
 * @translationKey - The translation key for the page label.
 * @href - The URL path for the page.
 * @icon - The icon component for the page.
 * @subPage - Whether the page is a sub-page.
 * @ListSubPage - List of sub-pages for the page.
 */

export const pagesData: PageData[] = [
  {
    label: 'Tableau de bord',
    translationKey:
      'navigation.dashboard',
    href: AppRoutes.dashboard,
    icon: BarChartBig,
  },
  {
    label: 'Gestion Foodeals',
    translationKey:
      'navigation.gestionFoodeals',
    icon: AreaChart,
    href: AppRoutes.gestions,
    subPage: true,
    ListSubPage: [
      {
        label: 'Paiements',
        translationKey:
          'navigation.payments',
        href: AppRoutes.paiments,
        icon: CreditCard,
      },
      {
        label: 'Magasins',
        translationKey:
          'navigation.stores',
        href: AppRoutes.stores,
        icon: Store,
      },
      {
        label: 'Collaborateurs',
        translationKey:
          'navigation.collaborators',
        href: AppRoutes.collaborators.replace(
          ':id',
          'account'
        ),
        icon: Users,
      },
      {
        label: 'Produits',
        translationKey:
          'navigation.products',
        href: AppRoutes.product,
        icon: Salad,
      },
      {
        label: 'Réglage',
        translationKey:
          'navigation.settings',
        href: AppRoutes.settings,
        icon: Settings,
      },
    ],
  },
  {
    label: 'Support',
    translationKey:
      'navigation.support',
    href: AppRoutes.support,
    icon: MessageSquareDot,
  },
  {
    label: 'Informations personnelles',
    translationKey:
      'navigation.personalInfo',
    href: AppRoutes.profile,
    icon: UserPen,
  },
  {
    label: 'Notez Foodeals',
    translationKey:
      'navigation.rateFoodeals',
    href: AppRoutes.rate,
    icon: Star,
  },
]

export const MarketWeb: PageData[] = [
  {
    href: MarketRoutes.dashboard,
    label: 'Tableau de bord',
    translationKey:
      'navigation.dashboard',
    icon: BarChartBig,
  },
  {
    href: MarketRoutes.market,
    label: 'Accueil',
    translationKey: 'navigation.home',
    icon: HomeIcon,
  },
  {
    href: MarketRoutes.offres,
    label: 'Offres',
    translationKey: 'navigation.offers',
    icon: ShoppingBag,
  },
  {
    href: MarketRoutes.dealPro,
    label: 'Deal Pro',
    translationKey:
      'navigation.dealPro',
    icon: FileBox,
  },
  {
    href: MarketRoutes.Panier,
    label: 'Panier',
    translationKey: 'navigation.cart',
    icon: ShoppingCart,
  },
  {
    href: MarketRoutes.historique,
    label: 'Historique',
    translationKey:
      'navigation.history',
    icon: Clock4,
    subPage: true,
    ListSubPage: [
      {
        label: 'Commandes',
        translationKey:
          'navigation.orders',
        icon: Package2,
        href: MarketRoutes.historique_orders,
      },
      {
        label: 'Offres',
        translationKey:
          'navigation.offers',
        icon: ShoppingBag,
        href: MarketRoutes.historique_offers,
      },
    ],
  },
]

export const DlcProPages = [
  {
    label: 'Tableau de bord',
    translationKey:
      'navigation.dashboard',
    href: DlcRoutes.dashboard,
    icon: BarChartBig,
  },
  {
    label: 'Décision',
    translationKey:
      'navigation.decision',
    href: DlcRoutes.Decision,
    icon: ShoppingBasket,
  },
  {
    label: 'DLC',
    translationKey: 'navigation.dlc',
    href: DlcRoutes.dlc,
    icon: CalendarClock,
  },
  ...pagesData.slice(1),
]

export const DonateProPages: PageData[] =
  [
    {
      label: 'Tableau de bord',
      translationKey:
        'navigation.dashboard',
      href: DonateRoutes.daashboard,
      icon: BarChartBig,
    },
    {
      label: 'Accueil',
      translationKey: 'navigation.home',
      href: DonateRoutes.home,
      icon: HomeIcon,
    },
    {
      label: 'Donate',
      translationKey:
        'navigation.donate',
      href: DonateRoutes.donate,
      icon: HeartHandshake,
    },
    {
      label: 'Historique',
      translationKey:
        'navigation.history',
      href: DonateRoutes.history,
      icon: Clock4,
      subPage: true,
      ListSubPage: [
        {
          label: 'Donations',
          translationKey:
            'navigation.donations',
          icon: ShoppingBag,
          href: DonateRoutes.history_donate,
        },
        {
          label: 'Récupération',
          translationKey:
            'navigation.recovery',
          icon: BaggageClaim,
          href: DonateRoutes.history_recovery,
        },
      ],
    },
    {
      label: 'Statistique',
      translationKey:
        'navigation.statistics',
      href: DonateRoutes.statistics,
      icon: LineChart,
    },
    ...pagesData.slice(1),
  ]

export const pagesMarketPro: PageData[] =
  [
    pagesData[1],
    ...[
      {
        label: 'Statistique',
        translationKey:
          'navigation.statistics',
        href: AppRoutes.statistics,
        icon: PieChart,
      },
    ],
    ...pagesData.slice(
      1,
      pagesData.length
    ),
  ]

export const mainPages = pagesData
  .map((page) =>
    page.subPage
      ? page.ListSubPage?.map(
          (subPage) => subPage.href
        )
      : page.href
  )
  .flat()
// console.log(mainPages)
