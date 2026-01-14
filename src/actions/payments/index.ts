'use server'

import { auth } from '@/auth'
import { appApi } from '@/lib/routes'
import api from '@/utils/api'

interface OperationsProps {
  id: string
  month: string
  year: string
  currentPage: number
  pageSize: number
}

export async function getPaymentCommission(
  id: string,
  year: string,
  month: string,
  currentPage: number,
  pageSize: number
): Promise<any> {
  try {
    const user = await auth()
    const organizationId =
      id === 'all' || !id
        ? user?.user.organizationId
        : id

    // Updated to match backend: /v1/payments/commissions/{organizationId}/year/{year}/month/{month}
    const url = `/payments/commissions/${organizationId}/year/${year}/month/${month}?page=${currentPage}&size=${pageSize}`

    const response = await api.get(url)
    console.log(
      'Payment commission response:',
      response.data
    )
    return response
  } catch (error) {
    console.error(
      'Payment commission error:'
    )
    return {
      status: 500,
      data: null,
      error: 'Internal server error',
    }
  }
}

export async function getPaymentCommissionMonth(
  currentPage: number,
  pageSize: number,
  id: string,
  date: string
): Promise<any> {
  try {
    const [year, month] =
      date.split('-')

    // Updated to match backend: /v1/payments/commissions/{organizationId}/operations/year/{year}/month/{month}
    const url = `/payments/commissions/${id}/operations/year/${year}/month/${month}?page=${currentPage}&size=${pageSize}`

    const response = await api
      .get(url)
      .catch((error) => {
        console.error(
          'Commission month fetch error:',
          error
        )
        return {
          status:
            error.response?.status ||
            500,
          data: null,
          error:
            error.response?.data
              ?.error || error.message,
        }
      })
    return response
  } catch (error) {
    console.error(
      'Commission month error:',
      error
    )
    return {
      status: 500,
      data: null,
      error: 'Internal server error',
    }
  }
}

export async function getSubscriptions(
  currentPage: number,
  pageSize: number,
  status?: string
): Promise<any> {
  try {
    // Updated to match backend: /v1/subscriptions
    let url = `/subscriptions?page=${currentPage}&size=${pageSize}`
    if (status) {
      url += `&status=${status}`
    }

    const response = await api.get(url)
    console.log(
      '++++++++++++Subscriptions response:',
      response.status
    )
    return response
  } catch (error) {
    console.error(
      'Subscriptions error:',
      error
    )
    return {
      status: 500,
      data: null,
      error: 'Internal server error',
    }
  }
}

export async function getSubscriptionById(
  subscriptionId: string
): Promise<any> {
  try {
    // Updated to match backend: /v1/subscriptions/{id}
    const url = `/subscriptions/${subscriptionId}`

    const response = await api
      .get(url)
      .catch((error) => {
        console.error(
          'Subscription by ID fetch error:',
          error
        )
        return {
          status:
            error.response?.status ||
            500,
          data: null,
          error:
            error.response?.data
              ?.error || error.message,
        }
      })
    return response
  } catch (error) {
    console.error(
      'Subscription by ID error:',
      error
    )
    return {
      status: 500,
      data: null,
      error: 'Internal server error',
    }
  }
}

export async function getCommissionById(
  commissionId: string
): Promise<any> {
  try {
    // Fetch commission details by ID
    const url = `/payments/commissions/${commissionId}`

    const response = await api
      .get(url)
      .catch((error) => {
        console.error(
          'Commission by ID fetch error:',
          error
        )
        return {
          status:
            error.response?.status ||
            500,
          data: null,
          error:
            error.response?.data
              ?.error || error.message,
        }
      })
    return response
  } catch (error) {
    console.error(
      'Commission by ID error:',
      error
    )
    return {
      status: 500,
      data: null,
      error: 'Internal server error',
    }
  }
}

export async function getPaymentStatistics(): Promise<any> {
  try {
    // Fetch payment statistics
    const url = `/payments/statistics`

    const response = await api
      .get(url)
      .catch((error) => {
        console.error(
          'Payment statistics fetch error:',
          error
        )
        return {
          status:
            error.response?.status ||
            500,
          data: null,
          error:
            error.response?.data
              ?.error || error.message,
        }
      })
    return response
  } catch (error) {
    console.error(
      'Payment statistics error:',
      error
    )
    return {
      status: 500,
      data: null,
      error: 'Internal server error',
    }
  }
}
