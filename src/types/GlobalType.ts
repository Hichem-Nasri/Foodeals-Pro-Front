import { ArchiveSchema } from '@/schemas/global-schema'
import { z } from 'zod'

export enum PartnerSolutionType {
  MARKET_PRO = 'pro_market',
  DLC_PRO = 'pro_dlc',
  DONATE_PRO = 'pro_donate',
  NONE = 'PAS DE SOLUTION',
}

export interface ContactDto {
  name: Name
  email: string
  phone: string
}
export type UserDto = {
  id: number | string
  avatarPath: string
  civility: string
  name: {
    firstName: string
    lastName: string
  }
  nationality: string
  cin: string
  role: string
  email: string
  phone: string
}

export type Collaborator = {
  id: string
  name: string
  role: string
  avatar: string
}

export interface Name {
  firstName: string
  lastName: string
}

export enum PaymentMethodEnum {
  CARD = 'CARD',
  CASH = 'CASH',
  // CARD = 'Carte Bancaire',
  // CASH = 'Espéces',
}

export enum PartnerEntitiesType {
  PARTNER_SB = 'PARTNER_SB',
  NORMAL_PARTNER = 'NORMAL_PARTNER',
  SUB_ENTITY = 'SUB_ENTITY',
  DELIVERY_PARTNER = 'DELIVERY_PARTNER',
}

export type ProfileType = {
  id: string
  name: {
    firstName: string
    lastName: string
  }
  avatarPath?: string
}
export interface PartnersType {
  id: string
  entityName: string
  type: string
  city: string
  solutions: string[]
  createdAt: string
  partnerInfo: PartnerInfoDto
  contractStatus: string
  contact: ContactType
}

export interface PartnerInfoDto {
  id: string
  name: string
  avatarPath: string
}

export type PriceType = {
  amount: number
  currency: string
}

export enum NotificationType {
  SUCCESS,
  ERROR,
  INFO,
}

export type ContactType = {
  name: ProfileType['name']
  email: string
  phone: string
}

export type CustomFilterType = {
  date: string[]
  companyName: string[]
  category: string[]
  status?: string[]
  creatorInfo?: ProfileType[]
  managerInfo?: ProfileType[]
  solutions?: string[]
  city: string[]
  country: string[]
}

export type AddressType = {
  country: string
  city: string
  address: string
  region: string
  iframe: string
}

export type TotalValueProps = {
  totalElements: number
  totalPages: number
  currentPage: number
  pageSize: number
}

export const TotalValues = {
  totalElements: 0,
  totalPages: 0,
  currentPage: 0,
  pageSize: 10,
}

export type ArchiveType = z.infer<typeof ArchiveSchema>

export interface DetailsArchiveType {
  reason: string
  details: string
  deletedAt: Date
}

export enum PartnerStatusType {
  VALID = 'VALID',
  IN_PROGRESS = 'IN_PROGRESS',
  CANCELED = 'CANCELED',
  DRAFT = 'DRAFT',
}

export enum ContractStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  VALIDATED = 'VALIDATED',
  REJECTED = 'REJECTED',
}

export const ContractStatusPartner: { [key: string]: PartnerStatusType } = {
  ['VALIDATED']: PartnerStatusType.VALID,
  ['PENDING']: PartnerStatusType.IN_PROGRESS,
  ['REJECTED']: PartnerStatusType.CANCELED,
}

export type userInfoDto = PartnerInfoDto & Pick<ContactDto, 'phone' | 'email'>

export interface StoreRes {
  id: string
  name: string
  activities: Activity[]
  avatarPath: string
  coverPath: string
  email: string
  phone: string
  solutions: Activity[]
  addressReponse: AddressReponse
  iframe: string
  creationDate: Date
  numberOfCollabs: number
  numberOfOffers: number
  numberOfOrders: number
  manager: Manager
  status: string
}

export interface Activity {
  id: string
  name: string
}

export interface AddressReponse {
  id: string
  address: string
  extraAddress: string
  zip: string
  city: City
}

export interface City {
  id: string
  name: string
  code: string
  state: State
  regionsResponse: Activity[]
}

export interface State {
  id: string
  name: string
  code: string
  country?: State
}

export interface Manager {
  id: number
  avatarPath: null
  civility: null
  name: Name
  nationality: null
  cin: null
  role: Role
  email: string
  phone: string
}

export interface Name {
  firstName: string
  lastName: string
}

export interface Role {
  id: string
  name: string
  authorities: any[]
}

export interface State {
  id: string
  name: string
  code: string
  country?: State
}

export enum Roles {
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
  MANAGER = 'MANAGER',
  MANAGER_REGIONALE = 'MANAGER_REGIONALE',
  MARCHANDISER = 'MARCHANDISER',
  SALES_MANAGER = 'SALES_MANAGER',
  CLIENT = 'CLIENT',
  DELIVERY_MAN = 'DELIVERY_MAN',
}

export const roleFrenchName: Record<Roles, string> = {
  ADMIN: 'administrateur',
  SUPER_ADMIN: 'super administrateur',
  MANAGER: 'gestionnaire',
  MANAGER_REGIONALE: 'gestionnaire régional',
  MARCHANDISER: 'merchandiseur',
  SALES_MANAGER: 'responsable des ventes',
  CLIENT: 'client',
  DELIVERY_MAN: 'livreur',
}
