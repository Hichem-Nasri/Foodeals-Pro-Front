import { Layout } from '@/components/layout/Layout'
import { ValidationCommissions } from '@/containers/gestions/Paiments/partenaire-business/commissions'
import { getTranslations } from '@/i18n/config'
import React from 'react'

interface PageProps {
    params: Promise<{
        locale: string
    }>
}

const Page: React.FC<PageProps> = async ({ params }) => {
    const { locale } = await params
    const { t } = await getTranslations(locale)

    return (
        <Layout>
            <ValidationCommissions />
        </Layout>
    )
}

export default Page
