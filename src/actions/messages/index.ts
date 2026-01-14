'use server'

import api from '@/utils/api'
import { sub } from 'date-fns'

export async function getMessages(
  currentPage: number,
  pageSize: number,
  status: string
) {
  try {
    const url = `/notifications${status == 'READ' ? '/status/READ' : status == 'UNREAD' ? '/status/UNREAD' : ''}?pageNum=${currentPage}&pageSize=${pageSize}`

    const res = await api.get(url).catch((err) => {
      throw new Error('Error fetching messages')
    })
    if (res.status !== 200) throw new Error('Error fetching messages')
    return { status: 200, data: res.data }
  } catch (error) {
    console.error('error fetching: ', error)
    return { status: 500, data: null }
  }
}
// {
//     "id": "09ce68b2-cf9a-4a92-92d0-aa464b1b2731",
//     "title": "asdfdsfafd",
//     "content": "adsfasdf",
//     "attachementPath": "photos/WhatsApp Image 2024-11-08 at 15.48.39_797e330c.jpg",
//     "sender": {
//         "id": 7,
//         "avatarPath": "Screenshot 2024-12-24 202739.png",
//         "civility": null,
//         "name": {
//             "firstName": "Yassine",
//             "lastName": "Ben Taleb"
//         },
//         "nationality": null,
//         "cin": null,
//         "role": {
//             "id": "df0a44e4-5b72-400f-b718-ed7f9b82bbbe",
//             "name": "MANAGER",
//             "authorities": []
//         },
//         "email": "yassine.bentaleb@example.com",
//         "phone": "061",
//         "rayon": null,
//         "managerId": null,
//         "managerName": null,
//         "solutions": [],
//         "address": null,
//         "workSchedules": null,
//         "status": "ACTIVE"
//     },
//     "creationDate": "2024-12-26T10:53:54.627+00:00",
//     "typeRequest": "PARTENER",
//     "status": "READ",
//     "subentityId": "2ab0972f-ac39-43f7-b3ed-852ce23c2082"
// }
export async function getMessage(id: string) {
  if (!id || !id.length) return { status: 500, data: null }
  if (id === 'new')
    return {
      status: 200,
      data: {
        title: '',
        content: '',
        typeRequest: '',
        attachment: null,
        subEntityId: '',
      },
    }
  try {
    const url = `/notifications/${id}`

    const res = await api.get(url).catch((err) => {
      throw new Error('Error fetching messages')
    })
    if (res.status !== 200) throw new Error('Error fetching messages')
    const data = res.data
    return {
      title: data.title,
      content: data.content,
      typeRequest: data.typeRequest == 'PARTENER' ? '2' : '1',
      attachment: data.attachementPath,
      subEntityId: data.subentityId,
    }
  } catch (error) {
    console.error('error fetching: ', error)
    return { status: 500, data: null }
  }
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.
  // return res.json();
}

// {
//     "id": "5349da98-5601-4d7e-8bf3-ba36234320ee",
//     "title": "asdfsfsfsfsff",
//     "content": "asfsfffd",
//     "sender": {
//         "id": 7,
//         "avatarPath": null,
//         "civility": null,
//         "name": {
//             "firstName": "Yassine",
//             "lastName": "Ben Taleb"
//         },
//         "nationality": null,
//         "cin": null,
//         "role": {
//             "id": "4e166d4c-a0ff-451e-bb5a-32c3a17ada2c",
//             "name": "MANAGER",
//             "authorities": []
//         },
//         "email": "yassine.bentaleb@example.com",
//         "phone": "061",
//         "rayon": null,
//         "managerId": null,
//         "managerName": null,
//         "solutions": [],
//         "address": null,
//         "workSchedules": null,
//         "status": "ACTIVE"
//     },
//     "creationDate": "2024-12-13T23:27:49.056+00:00",
//     "typeRequest": null,
//     "status": "READ"
// }
