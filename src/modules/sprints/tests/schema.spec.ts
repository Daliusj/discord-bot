import { Sprints } from '@/database'
import {
  parse,
  parseInsertable,
  parseSprintsCode,
  parseUpdatable,
} from '../schema'
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

describe('parseSprintsCode', () => {
  it('parses a valid record', () => {
    const code = 'WD-1.1'
    expect(parseSprintsCode(code)).toEqual(code)
  })
  it('parses a valid record and returns sprints code in all upper cases', () => {
    const code = 'wd-1.1'
    expect(parseSprintsCode(code)).toEqual(code.toUpperCase())
  })
  it('throws an error with an empty sprints code', async () => {
    const code = ''
    expect(() => parseSprintsCode(code)).toThrow(/at least/i)
  })
})
