import { z } from 'zod'
import type { Users } from '@/database'

type Record = Users
type Partial = Omit<Users, 'id'>

const schema = z.object({
  id: z.coerce.number().int().positive(),
  name: z.string().min(1).max(50),
})

const insertable = schema.omit({
  id: true,
})
const updateable = insertable.partial()
const selectable = insertable.partial()

export const parse = (record: Record) => schema.parse(record)
export const parseId = (id: unknown) => schema.shape.id.parse(id)
export const parseName = (name: unknown) => {
  const parsedName = schema.shape.name.parse(name)
  return parsedName.split(/[_\s]/).join(' ').toLowerCase()
}
export const parseInsertable = (record: unknown) => insertable.parse(record)
export const parseUpdatable = (record: unknown) => updateable.parse(record)

export const keys: (keyof Record)[] = Object.keys(
  schema.shape
) as (keyof z.infer<typeof schema>)[]

export const keysForMerging: (keyof Partial)[] = Object.keys(
  selectable.shape
) as (keyof z.infer<typeof selectable>)[]
