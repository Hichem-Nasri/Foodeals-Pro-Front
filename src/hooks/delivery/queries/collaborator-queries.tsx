import { WorkScheduleType } from '@/app/[locale]/delivery/collaborateur/components/AddNewCollabISchema'
import { Name, Roles } from '@/types/GlobalType'
import { createQueryFn } from '@/utils/createQueryFn'
import { useQuery } from '@tanstack/react-query'

type CollaboratorResT = {
    id: number
    avatarPath: string | null
    civility: string | null
    name: Name
    nationality: string | null
    cin: string | null
    role: {
        id: string
        name: Roles
        authorities: any[] // Adjust `any` if you have a specific type for authorities
    }
    email: string
    phone: string
    rayon: string | null
    managerId: number | null
    managerName: Name | null
    solutions: { id: string; name: string }[] // Adjust `any` if you have a specific type for solutions
    address: any
    workSchedules: WorkScheduleType[] // Adjust `any` if you have a specific type for workSchedules
    status: string
}

const shapeCollabsArr = (
    u: Pick<
        CollaboratorResT,
        'id' | 'avatarPath' | 'name' | 'phone' | 'email' | 'role'
    >
) => ({
    id: u.id,
    email: u.email,
    name: u.name,
    phone: u.phone,
    avatarPath: u.avatarPath,
    role: u.role.name,
})
// as GetCollabsT

const useGetAllCollaborators = () => {
    return useQuery({
        queryKey: ['all-collaborators'],
        queryFn: createQueryFn<{ content: CollaboratorResT[] }>(
            `/users/collaborators`
        ),
        select: ({ content }) => [
            {
                category: 'Administrative',
                members: content
                    .filter((u) => u.role.name !== Roles.DELIVERY_MAN)
                    .map(shapeCollabsArr),
            },
            {
                category: 'Livreur',
                members: content
                    .filter((u) => u.role.name === Roles.DELIVERY_MAN)
                    .map(shapeCollabsArr),
            },
        ],
    })
}

const useGetCollaboratorById = (id: string) =>
    useQuery({
        queryKey: ['get-collab-by-id', { id }],
        queryFn: createQueryFn<CollaboratorResT>(`/users/${id}`),
    })

export const collaboratorQueries = {
    useGetAllCollaborators,
    useGetCollaboratorById,
}
