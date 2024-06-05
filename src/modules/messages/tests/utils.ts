import { expect } from 'vitest'
import type { Insertable } from 'kysely'
import type { Messages } from '@/database'

export const fakeMessage = (
  overrides: Partial<Insertable<Messages>> = {}
): Insertable<Messages> => ({
  userId: 1,
  sprintId: 1,
  templateId: 1,
  gifId: 1,
  ...overrides,
})

export const messageMatcher = (
  overrides: Partial<Insertable<Messages>> = {}
) => ({
  id: expect.any(Number),
  timeStamp: expect.any(String),
  ...overrides,
  ...fakeMessage(overrides),
})

export const fakeMessageFull = (
  overrides: Partial<Insertable<Messages>> = {}
) => ({
  id: 1,
  timeStamp: '2024-06-04 12:34:56',
  ...fakeMessage(overrides),
})
