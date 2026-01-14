import { Name, Roles } from '@/types/GlobalType'
import { createQueryFn } from '@/utils/createQueryFn'
import { useQueries, useQuery } from '@tanstack/react-query'

// export const useGetSolutions = () => useQuery()

type RegionType = { id: string; name: string }
type CityType = { id: string; name: string; regionsResponse: RegionType[] }
type SolutionType = { id: string; name: string }
type RoleType = { id: string; name: Roles }
type ManagersType = { id: string; name: Name; avatarPath?: string }
export const collabFormQueries = (enabled: boolean) =>
    useQueries({
        queries: [
            {
                queryKey: ['cities'],
                queryFn: createQueryFn<CityType[]>('/cities'),
                enabled,
            },

            {
                queryKey: ['roles'],
                queryFn: createQueryFn<RoleType[]>(
                    '/roles/allExcludingAdminAndSuperAdminAndClient'
                ),
                enabled,
            },

            {
                queryKey: ['solutions'],
                queryFn: createQueryFn<SolutionType[]>('/solutions'),
                enabled,
            },

            {
                queryKey: ['managers'],
                queryFn: createQueryFn<ManagersType[]>('/users/managers'),
                enabled,
                select: (data: ManagersType[]) => {
                    return data.map((u) => ({
                        value: u.id.toString(),
                        label: `${u.name.firstName} ${u.name.lastName}`,
                        image: u.avatarPath,
                    }))
                },
            },
        ],
    })
