'use client'
import React from 'react'
import {
  OfferBoxByIdRes,
  useGetOfferBoxById,
} from '@/hooks/pro-market/queries/offrers-queries'
import { getBoxProps } from '../../_utils/getBoxProps'
import BoxForm from '../../../components/common-form-steps/BoxForm';
import OffreDetailsFormLoading from '../../../components/OffreDetailsFormLoading';


export default function BoxSurpriseDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = React.use(params)
  const { data, isLoading, error } =
    useGetOfferBoxById(id, 'surprise')

  if (isLoading) {
    return (
      <OffreDetailsFormLoading type='surprise' />
    )
  }

  if (!isLoading && error) {
    // throw new Error(error.message)
    return <pre>{error.message}</pre>
  }

  if (!isLoading && !error && data) {
    return (
      <div>
        <BoxForm
          id={id}
          {...getBoxProps(data)}
          type='surprise'
          disabled
        />
      </div>
    )
  }
}
