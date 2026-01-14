'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    ShoppingBag,
    BadgePercent,
    User,
    Mail,
    PhoneCall,
    ShoppingBasket,
    Copy,
    ArrowLeft,
} from 'lucide-react'
import {
    ColumnFiltersState,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    createColumnHelper,
} from '@tanstack/react-table'
import MobileHeaderDlc from '@/components/custom/MobileHeaderDlc'
import ProductCardDlc from '@/containers/pro_dlc/ProductCardDlc'
import HistoryCard from '@/components/custom/HistoryCard'
import { DataTable } from '@/components/tools/DataTable'
import { columnsProducts } from '@/containers/pro_dlc/DlcProductColumn'
import { ActionsMenu } from '@/components/custom/ActionsMenu'
import { AvatarAndName } from '@/components/tools/AvatarAndName'
import { useMediaQuery } from 'react-responsive'
import { Layout } from '@/components/layout/Layout'
import DropDownList from '@/containers/pro_dlc/DropDownList'
import { CustomButton } from '@/components/custom/CustomButton'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import SelectionActions from '@/containers/pro_dlc/global/ActionsButtons'
import { Collaborator } from '@/containers/pro_dlc/history/CollaboratorHistory'
import { ProductDlcExtract } from '@/containers/pro_dlc/utils/dataExtract'
import { appApi, DlcRoutes } from '@/lib/routes'
import { NotificationType } from '@/types/GlobalType'
import api from '@/utils/api'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { useNotification } from '@/context/NotifContext'
import DLCProduct from '@/types/DlcProduct'
import ProductCardDlcSkeleton from '@/containers/pro_dlc/CardSckeleton'
import UserHistoryCard from '@/containers/pro_dlc/DlcUserHistory'
import DetailsHistoryCard from '@/containers/pro_dlc/history/DetailsHistoryCard'

const dummyProduct = [
    {
        id: '1',
        name: 'Product Name',
        brand: 'Brand Name',
        title: 'Product Title',
        imageUrl: '',
        quantity: 5,
        creationDate: new Date().toISOString(),
        life_time: '2 days',
        category: {
            id: '1',
            name: 'Category Name',
            slug: 'category-name',
        },
        price: {
            amount: 19.99,
            currency: 'EUR',
        },
        subCategory: {
            id: '1',
            name: 'Sub Category Name',
            slug: 'sub-category-name',
        },
        rayon: 'Rayon Name',
        unity: 'kg',
        dateEncoreFraiche: '2024-01-01',
        dateFraiche: '2024-01-01',
        dateAConsommerBientot: '2024-01-01',
        prgEncoreFraiche: '2024-01-01',
        prgFraiche: '2024-01-01',
        prgAConsommerBientot: '2024-01-01',
        type: 'urgente' as const,
    },
]

export type collaborateurType = {
    id: string
    modificationDate: string
    name: string
    imageUrl: string
    email: string
    phone: string
    role: string
}

const dummyCollaborator = [
    {
        id: '1',
        modificationDate: '2024-01-01',
        name: 'John Doe',
        imageUrl: '',
        email: 'john.doe@example.com',
        phone: '+33 6 12 34 56 78',
    },
]

