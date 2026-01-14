'use client'

import React from 'react'
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  createColumnHelper,
} from '@tanstack/react-table'
import { Eye, User, Mail, PhoneCall, Copy } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { DataTable } from '@/components/tools/DataTable'
import PaginationData from '@/components/tools/PaginationData'
import { TotalValueProps, TotalValues } from '@/types/GlobalType'
import { AvatarAndName } from '@/components/tools/AvatarAndName'
import { ActionsMenu } from '@/components/custom/ActionsMenu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import UserHistoryCard from '../DlcUserHistory'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { useRouter } from 'next/navigation'
import { AppRoutes, DlcRoutes } from '@/lib/routes'

export interface Collaborator {
  id: string
  modificationDate: string
  name: string
  imageUrl: string
  role: string
  email: string
  phone: string
}

const dummyCollaborators: Collaborator[] = [
  {
    id: '1',
    modificationDate: '02 mai 2024',
    name: 'John Doe',
    imageUrl: '/api/placeholder/32/32',
    email: 'john@example.com',
    phone: '+1234567890',
    role: 'Admin',
  },
  {
    id: '2',
    modificationDate: '03 mai 2024',
    name: 'Jane Smith',
    imageUrl: '/api/placeholder/32/32',
    email: 'jane@example.com',
    phone: '+1234567891',
    role: 'User',
  },
  {
    id: '3',
    modificationDate: '04 mai 2024',
    name: 'Alice Johnson',
    imageUrl: '/api/placeholder/32/32',
    email: 'alice@example.com',
    phone: '+1234567892',
    role: 'Manager',
  },
]

const columnHelper = createColumnHelper<Collaborator>()

interface CollaboratorHistoryProps {
  collab: Collaborator[]
  isLoading?: boolean
  id: string
}

const CollaboratorsHistory: React.FC<CollaboratorHistoryProps> = ({
  collab,
  isLoading = false,
  id,
}) => {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [collaborators, setCollaborators] =
    React.useState<Collaborator[]>(collab)
  const [totals, setTotals] = React.useState<TotalValueProps>(TotalValues)
  const [isRefetching, setIsRefetching] = React.useState(false)
  const [isPhoneDialogOpen, setIsPhoneDialogOpen] = React.useState(false)
  const [selectedPhone, setSelectedPhone] = React.useState('')

  const handleCopyPhone = async (phone: string) => {
    try {
      await navigator.clipboard.writeText(phone)
      setIsPhoneDialogOpen(false)
    } catch (err) {
      console.error('Failed to copy phone number:', err)
    }
  }
  const router = useRouter()
  const columns = (router: AppRouterInstance) => [
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
                label: 'Voir détail',
                icon: Eye,
                actions: () => {
                  router.push(
                    DlcRoutes.History.replace(
                      ':detail_id',
                      info.getValue()
                    ).replace(':history_id', id)
                  )
                },
              },
              {
                label: 'Detail du collaborateur',
                icon: User,
                actions: () => {
                  router.push(
                    AppRoutes.collaboratorDetails.replace(
                      ':id',
                      info.getValue()
                    )
                  )
                },
              },
              {
                label: 'Envoyer un email',
                icon: Mail,
                actions: () => {
                  window.location.href = `mailto:${row.email}`
                },
              },
              {
                label: 'Applez',
                icon: PhoneCall,
                actions: () => {
                  setSelectedPhone(row.phone)
                  setIsPhoneDialogOpen(true)
                },
              },
            ]}
            id={info.getValue()}
          />
        )
      },
      header: 'Actions',
    }),
  ]

  const table = useReactTable({
    data: collaborators,
    columns: columns(router),
    state: {
      columnFilters,
    },
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <>
      <Accordion
        type='single'
        collapsible
        defaultValue='collaborators'
        className='w-full rounded-[18px] bg-transparent lg:bg-white'
      >
        <AccordionItem value='collaborators'>
          <AccordionTrigger className='font-montserrat hidden px-6 py-0 text-[22.06px] font-normal leading-[26.9px] text-[#8695AA] lg:flex lg:p-4 lg:py-5'>
            Liste des collaborateurs
          </AccordionTrigger>
          <AccordionContent className='lg:p-4'>
            {(collaborators.length > 0 || isLoading) && (
              <div className='flex flex-col gap-4'>
                <div className='overflow-hidden rounded-lg border-[#D5D9E2] lg:border'>
                  <DataTable
                    data={collaborators}
                    table={table}
                    isLoading={isLoading}
                    title=''
                    transform={(data: Collaborator) => (
                      <UserHistoryCard
                        history={{
                          user: {
                            name: data.name,
                            avatar: data.imageUrl,
                            role: data.role,
                            email: data.email,
                            phone: data.phone,
                          },
                          id: data.id,
                          date: data.modificationDate,
                        }}
                        id={id}
                        rightIcon='eye'
                      />
                    )}
                  />
                </div>
                <PaginationData
                  totalPages={totals.totalPages}
                  currentPage={totals.currentPage}
                  pageSize={totals.pageSize}
                  setCurrentPage={(page) =>
                    setTotals((prev) => ({
                      ...prev,
                      currentPage: page,
                    }))
                  }
                  isLoading={isLoading || isRefetching}
                />
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Dialog open={isPhoneDialogOpen} onOpenChange={setIsPhoneDialogOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle className='font-montserrat text-center'>
              Numéro de téléphone
            </DialogTitle>
          </DialogHeader>
          <div className='flex items-center space-x-2 p-4'>
            <div className='grid flex-1 gap-2'>
              <div className='flex items-center justify-between rounded-md border border-gray-200 p-3'>
                <span className='font-montserrat text-sm'>{selectedPhone}</span>
                <button
                  onClick={() => handleCopyPhone(selectedPhone)}
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
    </>
  )
}

export default CollaboratorsHistory
