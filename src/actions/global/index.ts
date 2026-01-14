'use server'

import api from '@/utils/api'
import { capitalize } from '@/utils/utils'

export async function getCountry() {
    const res = await api
        .get('/countries/all')
        .then((res) => res.data)
        .catch((err) => {
            console.error(err)
            return []
        })

    return res.map((country: any) => ({
        key: country.id,
        label: country.name,
        id: country.id,
    }))
}

export async function getRoles() {
    try {
        const res = await api.get(
            '/roles/allExcludingAdminAndSuperAdminAndClient'
        )
        if (res.status !== 200) {
            throw new Error('error fetching roles')
        }
        return res.data.map((role: any) => ({
            key: role.id,
            label: capitalize(role.name.replace(/_/g, ' ')),
            id: role.id,
        }))
    } catch (error) {
        console.error('error fetching roles: ', error)
        return []
    }
}

// {
// 	"id": "30255929-d678-45ed-b75b-e8faa26de25e",
// 	"name": "Casablanca",
// 	"code": "20235",
// 	"state": {
// 		"id": "b9fd56d9-89cd-4eb9-a2a0-90818d8cc3bc",
// 		"name": "Casablanca-Settat",
// 		"code": "102436",
// 		"country": {
// 			"id": "875cfee7-fc6b-4a7c-aa05-5e26d25699d1",
// 			"name": "Morocco",
// 			"code": "202410"
// 		}
// 	},
// 	"regionsResponse": [
// 		{
// 			"id": "b51ed608-1fa4-4828-b275-5d459583ba9b",
// 			"name": "maarif"
// 		}
// 	]
// }

export async function getCities() {
    const res = await api
        .get('/cities/all')
        .then((res) => res.data)
        .catch((err) => {
            console.error('Error fetching cities')
            return []
        })
    return res
}
