'use client'
import React from 'react'
import CollaboratorDetails from '../components/CollaboratorDetails'
import Link from 'next/link'
import { DeliveryRoutes } from '@/lib/routes'
import { ChevronLeft } from 'lucide-react'
import SubPageHeader from '../../components/SubPageHeader'
import { useDeliveryTranslations } from '@/hooks/useTranslations'
import { use } from 'react'

export default function page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const t = useDeliveryTranslations()
  
  return (
    <div>
      <SubPageHeader
        href={
          DeliveryRoutes.collaborator
        }
        title={t('navigation.collaborators')}
      />
      <CollaboratorDetails id={id} />
    </div>
  )
}
