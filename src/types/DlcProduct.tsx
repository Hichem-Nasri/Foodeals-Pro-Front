import { PriceType } from './GlobalType'

export default interface DLCProduct {
    id: string
    product_id: string
    name: string
    brand: string
    title: string
    imageUrl: string
    quantity: number
    creationDate: string
    barCode: string
    description: string
    life_time: string
    category: {
        id: string
        name: string
        slug: string
    }
    price: PriceType
    subCategory: {
        id: string
        name: string
        slug: string
    }
    rayon: string
    unity: string
    dateEncoreFraiche: string
    dateFraiche: string
    dateAConsommerBientot: string
    prgEncoreFraiche: string
    prgFraiche: string
    prgAConsommerBientot: string
    type: 'urgente' | 'exigée' | 'souhaitable'
}
