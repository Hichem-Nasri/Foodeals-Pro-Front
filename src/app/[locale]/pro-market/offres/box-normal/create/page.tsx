'use client'
import React from 'react'
import BoxForm from '../../../components/common-form-steps/BoxForm';
import { BoxNormalFormDefaultValues } from '../../../components/common-form-steps/CommonFormSchema';

export default function CreateBoxNormalPage() {
  return (
    <div className='h-full max-lg:px-2'>
      <BoxForm defaultValues={BoxNormalFormDefaultValues} />
    </div>
  )
}
