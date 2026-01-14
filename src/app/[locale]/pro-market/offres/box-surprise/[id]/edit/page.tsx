import React from 'react'
import EditBoxWrapper from '../../../components/EditBoxWrapper'

export default async function EditBoxSurprisePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  
  return (
    <div>
      <EditBoxWrapper
        id={id}
        type='surprise'
      />
    </div>
  )
}
