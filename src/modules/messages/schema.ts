import { z } from 'zod'
import type { Messages } from '@/database'

type Record = Messages
type Partial = Omit<Messages, 'id'>

const schema = z.object({
  id: z.coerce.number().int().positive(),
  userId: z.number().min(1).max(500),
  sprintId: z.number().min(1).max(500),
  templateId: z.number().min(1).max(500),
  gifId: z.number().min(1).max(500),
  timeStamp: z
    .string()
    .min(5)
    .regex(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/, 'Invalid timestamp format'),
})

const insertable = schema.omit({
  id: true,
  timeStamp: true,
})
const updateable = insertable.partial()
const selectable = schema.omit({
  id: true,
  userId: true,
  sprintId: true,
  templateId: true,
  gifId: true,
})

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
