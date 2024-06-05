import { z } from 'zod'
import type { Templates } from '@/database'

type Record = Templates

const schema = z.object({
  id: z.coerce.number().int().positive(),
  text: z.string().min(1).max(500),
})

const insertable = schema.omit({
  id: true,
})
const updateable = insertable.partial()

export const parse = (record: Record) => schema.parse(record)
export const parseId = (id: unknown) => schema.shape.id.parse(id)
export const parseInsertable = (record: unknown) => insertable.parse(record)
export const parseUpdatable = (record: unknown) => updateable.parse(record)

export const keys: (keyof Record)[] = Object.keys(
  schema.shape
) as (keyof z.infer<typeof schema>)[]
