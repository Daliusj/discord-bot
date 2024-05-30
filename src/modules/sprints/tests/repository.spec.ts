import createTestDatabase from '@tests/utils/createTestDatabase'
import { selectAllFor } from '@tests/utils/records'
import buildRepository from '../repository'

const db = await createTestDatabase()
const repository = buildRepository(db)
const selectAllRecords = selectAllFor(db, 'sprints')

describe('Insert', () => {
  it('should insert new record in the table and return inserted record', async () => {
    const record = await repository.insertNew({
      sprintsCode: 'WD-1.1',
      title: 'First Steps Into Programming With Python',
    })
    expect(record).toEqual({
      id: 1,
      sprintsCode: 'WD-1.1',
      title: 'First Steps Into Programming With Python',
    })
    const allRecords = await selectAllRecords()
    expect(allRecords).toHaveLength(1)
    expect(allRecords).toEqual([
      {
        id: 1,
        sprintsCode: 'WD-1.1',
        title: 'First Steps Into Programming With Python',
      },
    ])
  })

  it('should return undefined if sprints code is not specified', async () => {
    const record = await repository.insertNew({
      sprintsCode: '',
      title: 'Intermediate Programming with Python',
    })
    expect(record).toEqual(undefined)
  })

  it('should return undefined if title is not specified', async () => {
    const record = await repository.insertNew({
      sprintsCode: 'WD-1.2',
      title: '',
    })
    expect(record).toEqual(undefined)
  })
})

describe('Find all', () => {
  it('sould return all records for the table', async () => {
    const allRecords = await repository.findAll()
    expect(allRecords).toHaveLength(1)
    expect(allRecords).toEqual([
      {
        id: 1,
        sprintsCode: 'WD-1.1',
        title: 'First Steps Into Programming With Python',
      },
    ])
  })

  it('should return an empty array if there are no records', async () => {
    const emptyDb = await createTestDatabase()
    const repositoryForEmptyDb = buildRepository(emptyDb)
    const allRecords = await repositoryForEmptyDb.findAll()
    expect(allRecords).toHaveLength(0)
    expect(allRecords).toEqual([])
  })
})

describe('Find by id', () => {
  it('should return the record with the specified id', async () => {
    const record = await repository.findById(1)
    expect(record).toHaveLength(1)
    expect(record).toEqual([
      {
        id: 1,
        sprintsCode: 'WD-1.1',
        title: 'First Steps Into Programming With Python',
      },
    ])
  })
  it('should return an empty array if the record with the specified id does not exist', async () => {
    const record = await repository.findById(10)
    expect(record).toHaveLength(0)
    expect(record).toEqual([])
  })
})

describe('Update', () => {
  it('should return updated record and update the record with the specifie id', async () => {
    const record = await repository.update(1, {
      sprintsCode: 'WD-1.1',
      title: 'First Steps Into Programming with Python',
    })
    expect(record).toEqual({
      id: 1,
      sprintsCode: 'WD-1.1',
      title: 'First Steps Into Programming with Python',
    })
    const updatedRecord = await selectAllRecords()
    expect(updatedRecord).toEqual([
      {
        id: 1,
        sprintsCode: 'WD-1.1',
        title: 'First Steps Into Programming with Python',
      },
    ])
  })
  it('should return undefined if the record with the specified id does not exist', async () => {
    const record = await repository.update(3, {
      sprintsCode: 'WD-1.3',
      title: 'Object Oriented Programming',
    })
    expect(record).toEqual(undefined)
  })
})

describe('Delete', () => {
  it('Should delete the record with the specified id and return the deleted record', async () => {
    const returnedRecord = await repository.delete(1)
    expect(returnedRecord).toEqual({
      id: 1,
      sprintsCode: 'WD-1.1',
      title: 'First Steps Into Programming with Python',
    })
    const records = await selectAllRecords()
    expect(records).toHaveLength(0)
    expect(records).toEqual([])
  })
  it('should return undefined if the record with the specified id does not exist', async () => {
    const record = await repository.delete(10)
    expect(record).toEqual(undefined)
  })
})
