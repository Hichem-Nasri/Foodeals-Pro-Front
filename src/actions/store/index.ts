'use server'

import { appApi } from '@/lib/routes'
import { StoreSchema, StoreType } from '@/schemas/gestion/store-schema'
import { StoreRes } from '@/types/GlobalType'
import { StoresType } from '@/types/store-type'
import api from '@/utils/api'
import { getUriData } from '@/utils/utils'
import { z } from 'zod'

export async function createStore(
  id: string,
  data: z.infer<typeof StoreSchema>
) {
  const formData = new FormData()
  // remover status from data
  const { avatarPath, coverPath, ...rest } = data
  const blob = new Blob([JSON.stringify(rest)], {
    type: 'application/json',
  })

  formData.append('subEntity', blob)
  formData.append('profilImage', avatarPath || '')
  formData.append('coverImage', coverPath || '')
  const url = id ? appApi.storesDetails.replace(':id', id) : appApi.stores
  const method = id ? 'put' : 'post'

  const response = await api[method](url, formData).catch((err) => {
    console.error(err)
    return { status: 500, data: null }
  })
  return response
}

export async function getUser(name: string, role: string) {
  const url =
    name.length || role.length
      ? appApi.userNameAndRole.replace(':name', name).replace(':role', role) +
        `&page=0&size=10&sort=name,asc`
      : appApi.AvailableManager

  const response = await api
    .get(url)
    .then((res) => {
      return res.data
    })
    .catch((err) => {
      console.error(err)
      return { status: 500, data: null }
    })
  return { status: 200, data: response }
}

export async function getStore(id: string) {
  try {
    if (id === 'new') {
      return {
        status: 200,
        data: {
          name: '',
          activiteNames: [],
          avatarPath: '',
          coverPath: '',
          managerId: '',
          exactAdresse: '',
          cityId: '',
          countryId: '',
          regionId: '',
          iFrame: '',
          solutionNames: [],
          phone: '',
          email: '',
          status: 'IN_ACTIVE',
        },
      }
    }

    const response = await api.get(appApi.storesDetails.replace(':id', id))

    if (response.status === 200) {
      const res: StoreRes = response.data
      const data: StoreType = {
        name: res.name,
        activiteNames: res.activities.map((a) => a.name),
        avatarPath: res.avatarPath,
        coverPath: res.coverPath,
        managerId: res.manager.id + '',
        managerData: {
          id: res.manager.id + '',
          name: res.manager.name.firstName + ' ' + res.manager.name.lastName,
          phone: res.manager?.phone,
          email: res.manager?.email,
          avatarPath: res.manager?.avatarPath || '',
          role: res.manager?.role?.name || '',
        },
        exactAdresse: res.addressReponse.extraAddress,
        cityId: res.addressReponse.city.id,
        countryId: res.addressReponse.city.state.country?.id || '',
        regionId: res.addressReponse.city.regionsResponse[0].id || '',
        iFrame: res.iframe,
        solutionNames: res.solutions.map((a) => a.name),
        phone: res.phone,
        email: res.email,
        status: res.status as 'ACTIVE' | 'IN_ACTIVE',
      }
      return { status: 200, data }
    }

    return response
  } catch (err) {
    console.error(err)
    return { status: 500, data: null }
  }
}

export async function getAllStores(
  filterData: any,
  state: string,
  currentPage: number,
  pageSize: number
) {
  try {
    let url = ''
    const queryFilter = getUriData(filterData)
    if (queryFilter) {
      url =
        appApi.stores +
        `/filter?${queryFilter}&size=${pageSize}&page=${currentPage}`
    } else {
      let myState = ''
      switch (state) {
        case 'desactive':
          myState = 'INACTIVE'
          break
        case 'archive':
          myState = 'ARCHIVED'
          break
        default:
          myState = 'ACTIVE'
          break
      }
      url =
        appApi.storesState.replace(':state', myState) +
        '?page=' +
        currentPage +
        '&size=' +
        pageSize
    }
    // const queryParams = Object.entries(filterData)
    //     .filter(([_, value]) => value !== undefined && value !== '')
    //     .map(
    //         ([key, value]) =>
    //             `${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`
    //     )
    //     .join('&')
    //

    const res = await api.get(url).catch((err) => {
      console.error(err)
      return { status: 500, data: [] }
    })
    return {
      status: 200,
      data: res.data,
    }
  } catch (error) {
    return { status: 500, data: [] }
  }
}
