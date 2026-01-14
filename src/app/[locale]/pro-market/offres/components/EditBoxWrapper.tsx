'use client'

import { useGetOfferBoxById } from '@/hooks/pro-market/queries/offrers-queries'
import { getBoxProps } from '../_utils/getBoxProps'
import BoxForm from '../../components/common-form-steps/BoxForm'
import OffreDetailsFormLoading from '../../components/OffreDetailsFormLoading';

export default function EditBoxWrapper({
  id,
  type = 'surprise',
}: {
  id: string
  type: 'normal' | 'surprise'
}) {
  const { data, isLoading, error } = useGetOfferBoxById(id, type)

  if (isLoading) {
    return <OffreDetailsFormLoading type={type} />
  }

  if (!isLoading && error) {
    return <pre>{error.message}</pre>
  }
  if (!isLoading && !error && data) {
    return (
      <div>
        <BoxForm {...getBoxProps(data)} type={type} id={id} edit />
      </div>
    )
  }
}
