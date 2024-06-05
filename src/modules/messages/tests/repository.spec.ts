import createTestDatabase from '@tests/utils/createTestDatabase'
import { selectAllFor, createFor } from '@tests/utils/records'
import buildRepository from '../repository'
import { fakeSprint } from '@/modules/sprints/tests/utils'
import { fakeTemplate } from '@/modules/templates/tests/utils'
import { fakeMessage, messageMatcher, fakeGif, fakeUser } from './utils'

const db = await createTestDatabase()
const repository = buildRepository(db)
const selectAllRecords = selectAllFor(db, 'messages')
const createForUsers = createFor(db, 'users')
const createForSprints = createFor(db, 'sprints')
const createForTemplates = createFor(db, 'templates')
const createForGifs = createFor(db, 'gifs')

afterAll(() => db.destroy())

afterEach(async () => {
  await db.deleteFrom('messages').execute()
})

describe('Create', () => {
  it('should create a message record if Users, Sprints, Templates and Gifs records exists', async () => {
    await createForUsers(fakeUser())
    await createForGifs(fakeGif())
    await createForSprints(fakeSprint())
    createForTemplates(fakeTemplate())
    const record = await repository.createNew(fakeMessage())
    expect(record).toEqual(messageMatcher())
    const allRecords = await selectAllRecords()
    expect(allRecords).toHaveLength(1)
    expect(allRecords).toEqual([messageMatcher()])
  })
})

describe('findAll', () => {
  it.todo('sould return all sprints', async () => {
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
  it.todo('should return the sprint with the specified id', async () => {
    const [sprint] = await createForSprints(
      fakeSprint({
        id: 1234,
      })
    )
    const record = await repository.findById(sprint!.id)
    expect(record).toEqual(sprintMatcher())
  })
  it.todo(
    'should return undifined if specified id does not exist',
    async () => {
      const record = await repository.findById(10)
      expect(record).toBeUndefined()
    }
  )
})

describe('Update', () => {
  it.todo(
    'should return updated record and update the record with the specifie id',
    async () => {
      const [sprint] = await createForSprints(fakeSprint())
      const record = await repository.update(sprint.id, { title: 'updated' })
      expect(record).toMatchObject(sprintMatcher({ title: 'updated' }))
    }
  )
  it.todo(
    'should return the original sprint if no changes are made',
    async () => {
      const [sprint] = await createForSprints(fakeSprint())
      const record = await repository.update(sprint.id, {})
      expect(record).toMatchObject(sprintMatcher())
    }
  )
  it.todo('should return undefined if record is not found', async () => {
    const sprint = await repository.update(999, fakeSprint())
    expect(sprint).toBeUndefined()
  })
})

describe('Delete', () => {
  it.todo(
    'Should delete the record with the specified id and return the deleted record',
    async () => {
      const [sprint] = await createForSprints(fakeSprint())
      const record = await repository.delete(sprint.id)
      expect(record).toEqual(sprintMatcher())
    }
  )
  it.todo(
    'should return undefined if the record with the specified id does not exist',
    async () => {
      const record = await repository.delete(999)
      expect(record).toBeUndefined()
    }
  )
})
