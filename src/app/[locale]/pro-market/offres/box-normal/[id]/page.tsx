'use client'
import React from 'react'
import { useGetOfferBoxById } from '@/hooks/pro-market/queries/offrers-queries'
import { AxiosError } from 'axios'
import { notFound, useParams } from 'next/navigation'
import { getBoxProps } from '../../_utils/getBoxProps'
import BoxForm from '../../../components/common-form-steps/BoxForm';
import OffreDetailsFormLoading from '../../../components/OffreDetailsFormLoading';

export default function BoxNormalDetailsPage() {
  const params = useParams()
  const id = params.id as string
  
  const { data, isLoading, error } =
    useGetOfferBoxById(id, 'normal')

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
          // isHistory
        />
      </div>
    )
  }
}
