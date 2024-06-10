import { expect } from 'vitest'
import type { Insertable } from 'kysely'
import type { Messages } from '@/database'
import type { Giphy } from '@/modules/giphyApi'
import { Discord } from '@/modules/discord'
import type { RowSelect as MessagePostResponseBody } from '@/joinedRepositories'
import type { PostBody } from '../schema'

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

export const fakeMessagePostBody = (overrides: Partial<PostBody> = {}) => ({
  name: 'Tester',
  sprintsCode: 'WD-1.1',
  ...overrides,
})

export const postResponseBodyMatcher = (
  overrides: Partial<MessagePostResponseBody> = {}
) => ({
  name: 'Tester',
  sprintsCode: 'WD-1.1',
  timeStamp: expect.any(String),
  title: expect.any(String),
  url: expect.any(String),
  text: expect.any(String),
  ...overrides,
})

export const buildMockGiphy = async (): Promise<Giphy> => ({
  getGifUrl: async () => 'https://test.giphy.com/media/asdf123/giphy.gif',
})

export const buildMockDiscord = async (): Promise<Discord> => ({
  sendMessage: async () => {},
})
