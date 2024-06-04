import { Sprints } from '@/database'
import { parse, parseInsertable, parseUpdatable } from '../schema'
import { fakeSprintFull } from './utils'

it('parses a valid record', () => {
  const record = fakeSprintFull() as unknown as Sprints
  expect(parse(record)).toEqual(record)
})

it('throws an error due to empty sprintsCode', () => {
  const sprintWithEmptySprintsCode = fakeSprintFull({
    sprintsCode: '',
  }) as unknown as Sprints
  expect(() => parse(sprintWithEmptySprintsCode)).toThrow(/sprintsCode/i)
})

it('throws an error due to empty title', () => {
  const sprintWithEmptyTitle = fakeSprintFull({
    title: '',
  }) as unknown as Sprints
  expect(() => parse(sprintWithEmptyTitle)).toThrow(/title/i)
})

describe('parseInsertable', () => {
  it('omits id', () => {
    const parsed = parseInsertable(fakeSprintFull())
    expect(parsed).not.toHaveProperty('id')
  })
})

describe('parseUpdateable', () => {
  it('omits id', () => {
    const parsed = parseUpdatable(fakeSprintFull())
    expect(parsed).not.toHaveProperty('id')
  })
})
