import { PartnerStatusType } from '@/types/GlobalType'
import { CheckCheck, FileMinus, LoaderCircle, X } from 'lucide-react'
import { FC } from 'react'

interface PartnerStatusProps {
    status: PartnerStatusType
}

export const PartnerStatus: FC<PartnerStatusProps> = ({ status }) => {
    const statusData =
        status === PartnerStatusType.VALID
            ? {
                  style: 'text-mountain-500 bg-mountain-100',
                  icon: <CheckCheck strokeWidth='3px' size={14} />,
                  text: 'Validé',
              }
            : status === PartnerStatusType.IN_PROGRESS
              ? {
                    style: 'bg-amethyst-100 text-amethyst-500',
                    icon: <LoaderCircle strokeWidth='3px' size={14} />,
                    text: 'En attente',
                }
              : status === PartnerStatusType.CANCELED
                ? {
                      style: 'text-red-400 bg-red-100',
                      icon: <X strokeWidth='3px' size={14} />,
                      text: 'Annulé',
                  }
                : {
                      style: 'bg-lynch-100 text-lynch-400',
                      icon: <FileMinus strokeWidth='3px' size={14} />,
                      text: 'Brouillon',
                  }

    return (
        <span
            className={`flex h-fit w-fit shrink-0 items-center gap-[0.375rem] rounded-full px-3 py-[0.403rem] text-[0.625rem] font-bold ${statusData.style}`}
        >
            {statusData.icon}
            {statusData.text.toUpperCase()}
        </span>
    )
}
