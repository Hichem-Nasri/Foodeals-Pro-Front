'use server'

import { ProfileType } from '@/schemas/gestion/profile-schema'
import {
  CollaboratorDetailsType,
  defaultCollaboratorDetails,
} from '@/schemas/user-schema'
import api from '@/utils/api'
import { capitalize, getUriData } from '@/utils/utils'
import { daysToWeeks } from 'date-fns'

// {
//     "id": 13,
//     "avatarPath": "✰.jpeg",
//     "civility": null,
//     "name": {
//         "firstName": "Aymane ",
//         "lastName": "Aggoujjil"
//     },
//     "nationality": null,
//     "cin": "N123123",
//     "role": {
//         "id": "f3739e69-8608-4059-b170-5b49e48e3529",
//         "name": "MANAGER",
//         "authorities": []
//     },
//     "email": "test@gmail.com",
//     "phone": "123123123",
//     "rayon": null,
//     "managerId": null,
//     "managerName": null,
//     "solutions": [
//         {
//             "id": "6b42c725-382f-4a33-abea-50a787a3d63b",
//             "name": "pro_market"
//         },
//         {
//             "id": "4357b1fe-62e7-40a7-a2b6-5d61ef29d825",
//             "name": "pro_donate"
//         }
//     ],
//     "address": {
//         "id": "b3799b3a-b6a2-47f0-8727-972ee5ae7b0a",
//         "address": "test test",
//         "extraAddress": null,
//         "zip": null,
//         "city": {
//             "id": "82eeb6db-b962-40ca-8ad1-308ac5834b2c",
//             "name": "Casablanca",
//             "code": "20235",
//             "state": {
//                 "id": "116569a1-a65c-4d25-8025-3d776f182a07",
//                 "name": "Casablanca-Settat",
//                 "code": "102436",
//                 "country": {
//                     "id": "39d04807-150e-4fc7-84b4-e099b7eb283f",
//                     "name": "Morocco",
//                     "code": "202410"
//                 }
//             },
//             "regionsResponse": [
//                 {
//                     "id": "67efe452-eaad-4380-af9c-67dceea6f433",
//                     "name": "maarif"
//                 }
//             ]
//         }
//     },
//     "workSchedules": null
// }
const emptyWorkingHours = {
  selected: false,
  dayOfWeek: 'Monday',
  morningStart: '08h',
  morningEnd: '12h',
  afternoonStart: '14h',
  afternoonEnd: '18h',
}

const days = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

export const getDataUser = async (id: string) => {
  if (!id || id === 'new') {
    return defaultCollaboratorDetails
  }
  const workingHours: { [key: string]: any } = {
    Monday: {
      ...defaultCollaboratorDetails.workingHours.Monday,
      selected: false,
    },
    Tuesday: {
      ...defaultCollaboratorDetails.workingHours.Tuesday,
      selected: false,
    },
    Wednesday: {
      ...defaultCollaboratorDetails.workingHours.Wednesday,
      selected: false,
    },
    Thursday: {
      ...defaultCollaboratorDetails.workingHours.Thursday,
      selected: false,
    },
    Friday: {
      ...defaultCollaboratorDetails.workingHours.Friday,
      selected: false,
    },
    Saturday: {
      ...defaultCollaboratorDetails.workingHours.Saturday,
      selected: false,
    },
    Sunday: {
      ...defaultCollaboratorDetails.workingHours.Sunday,
      selected: false,
    },
  }

  // Map the workSchedules to the workingHours object

  const res = await api.get(`/users/${id}`).catch((err) => {
    // console.error(err)
    return null
  })
  if (res?.status !== 200) {
    return null
  }
  const data = {
    ...res.data,
  }
  data?.workSchedules?.forEach(
    (schedule: {
      dayOfWeek: string
      morningStart: any
      morningEnd: any
      afternoonStart: any
      afternoonEnd: any
    }) => {
      const dayOfWeek = capitalize(schedule.dayOfWeek) || '' // Convert to lowercase to match the keys
      if (workingHours[dayOfWeek]) {
        workingHours[dayOfWeek] = {
          selected: true,
          dayOfWeek: schedule.dayOfWeek,
          morningStart: schedule.morningStart,
          morningEnd: schedule.morningEnd,
          afternoonStart: schedule.afternoonStart,
          afternoonEnd: schedule.afternoonEnd,
        }
      }
    }
  )

  const collaborator: CollaboratorDetailsType = {
    ...data,
    managerId: data.managerId || '',
    civility: data.civility || '',
    nationality: data.nationality || '',
    rayon: data.rayon || '',
    solutionNames: data.solutions.map((s: any) => s.name),
    cityId: data?.address?.city.id,
    address: data?.address?.address,
    cin: data.cin || '',
    roleId: data.role.id,
    regionId: data?.address?.city?.regionsResponse[0].id,
    workingHours: workingHours,
  }

  return collaborator
}

