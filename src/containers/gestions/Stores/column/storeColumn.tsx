import {
  ActionsMenu,
  ActionType,
} from '@/components/custom/ActionsMenu'
import { AvatarAndName } from '@/components/tools/AvatarAndName'
import { EmailBadge } from '@/components/utils/EmailBadge'
import { PartnerSolution } from '@/components/utils/PartnerSolution'
import { PhoneBadge } from '@/components/utils/PhoneBadge'
import { AppRoutes } from '@/lib/routes'
import { PartnerSolutionType } from '@/types/GlobalType'
import { StoresType } from '@/types/store-type'
import { capitalize } from '@/utils/utils'
import { createColumnHelper } from '@tanstack/react-table'
import {
  Eye,
  Pencil,
  Archive,
  Users,
} from 'lucide-react'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

const columnHelper =
  createColumnHelper<StoresType>()

export const columnsStoresTable = (
  router: AppRouterInstance,
  refetch: () => void,
  archive: boolean,
  t?: (key: string) => string,
  ct?: (key: string) => string
) => [
  columnHelper.accessor('name', {
    cell: (info) => {
      const avatar =
        info.row.original.avatarPath
      return (
        <AvatarAndName
          name={info.getValue()}
          avatar={avatar}
        />
      )
    },
    header: t ? t('name') : 'Magasin',
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('type', {
    cell: (info) => (
      <div>{info.getValue()}</div>
    ),
    header: t ? t('type') : 'Type',
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('manager', {
    cell: (info) => {
      const fullName =
        capitalize(
          info.getValue().name
            ?.firstName
        ) +
        ' ' +
        capitalize(
          info.getValue().name?.lastName
        )
      return (
        <AvatarAndName
          name={fullName}
          avatar={
            info.getValue().avatarPath!
          }
        />
      )
    },
    header: t ? t('manager') : 'Responsable',
    footer: (info) => info.column.id,
  }),

  columnHelper.accessor(
    'numberOfOffers',
    {
      cell: (info) => (
        <div>{info.getValue()}</div>
      ),
      header: t ? t('offers') : 'Offres',
      footer: (info) => info.column.id,
    }
  ),
  columnHelper.accessor(
    'numberOfOrders',
    {
      cell: (info) => (
        <div>{info.getValue()}</div>
      ),
      header: t ? t('orders') : 'Commandes',
      footer: (info) => info.column.id,
    }
  ),
  columnHelper.accessor(
    'numberOfCollabs',
    {
      cell: (info) => (
        <div>{info.getValue()}</div>
      ),
      header: t ? t('collaborators') : 'Collaborateurs',
      footer: (info) => info.column.id,
    }
  ),
  columnHelper.accessor(
    'addressReponse.city.name',
    {
      cell: (info) => (
        <div>{info.getValue()}</div>
      ),
      header: t ? t('city') : 'Ville',
      footer: (info) => info.column.id,
    }
  ),
  columnHelper.accessor(
    'addressReponse.city',
    {
      cell: (info) => (
        <div>
          {
            info
              .getValue()
              .regionsResponse.at(0)
              ?.name
          }
        </div>
      ),
      header: ct ? ct('region') : 'Région',
      footer: (info) => info.column.id,
    }
  ),
  columnHelper.accessor('phone', {
    cell: (info) => (
      <PhoneBadge
        phone={info.getValue()}
      />
    ),
    header: t ? t('phone') : 'Téléphone',
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('email', {
    cell: (info) => (
      <EmailBadge
        email={info.getValue()}
      />
    ),
    header: t ? t('email') : 'Email',
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('solutions', {
    cell: (info) => {
      console.log(
        'info: ',
        info.getValue()
      )
      return (
        <div className='flex w-full gap-1'>
          {info
            .getValue()
            .map((solution) => (
              <PartnerSolution
                solution={
                  solution.name as PartnerSolutionType
                }
              />
            ))}
        </div>
      )
    },
    header: t ? t('solutions') : 'Solutions',
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor(
    'creationDate',
    {
      cell: (info) => {
        const date = new Date(
          info.getValue()
        )
        return (
          <div>
            {date
              .getFullYear()
              .toString()}
          </div>
        )
      },
      header: t ? t('creationDate') : 'Date de creation',
      footer: (info) => info.column.id,
    }
  ),
  columnHelper.accessor('id', {
    cell: (info) => {
      let list: ActionType[] = [
        {
          label: t ? t('view') : 'Voir',
          icon: Eye,
          actions: () => {
            router.push(
              AppRoutes.storeDetails.replace(
                ':id',
                `${info.getValue()}`
              )
            )
          },
        },
        {
          label: t ? t('edit') : 'Modifier',
          icon: Pencil,
          actions: () => {
            router.push(
              AppRoutes.storeDetails.replace(
                ':id',
                `${info.getValue()}?mode=edit`
              )
            )
          },
        },
        {
          label: t ? t('collaborators') : 'Collaborateurs',
          icon: Users,
          actions: () => {
            router.push(
              AppRoutes.collaborators.replace(
                ':id',
                info.getValue()
              )
            )
          },
        },
        {
          label: t ? t('archive') : 'Archiver',
          icon: Archive,
          actions: () => {
            refetch()
            // handleArchive()
          },
          archiveUrl:
            '/subentities/:id?motif=:motif&reason=:reason',
        },
      ]
      return (
        <ActionsMenu
          id={info.getValue()}
          menuList={archive ? [] : list}
        />
      )
    },
    header: ct ? ct('actions') : 'Actions',
    footer: (info) => info.column.id,
  }),
]
