import React, { FC, useState } from 'react'
import {
    FileSpreadsheet,
    ImagePlus,
    ListTodo,
    Plus,
    QrCode,
    ShoppingBasket,
} from 'lucide-react'
import Link from 'next/link'
import { AppRoutes } from '@/lib/routes'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import DrawerProductDlc from '@/containers/pro_dlc/newProducts/DrawerProduct'
import { useTranslations } from '@/hooks/useTranslations'

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
    const { t } = useTranslations();
    const [drawerOpen, setDrawerOpen] = useState(false)

    const style =
        'flex items-center gap-[10px] justify-between w-full text-white bg-[#FAC215] rounded-[18px] p-[20px] lg:hidden'

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger
                    className='focus:outline-none lg:hidden'
                    asChild
                >
                    {children}
                </DropdownMenuTrigger>
                <DropdownMenuContent className='gap-0 rounded-[16px] border-0 bg-transparent p-0 px-0 py-0 shadow-none drop-shadow-none lg:hidden'>
                    <div className='flex w-full flex-col gap-0 bg-transparent px-2'>
                        <DropdownMenuItem>
                            <button
                                type='button'
                                onClick={() => setDrawerOpen(true)}
                                className={style}
                            >
                                <span>{t('dlc.add').toUpperCase()}</span>
                                <ShoppingBasket size={22} />
                            </button>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <button
                                type='button'
                                onClick={() => {
                                    setImage((prev) => !prev)
                                }}
                                className={style}
                            >
                                <span>{t('products.importByImage').toUpperCase()}</span>
                                <QrCode size={22} />
                            </button>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <button
                                type='button'
                                onClick={() => setSheet((prev) => !prev)}
                                className={style}
                            >
                                <span>{t('common.import').toUpperCase()} DLC</span>
                                <FileSpreadsheet size={22} />
                            </button>
                        </DropdownMenuItem>
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>

            <DrawerProductDlc
                drawer={drawerOpen}
                setDrawer={setDrawerOpen}
                type={'add'}
            />
        </>
    )
}

export default DropDownListMobile
