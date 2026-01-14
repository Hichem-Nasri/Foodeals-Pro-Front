import { getMessage } from '@/actions/messages'
import { Layout } from '@/components/layout/Layout'
import DemandeSupport from '@/containers/support/newDemande'
import { FC } from 'react'

// This is an async Server Component
interface DemandePageProps {
  params: Promise<{
    id: string
  }>
  searchParams: Promise<{
    mode: string
  }>
}
const DemandePage: FC<
  DemandePageProps
> = async ({
  params,
  searchParams,
}) => {
  const { id } = await params
  const { mode } = await searchParams
  const data = await getMessage(id)
  return (
    <Layout formTitle='Détail du notification'>
      <DemandeSupport
        data={data}
        id={id == 'new' ? '' : id}
        mode={mode}
      />
    </Layout>
  )
}

export default DemandePage
