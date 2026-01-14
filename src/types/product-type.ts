import { z } from 'zod'
import { PriceType, ProfileType } from './GlobalType'
import { ProductSchema } from '@/schemas/gestion/product-schema'

export type ProductSchemaType = z.infer<typeof ProductSchema>

export interface ProductsType {
  id: string
  ref: string
  name: string
  title: string
  imageUrl: string
  description: string
  barcode: string
  type: string
  creationDate: string
  price: PriceType
  category: {
    id: string
    name: string
    slug: string
  }
  subCategory: {
    id: string
    name: string
    slug: string
  }
  brand: string
  rayon: string
  createdBy?: ProfileType & {
    email: string
    phone: string
  }
  quantity?: number
  life_time?: string
}

export type AvatarType = {
  id: string
  name: string
  avatarPath: string
}

export type ProductType = {
  id: string
  ref: string
  product: AvatarType
  date: string
  codeBar: string
  brand: string
  category: string
  subCategory: string
  poweredby: AvatarType
  store: AvatarType
  phone: string
  email: string
  pickupConditions: any
}
