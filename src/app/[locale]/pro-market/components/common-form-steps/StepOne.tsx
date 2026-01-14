'use client'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { BoxNormalFormStepOneType } from './CommonFormSchema'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import TitleDevider from '@/components/utils/TitleDevider'
import { QuantitySelector } from '@/components/tools/QuantitySelector'
// import ImageUploadAndPreview from '../../../components/ImageUploadAndPreview'
import ImageUploadAndPreview from '../../offres/components/ImageUploadAndPreview'
import { capitalizeStr } from '@/utils/utils'
import { useOffersTranslations } from '@/hooks/useTranslations'

// Box normal step one
export function StepOne({
  offerImage,
  children,
  type = 'normal',
}: {
  offerImage?: string
  children?: React.ReactNode
  type?: 'normal' | 'surprise'
}) {
  const { control } = useFormContext<BoxNormalFormStepOneType>()
  const t = useOffersTranslations()

  return (
    <div className='flex flex-col gap-6'>
      {type === 'normal' && (
        <>
          <TitleDevider title={t('form.stepOne.photoProducts')} />

          <div className='flex flex-col gap-6 rounded-[30px] bg-white px-4 py-6'>
            <FormField
              control={control}
              name='image'
              render={({ field: { onChange, value, ...rest } }) => {
                return (
                  <ImageUploadAndPreview
                    value={value}
                    onChange={onChange}
                    defaultImage={offerImage}
                    {...rest}
                  />
                )
              }}
            />
          </div>
        </>
      )}

      <div className='flex px-4'>{children}</div>

      <TitleDevider title={t('form.stepOne.dealInformation')} />

      <div className='flex flex-col gap-6 rounded-[30px] bg-white px-4 py-6'>
        <FormField
          control={control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('form.stepOne.title')}</FormLabel>
              <FormControl>
                <Input
                  className='text-lynch-500'
                  placeholder={t('form.stepOne.titlePlaceholder')}
                  {...field}
                  ref={null}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name='publishAs'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-sm'>{t('form.stepOne.publishAs')}</FormLabel>
              <Select
                {...field}
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className='bg-lynch-50 text-lynch-500'>
                    <SelectValue
                      className='capitalize text-lynch-500'
                      placeholder={t('form.stepOne.publishAsPlaceholder')}
                    >
                      {capitalizeStr(field.value, '_')}
                    </SelectValue>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='Pâtisserie'>{t('form.categories.bakery')}</SelectItem>
                  <SelectItem value='Restaurant'>{t('form.categories.restaurant')}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {type === 'normal' && (
          <FormField
            control={control}
            name='categorie'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-sm'>{t('form.stepOne.category')}</FormLabel>
                <Select
                  {...field}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className='bg-lynch-50 text-lynch-500'>
                      <SelectValue
                        className='text-lynch-500'
                        placeholder={t('form.stepOne.categoryPlaceholder')}
                      >
                        {capitalizeStr(field.value, '_')}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='Categorie 1'>{t('form.categories.category1')}</SelectItem>
                    <SelectItem value='categorie 2'>{t('form.categories.category2')}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('form.stepOne.description')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('form.stepOne.descriptionPlaceholder')}
                  className='h-36 resize-none text-lynch-500 disabled:opacity-100'
                  {...field}
                  ref={null}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className='flex flex-col gap-6 rounded-[30px] bg-white px-4 py-6'>
        <FormField
          control={control}
          name='unitType'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-sm'>{t('form.stepOne.unitType')}</FormLabel>
              <Select
                {...field}
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className='bg-lynch-50 text-lynch-500'>
                    <SelectValue
                      className='text-lynch-500'
                      placeholder={t('form.stepOne.unitTypePlaceholder')}
                    >
                      {field.value}
                    </SelectValue>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='unite'>{t('form.units.unit')}</SelectItem>
                  <SelectItem value='unite 2'>{t('form.units.unit2')}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name='quantity'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <QuantitySelector
                  {...field}
                  label={t('form.stepOne.quantity')}
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
