import React, { FC } from 'react'
import {
  FileSpreadsheet,
  ImagePlus,
  ListTodo,
  Plus,
  QrCode,
} from 'lucide-react'
import Link from 'next/link'
import { AppRoutes } from '@/lib/routes'
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
  isMobile?: boolean
}

const DropDownListMobile: FC<DropDownListProps> = ({
  list,
  children,
  setSheet,
  setImage,
  isMobile = false,
}) => {
  const style =
    'w-full rounded-[18px] bg-primary text-white focus:bg-primary focus:text-white h-14 flex items-center justify-between gap-2 p-2 cursor-pointer'
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='focus:outline-none' asChild>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent className='gap-0 rounded-[16px] border-0 bg-transparent p-0 px-0 py-0 shadow-none drop-shadow-none'>
        <div className='flex w-full flex-col gap-2 bg-transparent px-2'>
          <DropdownMenuItem className={style} asChild>
            <Link href={AppRoutes.productDetails.replace(':id', 'new')}>
              <span>AJOUTER UN PRODUIT</span>
              <Plus size={22} />
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setImage((prev) => !prev)
            }}
            className={style}
          >
            <span>SCANNER UN PRODUIT</span>
            <QrCode size={22} />
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setSheet((prev) => !prev)}
            className={style}
          >
            <span>IMPORTER DES PRODUITS</span>
            <FileSpreadsheet size={22} />
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default DropDownListMobile
