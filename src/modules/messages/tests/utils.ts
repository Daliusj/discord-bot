import { expect } from 'vitest'
import type { Insertable } from 'kysely'
import type { Messages, Sprints, Users, Gifs, Templates } from '@/database'

export const fakeMessage = (
  overrides: Partial<Insertable<Messages>> = {}
): Insertable<Messages> => ({
  userId: 1,
  sprintId: 1,
  templateId: 1,
  gifId: 1,
  ...overrides,
})

export const fakeSprint = (
  overrides: Partial<Insertable<Sprints>> = {}
): Insertable<Sprints> => ({
  sprintsCode: 'WD-1.1',
  title: 'Test Sprint',
  ...overrides,
})

export const fakeUser = (
  overrides: Partial<Insertable<Users>> = {}
): Insertable<Users> => ({
  name: 'Tester',
  ...overrides,
})
export const fakeTemplate = (
  overrides: Partial<Insertable<Templates>> = {}
): Insertable<Templates> => ({
  text: 'test text',
  ...overrides,
})
export const fakeGif = (
  overrides: Partial<Insertable<Gifs>> = {}
): Insertable<Gifs> => ({
  url: 'test/test',
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
