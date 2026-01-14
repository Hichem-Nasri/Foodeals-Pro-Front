'use client'
import { Label } from '@/components/custom/Label'
import { AvatarAndName } from '@/components/tools/AvatarAndName'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@/components/ui/command'
import { PartnerInfoDto } from '@/types/GlobalType'
import { Search, X } from 'lucide-react'
import React, { FC, useEffect } from 'react'

interface SearchProductProps {
    product: string
    setProduct: React.Dispatch<React.SetStateAction<string>>
}

const SearchProduct: FC<SearchProductProps> = ({ product, setProduct }) => {
    const [search, setSearch] = React.useState('')
    const [products, setProducts] = React.useState<PartnerInfoDto[]>([])
    useEffect(() => {
        console.log('search:', search)
        console.log('products:', products)
        if (search) {
            getListProduct(search).then((data) => {
                setProducts(data!)
            })
        } else {
            setProducts([])
        }
    }, [search])
    return (
        <div className='relative flex h-fit w-full flex-col items-start justify-center space-y-2'>
            <Label label='Rechercher' className='text-sm font-semibold' />

            <Command className=''>
                <CommandInput
                    placeholder='Rechercher un produit'
                    onValueChange={(e) => setSearch(e)}
                    className='h-14 w-full min-w-full'
                />
                <CommandList>
                    {products.length > 0 && (
                        <CommandGroup className='w-full'>
                            {products.map((product) => (
                                <CommandItem
                                    key={product.id}
                                    onClick={() => setProduct(product.id)}
                                    className='flex w-full items-center justify-between'
                                >
                                    <AvatarAndName
                                        name={product.name}
                                        avatar={product.avatarPath}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )}
                </CommandList>
            </Command>
        </div>
    )
}

const getListProduct = async (search: string) => {
    try {
        // const response = await api.get('/products', {
        //     params: { search },
        // });
        // return response.data;
        return [
            {
                id: '1',
                name: 'Product 1',
                avatarPath: '/images/avatar.png',
            },
            {
                id: '2',
                name: 'Product 2',
                avatarPath: '/images/avatar.png',
            },
        ]
    } catch (error) {
        console.log('error:', error)
        return []
    }
}

export default SearchProduct
