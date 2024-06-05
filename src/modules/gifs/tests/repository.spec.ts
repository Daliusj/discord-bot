import createTestDatabase from '@tests/utils/createTestDatabase'
import { selectAllFor, createFor } from '@tests/utils/records'
import buildRepository from '../repository'
import { fakeGif, gifMatcher } from './utils'

const db = await createTestDatabase()
const repository = buildRepository(db)
const selectAllRecords = selectAllFor(db, 'gifs')
const createForGifs = createFor(db, 'gifs')

afterAll(() => db.destroy())

afterEach(async () => {
  await db.deleteFrom('gifs').execute()
})

describe('Create', () => {
  it('should create a gif record', async () => {
    const record = await repository.createNew(fakeGif())
    expect(record).toEqual(gifMatcher())
    const allRecords = await selectAllRecords()
    expect(allRecords).toHaveLength(1)
    expect(allRecords).toEqual([gifMatcher()])
  })
})

describe('findAll', () => {
  it('should return all gifs', async () => {
    createForGifs([
      fakeGif(),
      fakeGif({
        url: 'https://testurl.test2.com/gif',
      }),
    ])
    const allRecords = await repository.findAll()
    expect(allRecords).toHaveLength(2)
    expect(allRecords[0]).toEqual(gifMatcher())
    expect(allRecords[1]).toEqual(
      gifMatcher({
        url: 'https://testurl.test2.com/gif',
      })
    )
  })
})

describe('findById', () => {
  it('should return the gif with the specified id', async () => {
    const [gif] = await createForGifs(
      fakeGif({
        id: 1234,
      })
    )
    const record = await repository.findById(gif!.id)
    expect(record).toEqual(gifMatcher())
  })

  it('should return undifined if specified id does not exist', async () => {
    const record = await repository.findById(10)
    expect(record).toBeUndefined()
  })
})

describe('Update', () => {
  it('should return updated record and update the record with the specifie id', async () => {
    const [gif] = await createForGifs(fakeGif())
    const record = await repository.update(gif.id, {
      url: 'https://testurl.newtesturl.com/gif',
    })
    expect(record).toMatchObject(
      gifMatcher({ url: 'https://testurl.newtesturl.com/gif' })
    )
  })

  it('should return the original gif record if no changes are made', async () => {
    const [gif] = await createForGifs(fakeGif())
    const record = await repository.update(gif.id, {})
    expect(record).toMatchObject(gifMatcher())
  })

  it('should return undefined if record is not found', async () => {
    const record = await repository.update(999, fakeGif())
    expect(record).toBeUndefined()
  })
})

describe('Delete', () => {
  it('Should delete the record with the specified id and return the deleted record', async () => {
    const [gif] = await createForGifs(fakeGif())
    const record = await repository.delete(gif.id)
    expect(record).toEqual(gifMatcher())
  })
  it('should return undefined if the record with the specified id does not exist', async () => {
    const record = await repository.delete(999)
    expect(record).toBeUndefined()
  })
})
