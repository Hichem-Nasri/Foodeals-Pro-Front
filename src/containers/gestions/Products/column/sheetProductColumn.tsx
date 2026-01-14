import { createColumnHelper } from '@tanstack/react-table'

export type SheetProductType = {
    name: string
    codebar: string
    marque: string
    categorie: string
    sousCategorie: string
}

const columnHelper = createColumnHelper<SheetProductType>()

export const columnsSheetProductTable = [
    columnHelper.accessor('name', {
        cell: (info) => <div>{info.getValue()}</div>,
        header: 'Nom',
        footer: (info) => info.column.id,
    }),
    columnHelper.accessor('codebar', {
        cell: (info) => <div>{info.getValue()}</div>,
        header: 'Code Bar',
        footer: (info) => info.column.id,
    }),
    columnHelper.accessor('marque', {
        cell: (info) => <div>{info.getValue()}</div>,
        header: 'Marque',
        footer: (info) => info.column.id,
    }),
    columnHelper.accessor('categorie', {
        cell: (info) => <div>{info.getValue()}</div>,
        header: 'Categorie',
        footer: (info) => info.column.id,
    }),
    columnHelper.accessor('sousCategorie', {
        cell: (info) => <div>{info.getValue()}</div>,
        header: 'Sous Categorie',
        footer: (info) => info.column.id,
    }),
]
