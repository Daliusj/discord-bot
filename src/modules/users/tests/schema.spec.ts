import { Users } from '@/database'
import { parse, parseInsertable, parseName, parseUpdatable } from '../schema'
import { fakeUserFull } from './utils'

it('parses a valid record', () => {
  const record = fakeUserFull() as unknown as Users
  expect(parse(record)).toEqual(record)
})

it('throws an error due to empty name', () => {
  const userWithEmptyName = fakeUserFull({
    name: '',
  }) as unknown as Users
  expect(() => parse(userWithEmptyName)).toThrow(/name/i)
})

describe('parseInsertable', () => {
  it('omits id', () => {
    const parsed = parseInsertable(fakeUserFull())
    expect(parsed).not.toHaveProperty('id')
  })
})

describe('parseUpdateable', () => {
  it('omits id', () => {
    const parsed = parseUpdatable(fakeUserFull())
    expect(parsed).not.toHaveProperty('id')
  })
})

describe('parseName', () => {
  it('parses a valid record', () => {
    const name = 'tester'
    expect(parseName(name)).toEqual(name)
  })
  it('parses a valid record and returns name in all lower cases', () => {
    const name = 'Tester'
    expect(parseName(name)).toEqual(name.toLowerCase())
  })
  it('throws an erro with an empty name', async () => {
    const name = ''
    expect(() => parseName(name)).toThrow(/at least/i)
  })
})
