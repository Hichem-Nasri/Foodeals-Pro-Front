'use server'

import { appApi, AppRoutes } from '@/lib/routes'
import { FilterSchemaProduct } from '@/schemas/gestion/product-schema'
import api from '@/utils/api'
import { getUriData } from '@/utils/utils'
import { z } from 'zod'

export const getProducts = async (
  currentPage: number,
  pageSize: number,
  archive: boolean,
  filterData: z.infer<typeof FilterSchemaProduct> | null
) => {
  let url = ''
  if (filterData) {
    const queryFilter = getUriData(filterData)

    url =
      appApi.products +
      `/search?${queryFilter}&size=${pageSize}&page=${currentPage}&sort=name,asc`
  } else
    url =
      appApi.products +
      (archive ? '/deleted-products' : '') +
      '?pageNum=' +
      currentPage +
      '&pageSize=' +
      pageSize
  console.log('url: ', url)
  try {
    const response = await api.get(url)
    if (response.status !== 200) {
      throw new Error('error')
    }
    return {
      status: 200,
      data: {
        totalElements: response.data.totalElements,
        totalPages: response.data.totalPages,
        content: response.data.content,
      },
    }
  } catch (error) {
    return { status: 500, data: null }
  }
}

export const getProduct = async (id: string) => {
  try {
    if (!id || id === 'new') {
      return null
    }
    const response = await api
      .get(appApi.productsDetails.replace(':id', id))
      .catch((error) => {
        throw new Error('error')
      })
    if (response.status !== 200) {
      throw new Error('error')
    }

    return {
      ...response.data,
      title: response.data.name,
      imageUrl: 'http://localhost:8080/photos/' + response.data.imageUrl,
    }
  } catch (error) {
    return null
  }
}
