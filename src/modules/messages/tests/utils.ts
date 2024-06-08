import { expect } from 'vitest'
import type { Insertable } from 'kysely'
import type { Messages } from '@/database'
import type { Giphy } from '@/modules/giphyApi'
import { Discord } from '@/modules/discord'

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

export const initializeMockGiphy = async (): Promise<Giphy> => ({
  getGifUrl: async () => 'https://test.giphy.com/media/asdf123/giphy.gif',
})

export const initializedMockDiscord = async (): Promise<Discord> => ({
  sendMessage: async () => {},
})
