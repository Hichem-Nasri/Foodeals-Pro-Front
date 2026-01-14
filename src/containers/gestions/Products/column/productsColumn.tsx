import { ActionsMenu } from '@/components/custom/ActionsMenu'
import { AvatarAndName } from '@/components/tools/AvatarAndName'
import { EmailBadge } from '@/components/utils/EmailBadge'
import { PhoneBadge } from '@/components/utils/PhoneBadge'
import { AppRoutes } from '@/lib/routes'
import { ProductsType, ProductType } from '@/types/product-type'
import { capitalize } from '@/utils/utils'
import { createColumnHelper } from '@tanstack/react-table'
import { Eye, Pen, Archive } from 'lucide-react'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

const columnHelperProducts = createColumnHelper<ProductsType>()

export const columnsProducts = (
    router: AppRouterInstance,
    refetch: () => void,
    t: (key: string) => string
) => [
    columnHelperProducts.accessor('ref', {
        cell: (info) => {
            const id = info.row.original.id
            return <div>{id.slice(0, 4) + id.slice(-4)}</div>
        },
        header: t('products.ref'),
        footer: (info) => info.column.id,
    }),
    columnHelperProducts.accessor('name', {
        cell: (info) => {
            const image = info.row.original.imageUrl
            return <AvatarAndName name={info.getValue()} avatar={image} />
        },
        header: t('products.name'),
        footer: (info) => info.column.id,
    }),
    columnHelperProducts.accessor('creationDate', {
        cell: (info) => <div>{info.getValue().split('T')[0]}</div>,
        header: t('products.creationDate'),
        footer: (info) => info.column.id,
    }),
    columnHelperProducts.accessor('barcode', {
        cell: (info) => <div>{info.getValue()}</div>,
        header: t('products.barcode'),
        footer: (info) => info.column.id,
    }),
    columnHelperProducts.accessor('brand', {
        cell: (info) => <div>{info.getValue()}</div>,
        header: t('products.brand'),
        footer: (info) => info.column.id,
    }),
    columnHelperProducts.accessor('category', {
        cell: (info) => <div>{info.getValue()?.name || "Unknown"}</div>,
        header: t('products.category'),
        footer: (info) => info.column.id,
    }),
    columnHelperProducts.accessor('subCategory', {
        cell: (info) => <div>{info.getValue()?.name || "Unknown"}</div>,
        header: t('products.subCategory'),
        footer: (info) => info.column.id,
    }),

    columnHelperProducts.accessor('imageUrl', {
        cell: (info) => null,
        header: '',
        footer: (info) => info.column.id,
    }),
    columnHelperProducts.accessor('id', {
        cell: (info) => {
            return (
                <ActionsMenu
                    id={info.getValue()}
                    menuList={[
                        {
                            label: t('products.view'),
                            icon: Eye,
                            actions: () => {
                                router.push(
                                    AppRoutes.productDetails.replace(
                                        ':id',
                                        info.getValue()
                                    )
                                )
                            },
                        },
                        {
                            label: t('products.edit'),
                            icon: Pen,
                            actions: () => {
                                router.push(
                                    AppRoutes.productDetails.replace(
                                        ':id',
                                        info.getValue()
                                    ) + '?mode=edit'
                                )
                            },
                        },
                        {
                            label: t('products.archive'),
                            icon: Archive,
                            actions: (id: string) => {
                                refetch()
                            },
                            archiveUrl:
                                '/products/delete/:id?reason=:reason&motif=:motif',
                        },
                    ]}
                />
            )
        },
        header: t('products.activity'),
        footer: (info) => info.column.id,
    }),
]
