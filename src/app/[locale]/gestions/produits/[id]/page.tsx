'use client'
import { Layout } from '@/components/layout/Layout'
import ProductDetails from '@/containers/gestions/Products/newProducts'
import { appApi } from '@/lib/routes'
import api from '@/utils/api'
import { useQuery } from '@tanstack/react-query'
import React, { FC } from 'react'

interface ProductsProps {
  params: Promise<{
    id: string
  }>
  searchParams: Promise<{
    mode: string
  }>
}

const ProductDetailsPage: FC<
  ProductsProps
> = ({ params, searchParams }) => {
  const { id } = React.use(params)
  const { mode } = React.use(
    searchParams
  )
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      try {
        if (!id || id === 'new') {
          return null
        }
        const response = await api
          .get(
            appApi.productsDetails.replace(
              ':id',
              id
            )
          )
          .catch((error) => {
            throw new Error('error')
          })
        if (response.status !== 200) {
          throw new Error('error')
        }

        return {
          ...response.data,
          title: response.data.name,
          imageUrl:
            'http://localhost:8080/photos/' +
            response.data.imageUrl,
          pickupConditions:
            response.data
              .pickupConditions,
        }
      } catch (error) {
        return null
      }
    },
  })
  return (
    <Layout formTitle='Ajouter un produit'>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <ProductDetails
          data={{
            product: data,
            isLoading,
            error,
            refetch,
          }}
          mode={mode}
          id={id == 'new' ? '' : id}
        />
      )}
    </Layout>
  )
}

export default ProductDetailsPage
