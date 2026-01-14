import { Layout } from '@/components/layout/Layout'
import Support from '@/containers/support'
import React from 'react'

interface pageProps {}

const page: React.FC<pageProps> = () => {
    return (
        <Layout formTitle='Support'>
            <Support />
        </Layout>
    )
}

export default page
