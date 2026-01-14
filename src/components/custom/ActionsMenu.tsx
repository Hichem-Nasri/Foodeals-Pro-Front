'use client'
import { FC, ForwardRefExoticComponent, RefAttributes, useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ListPlus, LucideProps } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import { NotificationType } from '@/types/GlobalType'
import { useQueryClient } from '@tanstack/react-query'
import { useNotification } from '@/context/NotifContext'
import { CustomButton } from './CustomButton'
import Archiver from '../utils/Archiver'
import api from '@/utils/api'
import { set } from 'animejs'

export type ActionType = {
  label: string
  actions: (id: string, fn?: (data: any) => void) => void
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
  >
  archiveUrl?: string
  shouldNotDisplay?: boolean
}

interface ActionsMenuProps {
  id: string
  menuList: ActionType[]
  className?: string
}

export const ActionsMenu: FC<ActionsMenuProps> = ({
  id,
  menuList,
  className,
}) => {
  const [open, setOpen] = useState(false)
  const [del, setDel] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [closeDrawer, setCloseDrawer] = useState(false)
  const Notif = useNotification()
  const queryClient = useQueryClient()

  const handleArchiver = async (data: any) => {
    const action = menuList.find((item) => item.label === 'Archiver')
    if (!action) return
    setIsPending(true)
    const res = await api
      .delete(
        action
          ?.archiveUrl!.replace(':id', id)
          .replace(':motif', data.motif)
          .replace(':reason', data.raison)
      )
      .then((res) => {
        Notif.notify(NotificationType.SUCCESS, 'Archivé avec succès')
        queryClient.invalidateQueries({ queryKey: ['products-dlc'] })
        action.actions(id)
        setIsPending(false)
      })
      .catch((err) => {
        setIsPending(false)
        Notif.notify(NotificationType.ERROR, "Erreur lors de l'archivage")
      })
    setOpen(false)
  }

  const handleDelete = async (data: any) => {
    const action = menuList.find((item) => item.label.includes('Supprimer'))
    if (!action) return
    setIsPending(true)
    const res = await api
      .delete(
        action
          ?.archiveUrl!.replace(':id', id)
          .replace(':motif', data.motif)
          .replace(':reason', data.raison)
      )
      .then((res) => {
        Notif.notify(NotificationType.SUCCESS, 'Supprimé avec succès')
        action.actions(id)
        setIsPending(false)
      })
      .catch((err) => {
        setIsPending(false)
        Notif.notify(NotificationType.ERROR, 'Erreur lors de la suppression')
      })
    setDel(false)
  }
  return (
    <>
      <Drawer open={closeDrawer} onOpenChange={setCloseDrawer}>
        <DrawerTrigger
          className={cn(
            'mx-auto flex w-fit items-center justify-center rounded-full bg-lynch-300 p-2 text-white focus:outline-none lg:hidden [&>svg]:size-[1.125rem]',
            className
          )}
        >
          <ListPlus />
        </DrawerTrigger>
        <DrawerContent className='flex flex-col gap-2 rounded-t-[16px] p-3 lg:hidden'>
          <h1 className='text-lg font-semibold'>Choisissiez une action</h1>
          {menuList
            .filter((item) => (item.shouldNotDisplay ? false : true))
            .map((item) => {
              return (
                <CustomButton
                  variant='outline'
                  key={item.label}
                  onClick={() => {
                    if (item.label === 'Archiver') {
                      setOpen(true)
                      setCloseDrawer(false)
                    } else if (item.label.includes('Supprimer')) {
                      setDel(true)
                      setCloseDrawer(false)
                    } else item.actions(id)
                  }}
                  size={'sm'}
                  className={cn(
                    'flex cursor-pointer items-center gap-3 rounded-[18px] border-[1.5px] border-lynch-200 px-3 py-2 text-lynch-400 hover:bg-lynch-50',
                    `${
                      item.label === 'Archiver'
                        ? 'border-coral-500 bg-coral-50 text-coral-500'
                        : ''
                    }`
                  )}
                  label={item.label}
                  IconRight={item.icon}
                />
              )
            })}
        </DrawerContent>
      </Drawer>
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            'mx-auto my-auto hidden w-fit items-center justify-center rounded-full bg-lynch-300 p-2 text-white focus:outline-none lg:flex [&>svg]:size-[1.125rem]',
            className
          )}
        >
          <ListPlus />
        </DropdownMenuTrigger>
        <DropdownMenuContent className='hidden flex-col gap-2 rounded-[16px] p-3 lg:flex'>
          {menuList
            .filter((item) => (item.shouldNotDisplay ? false : true))
            .map((item) => {
              return (
                <DropdownMenuItem
                  key={item.label}
                  onClick={() => {
                    if (item.label === 'Archiver') {
                      setOpen(true)
                    } else if (item.label.includes('Supprimer')) {
                      setDel(true)
                      setCloseDrawer(false)
                    } else item.actions(id)
                  }}
                  className='flex cursor-pointer items-center gap-3 rounded-[6px] px-3 py-2 text-lynch-500 hover:bg-lynch-50'
                >
                  <item.icon size={20} />
                  {item.label}
                </DropdownMenuItem>
              )
            })}
        </DropdownMenuContent>
      </DropdownMenu>
      <Archiver
        onSubmit={del ? handleDelete : handleArchiver}
        opened={del || open}
        title={del ? 'Supprimer' : 'Archive'}
        isPending={isPending}
        setOpened={del ? setDel : setOpen}
      />
    </>
  )
}
