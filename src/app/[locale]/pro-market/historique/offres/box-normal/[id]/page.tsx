'use client'
import React from 'react'
import { useGetOfferBoxById } from '@/hooks/pro-market/queries/offrers-queries'
import BoxForm from '@/app/[locale]/pro-market/components/common-form-steps/BoxForm'
import OffreDetailsFormLoading from '@/app/[locale]/pro-market/components/OffreDetailsFormLoading'
import { getBoxProps } from '@/app/[locale]/pro-market/offres/_utils/getBoxProps'
import { AxiosError } from 'axios'
import { notFound } from 'next/navigation'

export default function BoxNormalDetailsPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>
}) {
  const { id } = React.use(params)
  const { data, isLoading, error } = useGetOfferBoxById(id, 'normal')

  if (isLoading) {
    return <OffreDetailsFormLoading />
  }

  if (!isLoading && error) {
    if (error instanceof AxiosError) {
      if (
        error.status === 404 ||
        error.status === 401 ||
        error.status === 400
      ) {
        notFound()
      }
    }
    throw new Error(error.message)
  }

  if (!isLoading && !error && data) {
    return (
      <div>
        <BoxForm
          id={id}
          {...getBoxProps(data)}
          type='normal'
          disabled
          isHistory
          // isHistory
        />
      </div>
    )
  }
}
