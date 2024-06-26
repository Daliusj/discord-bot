import { expect, vi } from 'vitest'
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
  name: 'tester',
  sprintsCode: 'WD-1.1',
  ...overrides,
})

export const postResponseBodyMatcher = (
  overrides: Partial<MessagePostResponseBody> = {}
) => ({
  name: 'tester',
  sprintsCode: 'WD-1.1',
  timeStamp: expect.any(String),
  title: expect.any(String),
  url: expect.any(String),
  text: expect.any(String),
  ...overrides,
})

export const buildMockGiphySuccess = async (): Promise<Giphy> => ({
  getGifUrl: vi
    .fn()
    .mockResolvedValue('https://test.giphy.com/media/asdf123/giphy.gif'),
})

export const buildMockGiphyFailure = async (): Promise<Giphy> => ({
  getGifUrl: vi.fn().mockRejectedValue(new Error('Giphy error')),
})

export const buildMockDiscordSuccess = async (): Promise<Discord> => ({
  sendMessage: vi.fn().mockResolvedValue(true),
})

export const buildMockDiscordFeilure = async (): Promise<Discord> => ({
  sendMessage: vi.fn().mockRejectedValue(new Error('Discord Error')),
})