export type HistoryType = {
    oldQuantity: number
    newQuantity: number
    oldDiscount: number
    newDiscount: number
}
const DlcHistory = ({ dlcId, userId }: { dlcId: string; userId: string }) => {
    const router = useRouter()
    console.log('DlcHistory rendered at:', new Date().toISOString())
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([])
    const [sheet, setSheet] = useState(false)
    const [image, setImage] = useState(false)
    const [user, setUser] = useState<collaborateurType[]>([])
    const [history, setHistory] = useState<HistoryType>({
        oldDiscount: 0,
        newQuantity: 0,
        oldQuantity: 0,
        newDiscount: 0,
    })
    const [isPhoneDialogOpen, setIsPhoneDialogOpen] = React.useState(false)
    const [selectedPhone, setSelectedPhone] = React.useState('')
    // const isMobile = useMediaQuery({ query: '(max-width: 1024px)' })
    const [product, setProduct] = useState<DLCProduct[]>([])
    const handleValuation = (id: string) => {}
    const handleSelect = (id: string, mode: 'add' | 'update' | 'view') => {}
    const { notify } = useNotification()
    const { data, isLoading, error, isRefetching } = useQuery({
        queryKey: ['products-dlc'],
        queryFn: async () => {
            try {
                const res = await api.get(
                    appApi.dlc + `/last-modification/${userId}/${dlcId}`
                )
                if (res.status !== 200) {
                    throw new Error(
                        'Erreur lors de la récupération des produits'
                    )
                }
                const { dlcResponse, ...data } = res.data
                const productDlc = ProductDlcExtract(dlcResponse)
                console.log('productDlc: ', productDlc)
                setProduct([productDlc])
                const { createdBy } = dlcResponse?.productResponse
                setUser(
                    () =>
                        [
                            {
                                name:
                                    createdBy?.name?.firstName +
                                    ' ' +
                                    createdBy?.name?.lastName,
                                email: createdBy?.email,
                                phone: createdBy?.phone,
                                role: createdBy?.role?.name,
                                modificationDate: new Date().toISOString(),
                                id: userId,
                                imageUrl: createdBy?.avatarPath || '',
                            },
                        ] as collaborateurType[]
                )
                setHistory({ ...data })
                return res.data
            } catch (error) {
                notify(
                    NotificationType.ERROR,
                    'Erreur lors de la récupération de la DLC'
                )
                return null
            }
        },
        placeholderData: keepPreviousData,
    })

    const handleCopyPhone = async (phone: string) => {
        try {
            await navigator.clipboard.writeText(phone)
            setIsPhoneDialogOpen(false)
        } catch (err) {
            console.error('Failed to copy phone number:', err)
        }
    }

    const handleBack = () => {
        const currentPath = window.location.pathname
        const detailId = currentPath.split('/')[3]
        router.push(DlcRoutes.Details.replace(':id', detailId))
    }

    const columnHelper = createColumnHelper<collaborateurType>()

    const collaboratorColumns = [
        columnHelper.accessor('modificationDate', {
            cell: (info) => info.getValue(),
            header: 'Date de modification',
        }),
        columnHelper.accessor('name', {
            cell: (info) => (
                <AvatarAndName
                    name={info.getValue()}
                    avatar={info.row.original.imageUrl}
                />
            ),
            header: 'Par',
        }),
        columnHelper.accessor('id', {
            cell: (info) => {
                const row = info.row.original
                return (
                    <ActionsMenu
                        menuList={[
                            {
                                label: 'Detail du collaborateur',
                                icon: User,
                                actions: () => { },
                            },
                            {
                                label: 'Envoyer un email',
                                icon: Mail,
                                actions: () => {
                                    window.location.href = `mailto:${row.email}`;
                                },
                            },
                            {
                                label: 'Applez',
                                icon: PhoneCall,
                                actions: () => {
                                    setSelectedPhone(row.phone);
                                    setIsPhoneDialogOpen(true);
                                },
                            },
                        ]} id={info.getValue()}                    />
                )
            },
            header: 'Actions',
        }),
    ]

    const columns = columnsProducts(
        router,
        (id) => {},
        (id, mode) => {}
    ).slice(1, 12)

    const productTable = useReactTable({
        data: product,
        columns: columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: {
            columnFilters,
        },
        onColumnFiltersChange: setColumnFilters,
    })

    const collaboratorTable = useReactTable({
        data: user,
        columns: collaboratorColumns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    })

    // const MobileView = () => (
    //     <div className='min-h-screen bg-[#f6f7f9]'>
    //         <MobileHeaderDlc title='Détail de la DLC' onClick={handleBack} />

    //         <div className='flex flex-col gap-4 px-4'>
    //             {isLoading ? (
    //                 <ProductCardDlcSkeleton />
    //             ) : (
    //                 <ProductCardDlc product={product!} />
    //             )}

    //             <div className='grid grid-cols-2 gap-4'>
    //                 <HistoryCard
    //                     Icon={ShoppingBag}
    //                     title='Ancien QTE'
    //                     value={'x' + history.oldQuantity}
    //                     color='#B1BBC8'
    //                 />
    //                 <HistoryCard
    //                     Icon={ShoppingBag}
    //                     title='QTE modifier'
    //                     value={'x' + history.newQuantity}
    //                     color='#FAC215'
    //                 />
    //                 <HistoryCard
    //                     Icon={BadgePercent}
    //                     title='Ancien Modifier'
    //                     value={'x' + history.oldDiscount}
    //                     color='#B1BBC8'
    //                 />
    //                 <HistoryCard
    //                     Icon={BadgePercent}
    //                     title='Reduction modifier'
    //                     value={'x' + history.newDiscount}
    //                     color='#FAC215'
    //                 />
    //             </div>
    //         </div>
    //     </div>
    // )

    const DesktopView = () => (
        <div className='flex w-full flex-col gap-6'>

            <div className='hidden w-full justify-between rounded-[18px] bg-white p-2 lg:flex'>
                <CustomButton
                    label='Router'
                    IconLeft={ArrowLeft}
                    variant='outline'
                    className='h-12'
                    size={'sm'}
                />
                <DropDownList setSheet={setSheet} setImage={setImage}>
                    <span>Ajouter une DLC</span>
                    <ShoppingBasket size={22} />
                </DropDownList>
            </div>
            <div className='flex w-full flex-col-reverse gap-6 p-4 lg:flex-col lg:p-0'>
                <DetailsHistoryCard history={history} isLoading={isLoading} />
                <div className='flex w-full flex-col gap-6'>
                    <DataTable
                        data={product}
                        table={productTable}
                        isLoading={isLoading}
                        title='Product'
                        transform={(product) => (
                            <>
                                <ProductCardDlc
                                    product={product}
                                    borderColor={
                                        product?.type === 'urgente'
                                            ? 'border-coral-500'
                                            : product.type == 'exigée'
                                              ? 'border-tulip-600'
                                              : 'border-primary'
                                    }
                                />
                            </>
                        )}
                    />
                    <DataTable
                        data={user}
                        table={collaboratorTable}
                        isLoading={isLoading}
                        title='User'
                        transform={(data) => (
                            <UserHistoryCard
                                history={{
                                    user: {
                                        name: data?.name || '',
                                        avatar: data?.imageUrl || '',
                                        role: data?.role || '',
                                        email: data?.email || '',
                                        phone: data?.phone || '',
                                    },
                                    id: data?.id,
                                    date: data?.modificationDate,
                                }}
                                id={dlcId}
                                toDetails
                                rightIcon='eye'
                            /> // TODO: check the redirect user detail
                        )}
                    />
                </div>
            </div>

            <Dialog
                open={isPhoneDialogOpen}
                onOpenChange={setIsPhoneDialogOpen}
            >
                <DialogContent className='sm:max-w-md'>
                    <DialogHeader>
                        <DialogTitle className='font-montserrat text-center'>
                            Numéro de téléphone
                        </DialogTitle>
                    </DialogHeader>
                    <div className='flex items-center space-x-2 p-4'>
                        <div className='grid flex-1 gap-2'>
                            <div className='flex items-center justify-between rounded-md border border-gray-200 p-3'>
                                <span className='font-montserrat text-sm'>
                                    {selectedPhone}
                                </span>
                                <button
                                    onClick={() =>
                                        handleCopyPhone(selectedPhone)
                                    }
                                    className='font-montserrat flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-900'
                                >
                                    <Copy className='h-4 w-4' />
                                    Copier
                                </button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )

    return <DesktopView />
}

export default DlcHistory
