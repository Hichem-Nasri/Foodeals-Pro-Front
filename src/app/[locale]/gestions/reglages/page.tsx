import { getProduct } from '@/actions/product'
import { Layout } from '@/components/layout/Layout'
import SettingsProduct from '@/containers/gestions/settings'
import { getTranslations } from '@/i18n/config'
import React, { FC } from 'react'

interface SettingProductProps {
  params: Promise<{
    id: string
    locale: string
  }>
  searchParams: Promise<{
    product: string
  }>
}

const SettingsProductPage: FC<
  SettingProductProps
> = async ({
  params,
  searchParams,
}) => {
  const { id, locale } = await params
  const { product: productId } =
    await searchParams
  const product =
    await getProduct(productId)
  const { t } = await getTranslations(locale)
  
  return (
    <Layout formTitle={t('settings.title')}>
      <SettingsProduct
        id={id}
        product={product}
        condition={
          product?.pickupConditions
        }
      />
    </Layout>
  )
}

export default SettingsProductPage
