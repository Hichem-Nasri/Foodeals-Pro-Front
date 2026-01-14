import { AvatarAndName } from '@/components/tools/AvatarAndName'
import { Button } from '@/components/ui/button'
import { EmailBadge } from '@/components/utils/EmailBadge'
import { PhoneBadge } from '@/components/utils/PhoneBadge'
import { AppRoutes } from '@/lib/routes'
import { SupportType } from '@/types/support'
import { capitalize } from '@/utils/utils'
import { createColumnHelper } from '@tanstack/react-table'
import { Eye, FileMinus, Router } from 'lucide-react'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

const columnHelperSupport = createColumnHelper<SupportType>()

// Translation keys - these will be translated in the component using the columns
const TRANSLATION_KEYS = {
  date: 'table.date',
  received: 'table.received', 
  role: 'table.role',
  phone: 'table.phone',
  email: 'table.email', 
  attachment: 'table.attachment',
  noAttachment: 'table.noAttachment',
  attachmentFile: 'table.attachmentFile',
  object: 'table.object',
  activity: 'table.activity'
}

export const columnsSupport = (router: AppRouterInstance) => [
  columnHelperSupport.accessor('creationDate', {
    cell: (info) => {
      const date = new Date(info.getValue())
      return <div>{date.toISOString()}</div>
    },
    header: TRANSLATION_KEYS.date,
    footer: (info) => info.column.id,
  }),
  columnHelperSupport.accessor('sender', {
    cell: (info) => {
      const fullName = `${capitalize(info.getValue().name.firstName)} ${capitalize(info.getValue().name.lastName)}`
      return (
        <AvatarAndName name={fullName} avatar={info.getValue().avatarPath!} />
      )
    },
    header: TRANSLATION_KEYS.received,
    footer: (info) => info.column.id,
  }),
  columnHelperSupport.accessor('sender.role.name', {
    cell: (info) => <div>{info.getValue()}</div>,
    header: TRANSLATION_KEYS.role,
    footer: (info) => info.column.id,
  }),
  // columnHelperSupport.accessor('parnter', {
  //     cell: (info) => {
  //         const fullName = `${info.getValue().name}`
  //         return (
  //             <AvatarAndName
  //                 name={fullName}
  //                 avatar={info.getValue().avatarPath}
  //             />
  //         )
  //     },
  //     header: 'Partenaire',
  //     footer: (info) => info.column.id,
  // }),
  columnHelperSupport.accessor('sender.phone', {
    cell: (info) => <PhoneBadge phone={info.getValue()} />,
    header: TRANSLATION_KEYS.phone,
    footer: (info) => info.column.id,
  }),
  columnHelperSupport.accessor('sender.email', {
    cell: (info) => <EmailBadge email={info.getValue()} />,
    header: TRANSLATION_KEYS.email,
    footer: (info) => info.column.id,
  }),
  columnHelperSupport.accessor('attachment', {
    cell: (info) => {
      if (info.getValue() === null) return <div>{TRANSLATION_KEYS.noAttachment}</div>
      return (
        <div className='flex items-center justify-normal space-x-1.5 rounded-full bg-lynch-100 px-2 py-1 text-xs text-lynch-500'>
          <FileMinus size={18} />
          <span>{TRANSLATION_KEYS.attachmentFile}</span>
        </div>
      )
    },
    header: TRANSLATION_KEYS.attachment,
    footer: (info) => info.column.id,
  }),
  columnHelperSupport.accessor('content', {
    cell: (info) => <div>{info.getValue()}</div>,
    header: TRANSLATION_KEYS.object,
    footer: (info) => info.column.id,
  }),
  columnHelperSupport.accessor('id', {
    cell: (info) => {
      return (
        <Button
          onClick={() =>
            router.push(
              AppRoutes.supportDetails.replace(':id', info.getValue())
            )
          }
          className='size-8 rounded-full bg-lynch-300 text-white'
        >
          <Eye />
        </Button>
      )
    },
    header: TRANSLATION_KEYS.activity,
    footer: (info) => info.column.id,
  }),
]
