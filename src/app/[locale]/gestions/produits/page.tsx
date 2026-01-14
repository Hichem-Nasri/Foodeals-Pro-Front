import { Layout } from '@/components/layout/Layout'
import Product from '@/containers/gestions/Products'
import { useTranslations } from '@/hooks/useTranslations'
import React from 'react'

const ProductsPage = () => {
    return (
        <Layout formTitle='products.management'>
            <Product />
        </Layout>
    )
}

export default ProductsPage
