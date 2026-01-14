import axios from 'axios'
import api from './api'
import { QueryFunction } from '@tanstack/react-query'

export const createQueryFn =
  <T>(
    endpoint: string,
    fn?: (data: any) => T,
    params?: Record<string, any>,
    passParams = false
  ): QueryFunction<T, [string, Record<string, any>?]> =>
  async ({ queryKey }) => {
    const [, additionalParams] = queryKey
    const passParamsObject = passParams ? additionalParams : undefined

    try {
      const response = await api.get<T>(endpoint, {
        params: {
          ...params,
          ...passParamsObject,
        },
      })

      return fn ? fn(response.data) : response.data
    } catch (error) {
      // You can customize error handling here
      if (axios.isAxiosError(error)) {
        // Handle specific Axios errors
        if (error.response?.status === 404) {
          throw new Error('Resource not found')
        }
        if (error.response?.status === 403) {
          throw new Error('Forbidden')
        }
      }

      throw error
    }
  }

/**
 * Create mutation function for POST/PUT requests
 */
export const createMutationFn =
  <TResponse, TVariables = void>(
    endpoint: string,
    method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'POST'
  ) =>
  async (variables: TVariables): Promise<TResponse> => {
    try {
      const response = await api.request<TResponse>({
        url: endpoint,
        method,
        data: variables,
      })

      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error('Resource not found')
        }
        if (error.response?.status === 400) {
          throw new Error(error.response?.data?.message || 'Bad request')
        }
        if (error.response?.status === 403) {
          throw new Error('Forbidden')
        }
      }
      throw error
    }
  }
