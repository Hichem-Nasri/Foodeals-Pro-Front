import { Layout } from '@/components/layout/Layout'
import Collaborateurs from '@/containers/gestions/Users'
import React from 'react'
import fs from 'fs'
import path from 'path'

interface pageProps {
  params: Promise<{
    id: string
    locale: string
  }>
  searchParams: Promise<{
    type: string
  }>
}

const page: React.FC<
  pageProps
> = async ({
  searchParams,
  params,
}) => {
  const { id, locale } = await params
  const { type } = await searchParams
  
  // Read translations using fs
  const translationPath = path.join(process.cwd(), 'src', 'messages', `${locale}.json`)
  const translationData = fs.readFileSync(translationPath, 'utf-8')
  const t = JSON.parse(translationData)
  
  return (
    <Layout formTitle={t.collaborators.title}>
      <Collaborateurs
        id={id}
        type={type}
      />
    </Layout>
  )
}

export default page
