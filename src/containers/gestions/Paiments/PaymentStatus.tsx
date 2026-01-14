import { PaymentStatusType } from '@/types/payment-types'
import { usePaymentsTranslations } from '@/hooks/useTranslations'
import { CheckCheck, FileMinus, LoaderCircle, X } from 'lucide-react'
import { FC } from 'react'

interface PaymentStatusProps {
    status: PaymentStatusType
}

export const PaymentStatus: FC<PaymentStatusProps> = ({ status }) => {
    const t = usePaymentsTranslations()
    
    const statusData =
        status === PaymentStatusType.PAID
            ? {
                  style: 'text-mountain-500 bg-mountain-100',
                  icon: <CheckCheck strokeWidth='3px' size={14} />,
                  text: t('commission.statusTypes.validated'),
              }
            : status === PaymentStatusType.IN_PROGRESS
              ? {
                    style: 'bg-amethyst-100 text-amethyst-500',
                    icon: <LoaderCircle strokeWidth='3px' size={14} />,
                    text: t('commission.statusTypes.pending'),
                }
              : {
                    style: 'text-coral-500 bg-coral-100',
                    icon: <X strokeWidth='3px' size={14} />,
                    text: t('commission.statusTypes.notPaid'),
                }

    return (
        <span
            className={`flex h-fit w-fit items-center gap-[0.375rem] rounded-full px-3 py-[0.403rem] text-[0.625rem] font-bold ${statusData.style}`}
        >
            {statusData.icon}
            {statusData.text.toUpperCase()}
        </span>
    )
}
