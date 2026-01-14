'use client'

import { Layout } from '@/components/layout/Layout'
import Stores from '@/containers/gestions/Stores'
import React from 'react'
import { useStoresTranslations } from '@/hooks/useTranslations'

const StorePage = () => {
    const t = useStoresTranslations()
    
    return (
        <Layout formTitle={t('title')}>
            <Stores />
        </Layout>
    )
}

export default StorePage
