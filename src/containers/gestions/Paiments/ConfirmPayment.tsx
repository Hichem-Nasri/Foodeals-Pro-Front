'use client'
import {
    FC,
    ForwardRefExoticComponent,
    RefAttributes,
    useEffect,
    useState,
} from 'react'

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'

import { useMutation } from '@tanstack/react-query'
import { useNotification } from '@/context/NotifContext'
import { NotificationType } from '@/types/GlobalType'
import {
    ConfirmPaymentType,
    defaultValuesConfirmPayment,
    PaymentMethod,
} from '@/types/payment-types'
import { CustomButton } from '@/components/custom/CustomButton'
import MobileHeader from '@/components/custom/MobileHeader'
import { AvatarProfile } from '@/components/tools/AvatarProfile'
import { DatePicker } from '@/components/tools/DatePicker'
import { cn } from '@/lib/utils'
import { LucideProps, CheckCheck, X, CheckCircle } from 'lucide-react'
import { Select } from '@/components/custom/Select'
import { Label } from '@/components/custom/Label'
import { Input } from '@/components/custom/Input'
import Image from 'next/image'
import api from '@/utils/api'

interface ConfirmPaymentProps {
    id: string
    label: string
    disabled?: boolean
    isMobile?: boolean
    className?: string
    IconLeft?: ForwardRefExoticComponent<
        Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
    >
    IconRight?: ForwardRefExoticComponent<
        Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
    >
}

export const getConfirmationInfo = async (
    commissionId?: string
): Promise<ConfirmPaymentType | undefined> => {
    if (!commissionId) return undefined
    try {
        const { getCommissionById } = await import('@/actions/payments')
        const response = await getCommissionById(commissionId)
        if (!response || !response.data || response.status !== 200) return undefined

        const data = response.data
        // Map backend response to ConfirmPaymentType
        return {
            type: data.paymentMethod || 'CARD',
            partner: data.partner || { id: '', name: '', avatarPath: '' },
            emitter: data.emitter || { firstName: '', lastName: '' },
            price: data.amount || { amount: 0, currency: 'MAD' },
            documentPath: data.documentPath || null,
            date: data.date || new Date().toISOString(),
        } as ConfirmPaymentType
    } catch (error) {
        console.error(error)
        return undefined
    }
}

export const ConfirmCommission = async (id: string) => {
    try {
        const response = await api
            .post(`/v1/payments/receive?type=COMMISSION`, {
                id,
            })
            .catch((error) => {
                throw {
                    status: error.response.status,
                    data: error.response.data,
                }
            })
        return { status: response.status, data: response.data }
    } catch (error) {
        return { status: 500, data: null }
    }
}

export const PartnerOptions = [
    { id: '0', name: 'All', avatar: 'https://via.placeholder.com/120' },
    { id: '1', name: 'Supermarché', avatar: 'https://via.placeholder.com/120' },
    { id: '2', name: 'Superettes', avatar: 'https://via.placeholder.com/120' },
] // Fetch options from API

