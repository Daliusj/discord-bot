import { Templates } from '@/database'
import { parse, parseInsertable, parseUpdatable } from '../schema'
import { fakeTemplateFull } from './utils'

it('parses a valid record', () => {
  const record = fakeTemplateFull() as unknown as Templates
  expect(parse(record)).toEqual(record)
})

it('throws an error due to empty text', () => {
  const templateWithEmptyText = fakeTemplateFull({
    text: '',
  }) as unknown as Templates
  expect(() => parse(templateWithEmptyText)).toThrow(/text/i)
})

describe('parseInsertable', () => {
  it('omits id', () => {
    const parsed = parseInsertable(fakeTemplateFull())
    expect(parsed).not.toHaveProperty('id')
  })
})

describe('parseUpdateable', () => {
  it('omits id', () => {
    const parsed = parseUpdatable(fakeTemplateFull())
    expect(parsed).not.toHaveProperty('id')
  })
})
