import { PaymentMethodEnum } from '@/types/GlobalType'
import { Banknote, CreditCard } from 'lucide-react'

export default function PaymentMethod({ type }: { type: PaymentMethodEnum }) {
  console.log('PaymentMethod -> type', type)
  return (
    <div className='flex flex-1 flex-col gap-2'>
      <h3 className='text-lynch-950'>Paiement par</h3>
      <div className='flex items-center gap-1.5'>
        {type === PaymentMethodEnum.CARD && (
          <>
            <CreditCard />
            <span>Carte bancaire</span>
          </>
        )}

        {type === PaymentMethodEnum.CASH && (
          <>
            <Banknote />
            <span>Espèces</span>
          </>
        )}
      </div>
    </div>
  )
}
