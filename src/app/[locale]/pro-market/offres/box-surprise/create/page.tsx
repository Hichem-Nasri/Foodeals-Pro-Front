'use client'
import React from 'react'
import BoxForm from '../../../components/common-form-steps/BoxForm';
import { boxBaseDefaultValues } from '../../../components/common-form-steps/CommonFormSchema';


export default function CreateBoxSurprisePage() {
  return (
    <div className='h-full'>
      <BoxForm defaultValues={boxBaseDefaultValues} type='surprise' />
    </div>
  )
}
