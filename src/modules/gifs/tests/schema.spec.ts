import { Gifs } from '@/database'
import { parse, parseInsertable, parseUpdatable } from '../schema'
import { fakeGifFull } from '../utils'

it('parses a valid record', () => {
  const record = fakeGifFull() as unknown as Gifs
  expect(parse(record)).toEqual(record)
})

it('throws an error due to empty url', () => {
  const userWithEmptyName = fakeGifFull({
    url: '',
  }) as unknown as Gifs
  expect(() => parse(userWithEmptyName)).toThrow(/url/i)
})

describe('parseInsertable', () => {
  it('omits id', () => {
    const parsed = parseInsertable(fakeGifFull())
    expect(parsed).not.toHaveProperty('id')
  })
})

describe('parseUpdateable', () => {
  it('omits id', () => {
    const parsed = parseUpdatable(fakeGifFull())
    expect(parsed).not.toHaveProperty('id')
  })
})
