import createTestDatabase from '@tests/utils/createTestDatabase'
import { selectAllFor, createFor } from '@tests/utils/records'
import buildRepository from '../repository'
import { fakeUser, userMatcher, expresionBuilderFindByName } from '../utils'

const db = await createTestDatabase()
const repository = buildRepository(db)
const selectAllRecords = selectAllFor(db, 'users')
const createForUsers = createFor(db, 'users')

afterAll(() => db.destroy())

afterEach(async () => {
  await db.deleteFrom('users').execute()
})

describe('Create', () => {
  it('should create a user record', async () => {
    const record = await repository.createNew(fakeUser())
    expect(record).toEqual(userMatcher())
    const allRecords = await selectAllRecords()
    expect(allRecords).toHaveLength(1)
    expect(allRecords).toEqual([userMatcher()])
  })
})

describe('Find', () => {
  it('should return a user by specified name', async () => {
    await createForUsers(fakeUser({ name: 'John Tester' }))
    const expression = expresionBuilderFindByName('john')
    const record = await repository.find(expression)
    expect(record).toEqual([userMatcher({ name: 'John Tester' })])
  })

  it('should return an empty array if no users are found', async () => {
    await createForUsers(fakeUser({ name: 'John Tester' }))
    const expression = expresionBuilderFindByName('peter')
    const record = await repository.find(expression)
    expect(record).toEqual([])
  })

  it('should return all matching records for partial matches', async () => {
    await createForUsers(fakeUser({ name: 'John Tester' }))
    await createForUsers(fakeUser({ name: 'Johnson' }))
    const expression = expresionBuilderFindByName('john')
    const records = await repository.find(expression)
    expect(records).toEqual([
      userMatcher({ name: 'John Tester' }),
      userMatcher({ name: 'Johnson' }),
    ])
  })
})

describe('findAll', () => {
  it('sould return all users', async () => {
    createForUsers([
      fakeUser({
        name: 'Tester1',
      }),
      fakeUser({
        name: 'Tester2',
      }),
    ])
    const allRecords = await repository.findAll()
    expect(allRecords).toHaveLength(2)
    expect(allRecords[0]).toEqual(
      userMatcher({
        name: 'Tester1',
      })
    )
    expect(allRecords[1]).toEqual(
      userMatcher({
        name: 'Tester2',
      })
    )
  })
})

describe('findById', () => {
  it('should return the user with the specified id', async () => {
    const [user] = await createForUsers(
      fakeUser({
        id: 1234,
      })
    )
    const record = await repository.findById(user!.id)
    expect(record).toEqual(userMatcher())
  })

  it('should return undifined if specified id does not exist', async () => {
    const record = await repository.findById(10)
    expect(record).toBeUndefined()
  })
})

describe('Update', () => {
  it('should return updated record and update the record with the specifie id', async () => {
    const [user] = await createForUsers(fakeUser())
    const record = await repository.update(user.id, { name: 'New Name' })
    expect(record).toMatchObject(userMatcher({ name: 'New Name' }))
  })

  it('should return the original user record if no changes are made', async () => {
    const [user] = await createForUsers(fakeUser())
    const record = await repository.update(user.id, {})
    expect(record).toMatchObject(userMatcher())
  })

  it('should return undefined if record is not found', async () => {
    const record = await repository.update(999, fakeUser())
    expect(record).toBeUndefined()
  })
})

describe('Delete', () => {
  it('Should delete the record with the specified id and return the deleted record', async () => {
    const [user] = await createForUsers(fakeUser())
    const record = await repository.delete(user.id)
    expect(record).toEqual(userMatcher())
  })
  it('should return undefined if the record with the specified id does not exist', async () => {
    const record = await repository.delete(999)
    expect(record).toBeUndefined()
  })
})