export const getUsers = async (
  id: string,
  currentPage: number,
  pageSize: number,
  archive: boolean,
  filterData: any
) => {
  let url = ''
  const queryFilter = getUriData(filterData)
  if (queryFilter) {
    url = `/users/filter?${queryFilter}&size=${pageSize}&page=${currentPage}`
  } else
    url = archive
      ? '/users/archived-collaborators?'
      : id && id != 'account'
        ? `/users/collaborators?id=${id}&`
        : '/users/collaborators?'
  console.log('url: ', url)
  const data = await api
    .get(`${url}size=${pageSize}&page=${currentPage}`)
    .catch((err) => {
      // console.error(err)
      return { status: 500, data: null }
    })
  if (data.status !== 200) {
    return { status: 500, data: null }
  }
  //
  return {
    status: 200,
    data: data.data,
  }
}

export async function getProfile(id: string) {
  try {
    const res = await api.get('/users/infos-profil').catch((error) => {
      throw new Error('Error fetching profile')
    })
    if (res.status !== 200) {
      throw new Error('Error fetching profile. Status: ' + res.status)
    }
    const { data } = res
    return {
      id: data.id?.toString() || '',

      organization: {
        id: '',
        name: capitalize(data.partenerName),
        avatarPath: data.partenerAvatar,
      },
      avatar: data.avatarPath,
      role: capitalize(data.poste),
      email: data.email,
      phone: data.phone,
      name: data.name as ProfileType['name'],
      //   "managerName": null,
      // "managerAvatar": null,
      // "phoneManager": null,
      // "emailManager": null
      responsible: {
        name:
          data.poste === 'MANAGER'
            ? capitalize(data.name)
            : capitalize(data.managerName),
        avatarPath:
          data.poste === 'MANAGER' ? data.avatarPath : data.managerAvatar,
        email: data.poste === 'MANAGER' ? data.email : data.emailManager,
        phone: data.poste === 'MANAGER' ? data.phone : data.phoneManager,
      },
    } as ProfileType
  } catch (error) {
    console.error('Error fetching manager:', error)
    return null
  }
  return {
    id: '',
    name: {
      firstName: 'Aymane',
      lastName: 'Aggoujjil',
    },
    avatar: 'https://random.imagecdn.app/300/300',
    role: 'Manager',
    phone: '+212679324350',
    email: 'example@gmail.com',
    organization: {
      id: '',
      name: 'Microsoft',
      avatarPath: 'https://random.imagecdn.app/300/300',
    },
    responsible: {
      name: {
        firstName: 'Akashi',
        lastName: 'Uchiha',
      },
      avatarPath: 'https://random.imagecdn.app/300/300',
      email: 'example@gmail.com',
      phone: '+1236548987',
    },
    password: '123456789',
  }
  // const res = await api.get(`/users/${id}`).catch((err) => {
  //     // console.error(err)
  //     return null
  // })
  // if (res?.status !== 200) {
  //     return null
  // }
  // return res.data
}
