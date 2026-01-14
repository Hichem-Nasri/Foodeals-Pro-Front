/**
 * App Routes is list of all the routes in the application
 *
 */

export const AppRoutes = {
  home: '/',
  dashboard: '/dashboard',
  gestions: '/gestions',
  paiments: '/gestions/paiments',
  paiementsOperation:
    '/gestions/paiments/operation-mois/:id',
  product: '/gestions/produits',
  productDetails:
    '/gestions/produits/:id',
  stores: '/gestions/magasins',
  storeDetails:
    '/gestions/magasins/:id',
  collaborators:
    '/gestions/collaborateurs/:id',
  collaboratorDetails:
    '/gestions/collaborateurs/details/:id',
  settings: '/gestions/reglages',
  settingsDetails:
    '/gestions/reglages/:id',
  statistics:
    '/pro-market/statistiques',
  profile: '/profile',
  support: '/support',
  supportDetails: '/support/:id',
  rate: '/notez',
  MarketPro: '/pro-market',
  DlcPro: '/pro-dlc',
}

/**
 * API Routes is list of all the api routes in the application
 *
 */

export const appApi = {
  products: '/products',
  productsDetails: '/products/:id',
  scanProduct: '/products/scan',
  uploadProduct: '/products/upload',
  paymentCommission:
    '/payments/monthly/:id?month=:MM&year=:YYYY',
  paymentOperation:
    '/payments/monthly/operations?subEntityId=:id&year=:YYYY&month=:MM',
  stores: '/subentities',
  storesDetails: '/subentities/:id',
  storesState:
    '/subentities/all/:state',
  AvailableManager:
    '/users/available-managers',
  userNameAndRole:
    '/users/search?name=:name&role=:role',
  products_dlc: '/products-dlc',
  dlc: '/dlcs',
}

export const DeliveryRoutes = {
  delivery: '/delivery',
  commande: '/delivery/commande',
  livreurs: '/delivery/livreurs',
  statistiques:
    '/delivery/statistiques',
  collaborator:
    '/delivery/collaborateur',
  deliveryMap:
    '/delivery/map/delivery-men',
}

export const MarketRoutes = {
  dashboard: '/pro-market/dashboard',
  market: '/pro-market',
  marketDetails: '/pro-market/:id',
  offres: '/pro-market/offres',
  dealPro: '/pro-market/deal-pro',
  historique: '/pro-market/historique',
  historique_orders:
    '/pro-market/historique/orders',
  historique_offers:
    '/pro-market/historique/offres',
  stats: '/pro-market/statistiques',
  products_dlc: '/products-dlc',
  dlc: '/dlcs',
  Panier: '/pro-market/panier',
}

export const DlcRoutes = {
  dashboard: '/pro-dlc/dashboard',
  dlc: '/pro-dlc/dlc',
  Details: '/pro-dlc/details/:id',
  Valuation: '/pro-dlc/valuation',
  History:
    '/pro-dlc/details/:detail_id/history/:history_id',
  Decision: '/pro-dlc/decision',
}

export const DonateRoutes = {
  daashboard: '/pro-donate/dashboard',
  home: '/pro-donate',
  delivery:
    '/pro-donate/:donateId/:productId/delivery',
  donate: '/pro-donate/donate',
  donateDetails: '/pro-donate/:id',
  history: '/pro-donate/historique',
  history_donate:
    '/pro-donate/historique/donate',
  history_recovery:
    '/pro-donate/historique/recuperation',
  statistics:
    '/pro-donate/statistiques',
}

export const HiddenHeaderRoutes = [
  DonateRoutes.donateDetails,
]
