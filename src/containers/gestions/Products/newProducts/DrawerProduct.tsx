import { CustomButton } from '@/components/custom/CustomButton'
import { Drawer, DrawerContent } from '@/components/ui/drawer'
import { X, CircleCheck } from 'lucide-react'
import React, { FC } from 'react'
import SearchProduct from '../../settings/SearchProduct'
import { Input } from '@/components/custom/Input'
import { Select } from '@/components/custom/Select'

interface DrawerProductProps {
    drawer: boolean
    setDrawer: React.Dispatch<React.SetStateAction<boolean>>
    product: any
    setProduct: React.Dispatch<React.SetStateAction<any>>
}

const DrawerProduct: FC<DrawerProductProps> = ({
    drawer,
    setDrawer,
    product,
    setProduct,
}) => {
    return (
        <Drawer open={drawer} onOpenChange={setDrawer}>
            <DrawerContent className='flex flex-col items-start justify-center gap-5 rounded-t-[24px] p-4'>
                <h1 className='text-xl font-semibold'>Ajouter un produit</h1>
                <SearchProduct handleChangeProduct={(product: any) => {}} />
                <Select
                    label='Produit'
                    placeholder='Selectionner un produit'
                    options={[
                        {
                            key: product?.name,
                            label: product?.name,
                            avatar:
                                'http://localhost:8080/photos/' +
                                product.imageUrl,
                        },
                    ]}
                    onChange={() => {}}
                    value={product?.name}
                    emptyAvatar={'/images/empty-product.svg'}
                    disabled
                />
                <Input
                    label='Code à barre'
                    name='barcode'
                    placeholder='Code à barre'
                    onChange={() => {}}
                    disabled
                    value={product?.barcode}
                />
                <div className='flex h-fit w-full items-center justify-between gap-[10px]'>
                    <CustomButton
                        label='Annuler'
                        size='sm'
                        variant='outline'
                        className='h-16 w-full rounded-[24px]'
                        onClick={() => setDrawer(false)}
                        IconRight={X}
                    />
                    <CustomButton
                        label='CONFIRMER'
                        size='sm'
                        className='h-16 w-full rounded-[24px]'
                        onClick={() => setDrawer(false)}
                        IconRight={CircleCheck}
                    />
                </div>
            </DrawerContent>
        </Drawer>
    )
}

export default DrawerProduct
