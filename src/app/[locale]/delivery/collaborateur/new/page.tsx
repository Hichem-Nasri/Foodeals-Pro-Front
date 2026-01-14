'use client'
import React from 'react'
import AddnewCollabForm from '../components/AddNewCollaboratorForm'
import Link from 'next/link'
import { DeliveryRoutes } from '@/lib/routes'
import { ChevronLeft } from 'lucide-react'
import SubPageHeader from '../../components/SubPageHeader'
import { useDeliveryTranslations } from '@/hooks/useTranslations'

export default function NewCollabPage() {
  const t = useDeliveryTranslations()
  
  return (
    <div className='flex flex-col'>
      <SubPageHeader
        href={DeliveryRoutes.collaborator}
        title={t('collaborators.newCollaborator')}
      />
      <AddnewCollabForm />
    </div>
  )
}
