import { Messages } from '@/database'
import { parse, parseInsertable, parseUpdatable } from '../schema'
import { fakeMessageFull } from './utils'

it('parses a valid record', () => {
  const record = fakeMessageFull() as unknown as Messages
  expect(parse(record)).toEqual(record)
})

it('throws an error due to empty userId', () => {
  const messageWithEmptyUserId = fakeMessageFull({
    userId: 0,
  }) as unknown as Messages
  expect(() => parse(messageWithEmptyUserId)).toThrow(/userId/i)
})

it('throws an error due to empty gifId', () => {
  const messageWithEmptygifId = fakeMessageFull({
    gifId: 0,
  }) as unknown as Messages
  expect(() => parse(messageWithEmptygifId)).toThrow(/gifId/i)
})

it('throws an error due to empty sprintId', () => {
  const messageWithEmptySprintId = fakeMessageFull({
    sprintId: 0,
  }) as unknown as Messages
  expect(() => parse(messageWithEmptySprintId)).toThrow(/sprintId/i)
})

it('throws an error due to empty templateId', () => {
  const messageWithEmptytemplateId = fakeMessageFull({
    templateId: 0,
  }) as unknown as Messages
  expect(() => parse(messageWithEmptytemplateId)).toThrow(/templateId/i)
})

it('throws an error due to empty timeStamp', () => {
  const messageWithEmptyTimeStamp = fakeMessageFull({
    timeStamp: '',
  }) as unknown as Messages
  expect(() => parse(messageWithEmptyTimeStamp)).toThrow(/timeStamp/i)
})

describe('parseInsertable', () => {
  it('omits id and timeStamp', () => {
    const parsed = parseInsertable(fakeMessageFull())
    expect(parsed).not.toHaveProperty('id')
    expect(parsed).not.toHaveProperty('timeStamp')
  })
})

describe('parseUpdateable', () => {
  it('omits id and timeStamp', () => {
    const parsed = parseUpdatable(fakeMessageFull())
    expect(parsed).not.toHaveProperty('id')
    expect(parsed).not.toHaveProperty('timeStamp')
  })
})
