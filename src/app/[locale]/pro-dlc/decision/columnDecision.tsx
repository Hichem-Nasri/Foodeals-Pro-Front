import { AvatarAndName } from '@/components/tools/AvatarAndName'
import { PartnerSolution } from '@/components/utils/PartnerSolution'
import { createColumnHelper } from '@tanstack/react-table'
import { dlcDecisionType } from '.'

export const getColumnsDecision = (t: (key: string, fallback?: string) => string) => {
  const columnHelper = createColumnHelper<dlcDecisionType>()
  return [
    columnHelper.accessor('name', {
      cell: (info) => {
        const imageUrl = info.row.original.imageUrl
        return <AvatarAndName name={info.getValue()} avatar={imageUrl} />
      },
      header: t('products.name', 'Name'),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor('brand', {
      cell: (info) => (
        <div className='flex items-center gap-2'>{info.getValue()}</div>
      ),
      header: t('products.brand', 'Brand'),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor('category', {
      cell: (info) => <div>{info.getValue()?.name}</div>,
      header: t('products.category', 'Category'),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor('subCategory', {
      cell: (info) => <div>{info.getValue()?.name}</div>,
      header: t('products.subCategory', 'Sub Category'),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor('quantity', {
      cell: (info) => <div>{info.getValue()}</div>,
      header: t('products.stock', 'Quantity'),
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor('solution', {
      cell: (info) => <PartnerSolution solution={info.getValue()} />,
      header: t('fields.solutions', 'Solution'),
      footer: (info) => info.column.id,
    }),
  ]
}
