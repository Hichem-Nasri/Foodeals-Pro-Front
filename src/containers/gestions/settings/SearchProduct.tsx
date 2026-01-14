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
import { useSettingsTranslations } from '@/hooks/useTranslations'
import { PartnerInfoDto } from '@/types/GlobalType'
import api from '@/utils/api'
import { capitalize } from '@/utils/utils'
import { Search, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { FC, useEffect, useRef } from 'react'

interface SearchProductProps {
    handleChangeProduct: (product: any) => void
}
type searchProduct = PartnerInfoDto & { category: string }
const SearchProduct: FC<SearchProductProps> = ({ handleChangeProduct }) => {
    const t = useSettingsTranslations()
    const [search, setSearch] = React.useState('')
    const [products, setProducts] = React.useState<any[]>([])
    const [categories, setCategories] = React.useState<string[]>([])
    const [focus, setFocus] = React.useState(false)
    useEffect(() => {
        const fetch = async () => {
            const res = await getListProduct(search)

            setProducts(res)
            if (res?.length > 0) {
                const set = [
                    ...new Set(res?.map((val: any) => val.category.name)),
                ] as string[]

                setCategories(set)
            }
        }
        fetch()
    }, [search])
    const router = useRouter()
    const handleClick = (id: string) => {
        const url = window.location.href
        if (url.includes('product')) {
            router.push(window.location.href.split('?')[0] + `?product=${id}`)
        } else {
            router.push(window.location.href + `?product=${id}`)
        }
    }
    return (
        <div className='relative flex h-fit w-full flex-col items-start justify-center space-y-2'>
            <Label label={t('product.search')} className='text-sm font-semibold' />

            <Command className=''>
                <CommandInput
                    placeholder={t('product.searchProduct')}
                    onValueChange={(e) => setSearch(e)}
                    className='h-14 w-full min-w-full'
                    onFocus={() => setFocus(true)}
                    onBlur={() => {
                        setTimeout(() => {
                            setFocus(false)
                        }, 200)
                    }}
                />
                <CommandList>
                    {focus &&
                        products?.length > 0 &&
                        categories?.map((category: string) => (
                            <CommandGroup
                                className='w-full'
                                heading={category + ''}
                            >
                                {products
                                    ?.filter(
                                        (val) => val.category.name == category
                                    )
                                    ?.map((product) => (
                                        <CommandItem
                                            key={product.id}
                                            className='flex w-full items-center justify-between'
                                        >
                                            <button
                                                onClick={() => {
                                                    handleChangeProduct(product)
                                                }}
                                                title='Voir le produit'
                                                type='button'
                                                className='flex w-full items-center justify-between'
                                            >
                                                <AvatarAndName
                                                    name={product.name}
                                                    avatar={product.avatarPath}
                                                />
                                            </button>
                                        </CommandItem>
                                    ))}
                            </CommandGroup>
                        ))}
                </CommandList>
            </Command>
        </div>
    )
}

const getListProduct = async (search: string) => {
    try {
        const url =
            search !== ''
                ? `/products/search?name=${encodeURIComponent(search)}`
                : '/products'
        const response = await api.get(`${url}?pageNum=0&pageSize=10`, {
            params: { search },
        })
        if (response.status !== 200) throw new Error(response.statusText)
        // return response.data;
        return response?.data?.content
    } catch (error) {
        return []
    }
}

export default SearchProduct