export const ConfirmPayment: FC<ConfirmPaymentProps> = ({
    disabled,
    id,
    label,
    isMobile = false,
    IconLeft,
    IconRight,
    className,
}) => {
    const [confirmationDetails, setConfirmationDetails] =
        useState<ConfirmPaymentType>(defaultValuesConfirmPayment)
    const [fetched, setFetched] = useState(false)

    const Notif = useNotification()
    const { mutate } = useMutation({
        mutationKey: ['paymentConfirmation', id],
        mutationFn: async () => {
            const res = await ConfirmCommission(id)
            if (res.status === 200) {
                Notif.notify(
                    NotificationType.SUCCESS,
                    'Confirmation de paiement effectuée'
                )
                return res.data
            }
            Notif.notify(
                NotificationType.ERROR,
                'Erreur lors de la confirmation de paiement'
            )
        },
    })
    const onSubmit = () => {
        mutate()
    }
    useEffect(() => {
        const fetchConfirmation = async () => {
            const data = await getConfirmationInfo(id)
            if (data) setConfirmationDetails(data)
        }
        if (!fetched) fetchConfirmation()
        setFetched(true)
    }, [fetched, id])

    // INFO: the PartnerOptions is an array of stores as objects with the following structure: { id: string, name: string, avatar: string }
    const adaptOptions = PartnerOptions.map((option) => ({
        key: option.id,
        label: option.name,
    }))
    const fullName = `${confirmationDetails?.emitter.firstName} ${confirmationDetails?.emitter.lastName}`
    const openDocument = () => {
        window.open(confirmationDetails.documentPath!, '_blank')
    }

    return (
        <Dialog>
            <DialogTrigger disabled={disabled} asChild>
                {!isMobile ? (
                    <CustomButton
                        label={label}
                        className={cn(
                            'ml-1 hidden h-fit rounded-[6px] px-7 py-3 text-white lg:flex',
                            className
                        )}
                        disabled={disabled}
                        IconRight={IconRight}
                        IconLeft={IconLeft}
                    />
                ) : (
                    <CustomButton
                        label={label}
                        variant='outline'
                        className={cn(
                            'ml-1 flex h-fit w-full rounded-[18px] border-primary px-7 py-4 text-primary lg:hidden',
                            className
                        )}
                        disabled={disabled}
                        IconRight={IconRight ? IconRight : CheckCheck}
                    />
                )}
            </DialogTrigger>
            <DialogContent className='left-[50%] top-0 max-h-screen w-full max-w-[42.5rem] translate-y-0 gap-[1.875rem] overflow-auto rounded-none p-0 lg:top-[50%] lg:translate-y-[-50%] lg:rounded-[14px] lg:p-5 [&>.Icon]:hidden'>
                <DialogTitle className='hidden text-[1.375rem] font-normal text-lynch-400 lg:flex'>
                    Commission a recevoir
                </DialogTitle>
                <MobileHeader
                    title='Commission a recevoir'
                    onClick={() => {}}
                    buttonType='dialog'
                />
                <div className='flex h-full max-h-[100vh] flex-col gap-3 overflow-y-auto px-5 py-2 lg:p-0'>
                    <div className='flex flex-col items-center gap-4 lg:flex-row'>
                        <Select
                            disabled
                            onChange={() => {}}
                            options={adaptOptions}
                            label='Type'
                            value={confirmationDetails?.partner.id}
                            transform={(value) => {
                                const option = PartnerOptions.find(
                                    (option) => option.name === value
                                )
                                return (
                                    <div className='flex items-center gap-3'>
                                        <AvatarProfile
                                            disabled
                                            iUrl={option?.avatar || ''}
                                            alt={option?.name}
                                            className='size-[40px] !rounded-full'
                                        />
                                        <Label label={option?.name || ''} />
                                    </div>
                                )
                            }}
                        />
                        <div className='flex w-full flex-col items-start gap-3 text-lynch-400'>
                            <Label
                                label={
                                    'Date de ' +
                                    ([
                                        PaymentMethod.CARD_BANK,
                                        PaymentMethod.TRANSFER,
                                    ].includes(confirmationDetails.type)
                                        ? 'paiement'
                                        : 'récupération')
                                }
                                className='text-xs font-semibold text-lynch-950'
                            />
                            <DatePicker
                                disabled
                                onChange={() => {}}
                                value={new Date(confirmationDetails.date)}
                            />
                        </div>
                    </div>
                    <div className='flex flex-col items-center gap-4 lg:flex-row'>
                        <Select
                            disabled
                            onChange={() => {}}
                            options={[
                                {
                                    key: fullName,
                                    label: fullName,
                                },
                            ]}
                            label='Nom émetteur'
                            value={fullName}
                        />
                        <Input
                            disabled
                            name='amount'
                            onChange={() => {}}
                            value={confirmationDetails.price.amount}
                            label='Amount'
                        />
                    </div>
                    <div className='mb-[140px] flex flex-col items-center gap-4 lg:mb-0 lg:flex-row'>
                        <div className='flex w-full flex-col items-start gap-3 text-lynch-400'>
                            <Label
                                label='Document de virement'
                                className='text-xs font-semibold text-lynch-950'
                            />
                            <button
                                type='button'
                                title='open document'
                                key={confirmationDetails.documentPath}
                                className='flex w-full cursor-pointer items-center gap-5 rounded-[24px] bg-lynch-50 p-4'
                                onClick={openDocument}
                            >
                                <Image
                                    width={48}
                                    height={48}
                                    alt='Word'
                                    src={
                                        confirmationDetails.documentPath?.includes(
                                            'pdf'
                                        )
                                            ? '/pdf-icon.png'
                                            : '/word-icon.png'
                                    }
                                />
                                <Label
                                    label={confirmationDetails.documentPath!}
                                    className='text-base font-normal text-lynch-500'
                                />
                            </button>
                        </div>
                    </div>
                    <div className='absolute bottom-0 left-0 right-0 flex items-center gap-3 rounded-t-[12px] bg-white p-2 lg:relative lg:mt-2 lg:justify-end lg:bg-transparent'>
                        <DialogClose asChild>
                            <CustomButton
                                type='button'
                                label='ANNULER'
                                variant='outline'
                                className='order-3 h-fit w-full rounded-[12px] px-5 py-3 text-lynch-400 lg:order-[0] lg:w-fit'
                                IconRight={X}
                            />
                        </DialogClose>
                        <CustomButton
                            label='CONFIRMER'
                            type='button'
                            onClick={onSubmit}
                            className='h-fit w-full rounded-[12px] px-5 py-3 lg:w-fit'
                            IconRight={CheckCircle}
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
