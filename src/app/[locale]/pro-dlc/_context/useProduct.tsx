'use client'
import Notif from '@/components/layout/Notif'
import DLCProduct from '@/types/DlcProduct'
import { NotificationType } from '@/types/GlobalType'
import React, { createContext, useContext, useState } from 'react'

interface ProductDlcContextType {
    setProductDlc: React.Dispatch<React.SetStateAction<DLCProduct[]>>
    productDlc: DLCProduct[]
}

const ProductDlcContext = createContext<ProductDlcContextType | undefined>(
    undefined
)

export const ProductDlcProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [productDlc, setProductDlc] = useState<DLCProduct[]>([])

    return (
        <ProductDlcContext.Provider value={{ setProductDlc, productDlc }}>
            {children}
        </ProductDlcContext.Provider>
    )
}

export const useProductDlc = () => {
    const context = useContext(ProductDlcContext)
    if (!context) {
        throw new Error(
            'useProductDlc must be used within a NotificationProvider'
        )
    }
    return context
}
