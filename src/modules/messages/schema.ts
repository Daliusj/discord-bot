import { z } from 'zod'
import type { Messages } from '@/database'

type Record = Messages

const schema = z.object({
  id: z.coerce.number().int().positive(),
  userId: z.number().min(1).max(500),
  sprintId: z.number().min(1).max(500),
  templateId: z.number().min(1).max(500),
  timeStamp: z.string().min(1),
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
