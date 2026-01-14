import React, { FC, useEffect, useState } from 'react'
import { Control, UseFormReturn } from 'react-hook-form'
import SubCategorySelect from './SubCategorySelect'
import api from '@/utils/api'
import CategorySelect from './CategorySelect'
import { z } from 'zod'
import { ProductSchema } from '@/schemas/gestion/product-schema'
import { set } from 'animejs'

interface SelectCategoryProps {
  form: UseFormReturn<any>
  control: Control<any>
  disabled: boolean
  withSubCategory?: boolean
  name?: {
    category: string
    subCategory: string
  }
}
// data any => MultiselectOptionsType[]
const SelectCategory: FC<SelectCategoryProps> = ({
  form,
  control,
  disabled,
  withSubCategory = true,
  name = {
    category: 'category.id',
    subCategory: 'subCategory.id',
  },
}) => {
  const [data, setData] = useState<any[]>([])
  const [selected, setSelect] = useState<{
    category: string
    subCategory: string
  }>(() => ({
    category: form.getValues('category.id') || '',
    subCategory: form.getValues('subCategory.id') || '',
  }))
  const [categoryOptions, setCategoryOptions] = useState<any[]>([])
  const [subCategoryOptions, setSubCategoryOptions] = useState<any[]>([])

  // Fetch categories once when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/product-categories/all')
        setData(response.data)
        const options = response.data.map((category: any) => ({
          label: category.name,
          key: category.id,
          avatar: 'http://localhost:8080/photos/' + category.imageUrl,
        }))
        setCategoryOptions(options)
        if (selected.category) {
          const category = response.data.find(
            (category: any) => category.id === selected.category
          )
          if (category) {
            const options = category.subCategories.map((subCategory: any) => ({
              label: subCategory.name,
              key: subCategory.id,
            }))
            if (options.length == 0) {
              form.setValue(name.subCategory, 'none')
            } else {
              form.setValue(name.subCategory, '')
            }
            setSubCategoryOptions(options)
          }
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    if (selected.category) {
      const category = data.find(
        (category: any) => category.id === selected.category
      )
      if (category) {
        const options = category.subCategories.map((subCategory: any) => ({
          label: subCategory.name,
          key: subCategory.id,
        }))
        setSubCategoryOptions(options)
      } else {
        setSubCategoryOptions([])
      }
    }
  }, [selected.category])

  return (
    <>
      <CategorySelect
        control={control}
        disabled={disabled}
        categoryOptions={categoryOptions}
        onCategoryChange={(categoryId: string) =>
          setSelect({ ...selected, category: categoryId })
        }
        name={name.category}
      />
      {withSubCategory &&
        selected.category &&
        subCategoryOptions.length > 0 && (
          <SubCategorySelect
            control={control}
            disabled={disabled || !selected.category}
            subCategoryOptions={subCategoryOptions}
            onSubCategoryChange={(subCategoryId: string) => {}}
            name={name.subCategory}
          />
        )}
    </>
  )
}

export default SelectCategory
