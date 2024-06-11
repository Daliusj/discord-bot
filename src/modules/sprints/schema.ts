import { z } from 'zod'
import type { Sprints } from '@/database'

type Record = Sprints
type Partial = Omit<Sprints, 'id'>

const schema = z.object({
  id: z.coerce.number().int().positive(),
  sprintsCode: z.string().min(1).max(50),
  title: z.string().min(1).max(500),
})

const insertable = schema.omit({
  id: true,
})

const updateable = insertable.partial()
const selectable = insertable.partial()

export const parse = (record: Record) => schema.parse(record)
export const parseId = (id: unknown) => schema.shape.id.parse(id)
export const parseSprintsCode = (sprintsCode: unknown) =>
  schema.shape.sprintsCode.parse(sprintsCode).toUpperCase()
export const parseInsertable = (record: unknown) => insertable.parse(record)
export const parseUpdatable = (record: unknown) => updateable.parse(record)

export const keys: (keyof Record)[] = Object.keys(
  schema.shape
) as (keyof z.infer<typeof schema>)[]

export const keysForMerging: (keyof Partial)[] = Object.keys(
  selectable.shape
) as (keyof z.infer<typeof selectable>)[]
