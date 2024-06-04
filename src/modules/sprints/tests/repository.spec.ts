import createTestDatabase from '@tests/utils/createTestDatabase'
import { selectAllFor, createFor } from '@tests/utils/records'
import buildRepository from '../repository'
import { fakeSprint, sprintMatcher } from './utils'

const db = await createTestDatabase()
const repository = buildRepository(db)
const selectAllRecords = selectAllFor(db, 'sprints')
const createForSprints = createFor(db, 'sprints')

afterAll(() => db.destroy())

afterEach(async () => {
  await db.deleteFrom('sprints').execute()
})

describe('Create', () => {
  it('should create a sprint record', async () => {
    const record = await repository.createNew(fakeSprint())
    expect(record).toEqual(sprintMatcher())
    const allRecords = await selectAllRecords()
    expect(allRecords).toHaveLength(1)
    expect(allRecords).toEqual([sprintMatcher()])
  })
})

describe('findAll', () => {
  it('sould return all sprints', async () => {
    createForSprints([
      fakeSprint({
        sprintsCode: 'WD-1.1',
        title: 'Sprint 1',
      }),
      fakeSprint({
        sprintsCode: 'WD-1.2',
        title: 'Sprint 2',
      }),
    ])
    const allRecords = await repository.findAll()
    expect(allRecords).toHaveLength(2)
    expect(allRecords[0]).toEqual(
      sprintMatcher({
        sprintsCode: 'WD-1.1',
        title: 'Sprint 1',
      })
    )
    expect(allRecords[1]).toEqual(
      sprintMatcher({
        sprintsCode: 'WD-1.2',
        title: 'Sprint 2',
      })
    )
  })
})

describe('findById', () => {
  it('should return the sprint with the specified id', async () => {
    const [sprint] = await createForSprints(
      fakeSprint({
        id: 1234,
      })
    )
    const record = await repository.findById(sprint!.id)
    expect(record).toEqual(sprintMatcher())
  })
  it('should return undifined if specified id does not exist', async () => {
    const record = await repository.findById(10)
    expect(record).toBeUndefined()
  })
})

describe('Update', () => {
  it('should return updated record and update the record with the specifie id', async () => {
    const [sprint] = await createForSprints(fakeSprint())
    const record = await repository.update(sprint.id, { title: 'updated' })
    expect(record).toMatchObject(sprintMatcher({ title: 'updated' }))
  })
  it('should return the original sprint if no changes are made', async () => {
    const [sprint] = await createForSprints(fakeSprint())
    const record = await repository.update(sprint.id, {})
    expect(record).toMatchObject(sprintMatcher())
  })
  it('should return undefined if record is not found', async () => {
    const sprint = await repository.update(999, fakeSprint())
    expect(sprint).toBeUndefined()
  })
})

describe('Delete', () => {
  it('Should delete the record with the specified id and return the deleted record', async () => {
    const [sprint] = await createForSprints(fakeSprint())
    const record = await repository.delete(sprint.id)
    expect(record).toEqual(sprintMatcher())
  })
  it('should return undefined if the record with the specified id does not exist', async () => {
    const record = await repository.delete(999)
    expect(record).toBeUndefined()
  })
})
