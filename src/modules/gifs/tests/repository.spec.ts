import createTestDatabase from '@tests/utils/createTestDatabase'
import { selectAllFor, createFor } from '@tests/utils/records'
import buildRepository from '../repository'
import { fakeTemplate, templateMatcher } from './utils'

const db = await createTestDatabase()
const repository = buildRepository(db)
const selectAllRecords = selectAllFor(db, 'templates')
const createForTemplates = createFor(db, 'templates')

afterAll(() => db.destroy())

afterEach(async () => {
  await db.deleteFrom('templates').execute()
})

describe('Create', () => {
  it('should create a template record', async () => {
    const record = await repository.createNew(fakeTemplate())
    expect(record).toEqual(templateMatcher())
    const allRecords = await selectAllRecords()
    expect(allRecords).toHaveLength(1)
    expect(allRecords).toEqual([templateMatcher()])
  })
})

describe('findAll', () => {
  it('sould return all templates', async () => {
    createForTemplates([
      fakeTemplate({
        text: 'test text 1',
      }),
      fakeTemplate({
        text: 'test text 2',
      }),
    ])
    const allRecords = await repository.findAll()
    expect(allRecords).toHaveLength(2)
    expect(allRecords[0]).toEqual(
      templateMatcher({
        text: 'test text 1',
      })
    )
    expect(allRecords[1]).toEqual(
      templateMatcher({
        text: 'test text 2',
      })
    )
  })
})

describe('findById', () => {
  it('should return the template with the specified id', async () => {
    const [template] = await createForTemplates(
      fakeTemplate({
        id: 1234,
      })
    )
    const record = await repository.findById(template!.id)
    expect(record).toEqual(templateMatcher())
  })
  it('should return undifined if specified id does not exist', async () => {
    const record = await repository.findById(10)
    expect(record).toBeUndefined()
  })
})

describe('Update', () => {
  it('should return updated record and update the record with the specifie id', async () => {
    const [template] = await createForTemplates(fakeTemplate())
    const record = await repository.update(template.id, { text: 'updated' })
    expect(record).toMatchObject(templateMatcher({ text: 'updated' }))
  })
  it('should return the original template if no changes are made', async () => {
    const [template] = await createForTemplates(fakeTemplate())
    const record = await repository.update(template.id, {})
    expect(record).toMatchObject(templateMatcher())
  })
  it('should return undefined if record is not found', async () => {
    const template = await repository.update(999, fakeTemplate())
    expect(template).toBeUndefined()
  })
})

describe('Delete', () => {
  it('Should delete the record with the specified id and return the deleted record', async () => {
    const [template] = await createForTemplates(fakeTemplate())
    const record = await repository.delete(template.id)
    expect(record).toEqual(templateMatcher())
  })
  it('should return undefined if the record with the specified id does not exist', async () => {
    const record = await repository.delete(999)
    expect(record).toBeUndefined()
  })
})
