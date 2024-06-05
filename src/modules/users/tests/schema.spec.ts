import { Users } from '@/database'
import { parse, parseInsertable, parseUpdatable } from '../schema'
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
