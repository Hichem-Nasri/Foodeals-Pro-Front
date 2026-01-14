import { PartnerInfoDto, PartnerEntitiesType } from './GlobalType'

// export type StoresType = {
//     id: string
//     name:string
//     city: string
//     ref: string
//     phone: string
//     email: string
//     type: PartnerEntitiesType
//     createdAt: string
//     category: string
//     offers: number
//     orders: number
//     users: number
//     subEntities: number
// }

export interface StoresType {
    id: string
    ref: string
    name: string
    type: string
    activities: RegionsResponse[]
    avatarPath: string
    coverPath: string
    email: string
    phone: string
    solutions: any[]
    addressReponse: AddressReponse
    iframe: null
    creationDate: string
    numberOfCollabs: number
    numberOfOffers: string
    numberOfOrders: number
    manager: Manager
    status?: string
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
    regionsResponse: RegionsResponse[]
}

export interface RegionsResponse {
    id: string
    name: string
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
