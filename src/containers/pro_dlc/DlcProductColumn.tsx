import { createColumnHelper } from '@tanstack/react-table'
import DLCProduct from '@/types/DlcProduct'
import { AvatarAndName } from '@/components/tools/AvatarAndName'
import { ActionsMenu } from '@/components/custom/ActionsMenu'
import {
  Eye,
  Pen,
  Trash2,
  Salad,
  Minus,
  Check,
  ScanEye,
  ClockArrowUp,
} from 'lucide-react'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import {
  AppRoutes,
  DlcRoutes,
} from '@/lib/routes'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { RadioButton } from '@/components/custom/RadioButton'

const columnHelper =
  createColumnHelper<DLCProduct>()

export const columnsProducts = (
  router: AppRouterInstance,
  handleValuation: (id: string) => void,
  handleSelect: (
    id: string,
    mode: 'update' | 'view'
  ) => void
) => [
  {
    id: 'select',
    header: ({
      table,
    }: {
      table: any
    }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() &&
            'indeterminate')
        }
        onCheckedChange={(value) =>
          table.toggleAllPageRowsSelected(
            !!value
          )
        }
        Icon={
          table.getIsSomePageRowsSelected() ? (
            <Minus
              className={cn(
                'flex items-center justify-center rounded-[4px]',
                {
                  'bg-tulip-400 text-white':
                    !table.getIsAllPageRowsSelected() &&
                    table.getIsSomePageRowsSelected(),
                }
              )}
              size={16}
            />
          ) : (
            <Check
              className='flex items-center justify-center'
              size={16}
            />
          )
        }
        aria-label='Select all'
        className='data-[state=checked]:border-none data-[state=checked]:bg-tulip-400'
      />
    ),
    cell: ({ row }: { row: any }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => {
          row.toggleSelected(!!value)
          row.original.id =
            row.getIsSelected()
              ? row.original.id
              : null
        }}
        aria-label='Select row'
        className='data-[state=checked]:border-none data-[state=checked]:bg-tulip-400'
      />
    ),
    enableSorting: false,
    enableHiding: false,
    innerWidth: 20,
  },
  columnHelper.accessor('name', {
    cell: (info) => {
      return (
        <AvatarAndName
          name={info.getValue()}
          avatar={
            info.row.original.imageUrl
          }
        />
      )
    },
    header: 'Nom',
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('brand', {
    cell: (info) => (
      <div>{info.getValue()}</div>
    ),
    header: 'Marque',
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('category', {
    cell: (info) => (
      <div>{info.getValue().name}</div>
    ),
    header: 'Catégorie',
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('subCategory', {
    cell: (info) => (
      <div>{info.getValue().name}</div>
    ),
    header: 'Sous Catégorie',
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('price', {
    cell: (info) => (
      <div>
        {info?.getValue()?.amount}{' '}
        {info?.getValue()?.currency}
      </div>
    ),
    header: 'Prix',
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('unity', {
    cell: (info) => (
      <div>{info.getValue()}</div>
    ),
    header: 'Unité',
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('quantity', {
    cell: (info) => (
      <div>x{info.getValue()}</div>
    ),
    header: 'Quantité',
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('rayon', {
    cell: (info) => (
      <div>{info.getValue()}</div>
    ),
    header: 'Rayon',
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('dateFraiche', {
    cell: (info) => (
      <div className='text-green-500'>
        {info.getValue()}
      </div>
    ),
    header: 'Fraiche',
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor(
    'dateEncoreFraiche',
    {
      cell: (info) => (
        <div className='text-yellow-500'>
          {info.getValue()}
        </div>
      ),
      header: 'Encore Fraiche',
      footer: (info) => info.column.id,
    }
  ),
  columnHelper.accessor(
    'dateAConsommerBientot',
    {
      cell: (info) => (
        <div className='text-red-500'>
          {info.getValue()}
        </div>
      ),
      header: 'À Consommer Bientôt',
      footer: (info) => info.column.id,
    }
  ),
  columnHelper.accessor('id', {
    cell: (info) => {
      return (
        <ActionsMenu
          menuList={[
            {
              label: 'Valorisé un DLC',
              icon: Salad,
              actions: () => {
                handleValuation(
                  info.getValue()
                )
              },
            },
            {
              label: 'Voir un DLC',
              icon: Eye,
              actions: () => {
                handleSelect(
                  info.getValue(),
                  'view'
                )
              },
            },
            {
              label: 'Modifier un DLC',
              icon: Pen,
              actions: () => {
                handleSelect(
                  info.getValue(),
                  'update'
                )
              },
            },
            {
              label: 'Voir le détail',
              icon: ClockArrowUp,
              actions: () => {
                router.push(
                  DlcRoutes.Details.replace(
                    ':id',
                    info.getValue()
                  )
                )
              },
            },
            {
              label: 'Supprimer un DLC',
              icon: Trash2,
              actions: () => {},
              archiveUrl:
                '/dlcs/delete/:id?motif=:motif&reason=:reason',
            },
          ]}
          id={info.getValue()}
        />
      )
    },
    header: 'Actions',
    footer: (info) => info.column.id,
  }),
]

export const columnsProductsRedio = (
  selected: string,
  setSelected: React.Dispatch<
    React.SetStateAction<string>
  >
) => [
  columnHelper.accessor('id', {
    cell: (info) => {
      return (
        <Checkbox
          checked={
            selected === info.getValue()
          }
          className='rounded-full data-[state=checked]:border-none data-[state=checked]:bg-tulip-400'
          onChange={() =>
            setSelected(info.getValue())
          }
          onCheckedChange={() =>
            setSelected(info.getValue())
          }
        />
      )
    },
    header: 'Sélection',
  }),
  columnHelper.accessor('name', {
    cell: (info) => {
      return (
        <AvatarAndName
          name={info.getValue()}
          avatar={
            info.row.original.imageUrl
          }
        />
      )
    },
    header: 'Nom',
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('brand', {
    cell: (info) => (
      <div>{info.getValue()}</div>
    ),
    header: 'Marque',
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('category', {
    cell: (info) => (
      <div>{info.getValue().name}</div>
    ),
    header: 'Catégorie',
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('subCategory', {
    cell: (info) => (
      <div>{info.getValue().name}</div>
    ),
    header: 'Sous Catégorie',
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('price', {
    cell: (info) => (
      <div>
        {info.getValue().amount}{' '}
        {info.getValue().currency}
      </div>
    ),
    header: 'Prix',
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('unity', {
    cell: (info) => (
      <div>{info.getValue()}</div>
    ),
    header: 'Unité',
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('quantity', {
    cell: (info) => (
      <div>x{info.getValue()}</div>
    ),
    header: 'Quantité',
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('rayon', {
    cell: (info) => (
      <div>{info.getValue()}</div>
    ),
    header: 'Rayon',
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('dateFraiche', {
    cell: (info) => (
      <div className='text-green-500'>
        {info.getValue()}
      </div>
    ),
    header: 'Fraiche',
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor(
    'dateEncoreFraiche',
    {
      cell: (info) => (
        <div className='text-yellow-500'>
          {info.getValue()}
        </div>
      ),
      header: 'Encore Fraiche',
      footer: (info) => info.column.id,
    }
  ),
  columnHelper.accessor(
    'dateAConsommerBientot',
    {
      cell: (info) => (
        <div className='text-red-500'>
          {info.getValue()}
        </div>
      ),
      header: 'À Consommer Bientôt',
      footer: (info) => info.column.id,
    }
  ),
]
