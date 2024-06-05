import { expect } from 'vitest'
import type { Insertable } from 'kysely'
import type { Gifs } from '@/database'

export const fakeGif = (
  overrides: Partial<Insertable<Gifs>> = {}
): Insertable<Gifs> => ({
  url: 'https://testurl.test.com/gif',
  ...overrides,
})

export const gifMatcher = (overrides: Partial<Insertable<Gifs>> = {}) => ({
  id: expect.any(Number),
  ...overrides,
  ...fakeGif(overrides),
})

export const fakeGifFull = (overrides: Partial<Insertable<Gifs>> = {}) => ({
  id: 1,
  ...fakeGif(overrides),
})
