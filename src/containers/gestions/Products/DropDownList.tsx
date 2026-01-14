import React, { FC } from 'react'
import { FileSpreadsheet, ImagePlus, ListTodo, Plus } from 'lucide-react'
import Link from 'next/link'
import { AppRoutes } from '@/lib/routes'
import { NewImageProduct } from './newProducts/newImage'
import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
// import AppRouter from 'next/dist/client/components/app-router';

interface DropDownListProps {
  list: {
    label: string
    href: string
    icon: any
  }[]
  children: React.ReactNode
  setSheet: React.Dispatch<React.SetStateAction<boolean>>
  setImage: React.Dispatch<React.SetStateAction<boolean>>
}

const DropDownList: FC<DropDownListProps> = ({
  list,
  children,
  setSheet,
  setImage,
}) => {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className='focus:outline-none' asChild>
          {children}
        </DropdownMenuTrigger>
        <DropdownMenuContent className='rounded-[16px]'>
          <div className='flex flex-col gap-2 px-2'>
            <DropdownMenuItem>
              <button
                type='button'
                onClick={() => {
                  setSheet((prev) => !prev)
                }}
                className='flex items-center gap-2 rounded-md p-2 text-lynch-500 hover:bg-gray-100'
              >
                <FileSpreadsheet size={22} />
                <span>Ajouter un produit</span>
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={AppRoutes.productDetails.replace(':id', 'new')}>
                <div className='flex items-center gap-2 rounded-md p-2 text-lynch-500 hover:bg-gray-100'>
                  <Plus size={22} />
                  <span>Ajouter manuellement</span>
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <button
                type='button'
                onClick={() => setImage((prev) => !prev)}
                className='flex items-center gap-2 rounded-md p-2 text-lynch-500 hover:bg-gray-100'
              >
                <ImagePlus size={22} />
                <span>Importer par image</span>
              </button>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default DropDownList
