'use client'
import { AvatarField } from '@/components/custom/AvatarField'
import { InputFieldForm } from '@/components/custom/InputField'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import React, { useEffect } from 'react'
import { Form } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import SelectCategory from '../newProducts/SelectCategory'
import { ProductsType } from '@/types/product-type'
import { zodResolver } from '@hookform/resolvers/zod'
import DLCProduct from '@/types/DlcProduct'

const ProductSchema = z.object({
    imageUrl: z.union([z.string(), z.instanceof(File)]),
    title: z.string(),
    brand: z.string(),
    description: z.string(),
    barcode: z.string(),
    category: z.object({
        id: z.string(),
        name: z.string().optional(),
        slug: z.string().optional(),
    }),
    subCategory: z.object({
        id: z.string(),
        name: z.string().optional(),
        slug: z.string().optional(),
    }),
    type: z.string(),
    rayon: z.string(),
    price: z.string(),
})

const ProductDetailsForm = ({ product }: { product: DLCProduct | null }) => {
    const form = useForm<z.infer<typeof ProductSchema>>({
        defaultValues: {
            ...product,
            price: product?.price.amount.toString(),
            title: product?.name,
            barcode: product?.barCode,
        },
        resolver: zodResolver(ProductSchema),
        disabled: true,
        mode: 'onSubmit',
    })

    const onSubmit = async (data: z.infer<typeof ProductSchema>) => {
        /*     try {
      // Handle form submission
      await fetch('/api/update-product', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    } catch (error) {
      console.error('Error updating product:', error)
    } */
    }

    return (
        <Accordion
            type='single'
            collapsible
            className='w-full rounded-[14px] bg-white px-4 py-6 lg:p-4'
            defaultValue='Product'
        >
            <AccordionItem
                value='Product'
                className='text-[1.375rem] font-normal text-lynch-400'
            >
                <AccordionTrigger className='py-0 text-[1.375rem] font-normal'>
                    Information du produit
                </AccordionTrigger>
                <AccordionContent className='pt-7'>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className='flex w-full flex-col items-center justify-center gap-[1.875rem]'
                        >
                            <div className='flex w-full items-center gap-5 lg:justify-center'>
                                <div className='flex items-center space-x-2 lg:justify-center'>
                                    <AvatarField
                                        name='imageUrl'
                                        form={form}
                                        alt={'upload image'}
                                        label='Photo de produit'
                                        className='flex size-[130px] items-center justify-center !rounded-full bg-white lg:bg-transparent'
                                        classNameAvatar='!rounded-full size-[130px] lg:bg-transparent bg-white'
                                        disabled={true}
                                    />
                                </div>
                            </div>
                            <div className='flex h-full w-full flex-col gap-6 rounded-[30px] bg-white px-4 py-[25px] lg:rounded-none lg:bg-transparent'>
                                <div className='flex w-full flex-col items-start gap-3 lg:flex-row'>
                                    <InputFieldForm
                                        control={form.control}
                                        placeholder={'Saisir le titre'}
                                        name={'title'}
                                        label='Titre'
                                        disabled={true}
                                        className='text-lynch-500'
                                    />
                                    <InputFieldForm
                                        control={form.control}
                                        placeholder={'Saisir la marque'}
                                        name={'brand'}
                                        label='Marque'
                                        disabled={true}
                                        className='text-lynch-500'
                                    />
                                    <InputFieldForm
                                        control={form.control}
                                        placeholder={'Saisir la description'}
                                        name={'description'}
                                        label='Description'
                                        disabled={true}
                                        className='text-lynch-500'
                                    />
                                </div>
                                <div className='flex w-full flex-col items-start gap-3 lg:flex-row'>
                                    <InputFieldForm
                                        control={form.control}
                                        placeholder={'Saisir le code bar'}
                                        name={'barcode'}
                                        label='Code Bar'
                                        disabled={true}
                                        className='text-lynch-500'
                                    />
                                    <InputFieldForm
                                        control={form.control}
                                        placeholder={'Saisir la catégorie'}
                                        name={'category.name'}
                                        label='Catégorie'
                                        disabled={true}
                                        className='text-lynch-500'
                                    />
                                    <InputFieldForm
                                        control={form.control}
                                        placeholder={'Saisir la sous catégorie'}
                                        name={'subCategory.name'}
                                        label='Sous Catégorie'
                                        disabled={true}
                                        className='text-lynch-500'
                                    />
                                </div>
                                <div className='flex w-full flex-col items-start gap-3 lg:flex-row'>
                                    <InputFieldForm
                                        control={form.control}
                                        placeholder={'Unité'}
                                        name={'type'}
                                        label="Type d'unité (s)"
                                        disabled={true}
                                        className='text-lynch-500'
                                    />
                                    <InputFieldForm
                                        control={form.control}
                                        placeholder={'Nom du rayon'}
                                        name={'rayon'}
                                        label='Rayon'
                                        disabled={true}
                                        className='text-lynch-500'
                                    />
                                    <InputFieldForm
                                        control={form.control}
                                        placeholder={'Prix'}
                                        name={'price'}
                                        label='Prix'
                                        disabled={true}
                                        className='text-lynch-500'
                                    />
                                </div>
                            </div>
                        </form>
                    </Form>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}

export default ProductDetailsForm
