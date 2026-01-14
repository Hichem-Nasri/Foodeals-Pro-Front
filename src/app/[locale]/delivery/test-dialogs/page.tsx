'use client'
import React from 'react'
import {
  BagSuccessDialog,
  CreatedSuccessfullyDialog,
  OrderActionDialog,
  SuccessDialog,
} from '../components/Dialogs'
import {
  ClientDetailsDrawer,
  DeliveryManDetailsDrawer,
  PartnerDetailsDrawer,
} from '../components/Drawers'
import QrCodeScanner from '@/containers/market/components/QrCodeScanner'
import { Button } from '@/components/ui/button'

export default function TestDialogs() {
  const [scan, setScan] =
    React.useState(false)
  return (
    <div className='flex flex-col gap-4 py-5'>
      <Button
        onClick={() => {
          setScan(true)
        }}
        className='w-40 rounded-lg'
      >
        Test
      </Button>
      <CreatedSuccessfullyDialog />
      <SuccessDialog content='La commande a été affecté avec succès' />
      <SuccessDialog content='La commande est là, trop génial !' />
      <SuccessDialog
        content={
          'Recuperation a été effectuée avec succès.\n Merci pour votre excellent travail !'
        }
      />
      <SuccessDialog
        content={`La livraison a été effectuée avec succès.\n Merci pour votre excellent travail !`}
      />
      <OrderActionDialog
        open={false}
        setOpen={() => {}}
        partnerAvatar={''}
        partnerName={''}
        address={''}
        date={''}
        modalityPayment={''}
      />

      <PartnerDetailsDrawer
        selected={false}
        open={false}
        setOpen={() => {}}
      />
      <PartnerDetailsDrawer
        selected
        open={false}
        setOpen={() => {}}
      />
      {/*  */}
      <QrCodeScanner
        open={scan}
        setOpen={setScan}
        handleScan={(data) =>
          console.log(data)
        }
        color='purple'
      />
      <ClientDetailsDrawer
        selected={false}
        open={false}
        setOpen={() => {}}
      />
      <BagSuccessDialog content='Deal publier avec succées' />
    </div>
  )
}
