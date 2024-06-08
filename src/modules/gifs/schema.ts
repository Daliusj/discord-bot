import { z } from 'zod'
import type { Gifs } from '@/database'

type Record = Gifs
type Partial = Omit<Gifs, 'id'>

const schema = z.object({
  id: z.coerce.number().int().positive(),
  url: z.string().url().min(5).max(100),
})

const insertable = schema.omit({
  id: true,
})
const updateable = insertable.partial()
const selectable = insertable.partial()

export const parse = (record: Record) => schema.parse(record)
export const parseId = (id: unknown) => schema.shape.id.parse(id)
export const parseInsertable = (record: unknown) => insertable.parse(record)
export const parseUpdatable = (record: unknown) => updateable.parse(record)

export const keys: (keyof Record)[] = Object.keys(
  schema.shape
) as (keyof z.infer<typeof schema>)[]

export const keysForMerging: (keyof Partial)[] = Object.keys(
  selectable.shape
) as (keyof z.infer<typeof selectable>)[]
