import { z } from 'zod'
// localhost:8080/v1/subentity/filter?startDate=2024-01-01T00:00:00Z&endDate=2024-12-31T23:59:59Z&raisonSociale=CompanyX&managerId=123e4567-e89b-12d3-a456-426614174000&email=manager@example.com&phone=1234567890&cityId=987e6543-b21b-12d3-a456-426614174001&solutionId=765e4321-c34b-56d7-a123-1234567890ab&page=0&size=10

export const SchemaFilter = z.object({
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  raisonSociale: z.string().optional(),
  mangerId: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  cityId: z.string().optional(),
  solutions: z.array(z.string()).optional().default([]),
  //...
})

export const defaultSchemaFilter = {
  startDate: '',
  endDate: '',
  raisonSociale: '',
  mangerId: '',
  email: '',
  phone: '',
  cityId: '',
  solutions: [],
  //...
}

export const ArchiveSchema = z.object({
  motif: z.string().nonempty('Motif is required'),
  raison: z.string().nonempty('Raison is required'),
})

export const defaultArchiveSchema = {
  motif: '',
  raison: '',
}
