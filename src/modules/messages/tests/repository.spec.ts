import createTestDatabase from '@tests/utils/createTestDatabase'
import { selectAllFor, createFor } from '@tests/utils/records'
import buildRepository from '../repository'
import { fakeSprint } from '@/modules/sprints/tests/utils'
import { fakeTemplate } from '@/modules/templates/tests/utils'
import { fakeUser } from '@/modules/users/tests/utils'
import { fakeGif } from '@/modules/gifs/tests/utils'
import { fakeMessage, messageMatcher } from './utils'
import { searchExpressionFactory } from '../utils'

const db = await createTestDatabase()
const repository = buildRepository(db)
const selectAllRecords = selectAllFor(db, 'messages')
const createForMessages = createFor(db, 'messages')
const createForUsers = createFor(db, 'users')
const createForSprints = createFor(db, 'sprints')
const createForTemplates = createFor(db, 'templates')
const createForGifs = createFor(db, 'gifs')
const searchExpressions = searchExpressionFactory()

afterAll(() => db.destroy())

afterEach(async () => {
  await db.deleteFrom('messages').execute()
  await db.deleteFrom('users').execute()
  await db.deleteFrom('sprints').execute()
  await db.deleteFrom('gifs').execute()
  await db.deleteFrom('templates').execute()
})

describe('Create', () => {
  it('should create a message record if Users, Sprints, Templates and Gifs records exists', async () => {
    await createForUsers(fakeUser())
    await createForGifs(fakeGif())
    await createForSprints(fakeSprint())
    await createForTemplates(fakeTemplate())
    const record = await repository.createNew(fakeMessage())
    expect(record).toEqual(messageMatcher())
    const allRecords = await selectAllRecords()
    expect(allRecords).toHaveLength(1)
    expect(allRecords).toEqual([messageMatcher()])
  })
})

describe('findAll', () => {
  it('sould return all messages', async () => {
    const [user1, user2] = await createForUsers([
      fakeUser({ name: 'tester' }),
      fakeUser({ name: 'johny' }),
    ])
    const [gif1, gif2] = await createForGifs([
      fakeGif({ url: 'https://testurl.test1.com/gif' }),
      fakeGif({ url: 'https://testurl.test2.com/gif' }),
    ])
    const [sprint1, sprint2] = await createForSprints([
      fakeSprint({ sprintsCode: 'WD-1.1' }),
      fakeSprint({ sprintsCode: 'WD-1.2' }),
    ])
    const [template1, template2] = await createForTemplates([
      fakeTemplate({ text: 'test text 1' }),
      fakeTemplate({ text: 'test text 2' }),
    ])
    createForMessages([
      fakeMessage({
        userId: user1.id,
        sprintId: sprint1.id,
        templateId: template1.id,
        gifId: gif1.id,
      }),
      fakeMessage({
        userId: user2.id,
        sprintId: sprint2.id,
        templateId: template2.id,
        gifId: gif2.id,
      }),
    ])
    const allRecords = await repository.findAll()
    expect(allRecords).toHaveLength(2)
    expect(allRecords[0]).toEqual(
      messageMatcher({
        userId: user1.id,
        sprintId: sprint1.id,
        templateId: template1.id,
        gifId: gif1.id,
      })
    )
    expect(allRecords[1]).toEqual(
      messageMatcher({
        userId: user2.id,
        sprintId: sprint2.id,
        templateId: template2.id,
        gifId: gif2.id,
      })
    )
  })
})

describe('findBytId', () => {
  it('should return the message with the specified sprint id', async () => {
    const [user] = await createForUsers(fakeUser())
    const [gif] = await createForGifs(fakeGif())
    const [sprint] = await createForSprints(fakeSprint())
    const [template] = await createForTemplates(fakeTemplate())
    const [message] = await createForMessages(
      fakeMessage({
        userId: user.id,
        sprintId: sprint.id,
        templateId: template.id,
        gifId: gif.id,
      })
    )
    const record = await repository.findById(message!.id)
    expect(record).toEqual(
      messageMatcher({
        userId: user.id,
        sprintId: sprint.id,
        templateId: template.id,
        gifId: gif.id,
      })
    )
  })
  it('should return undifined if specified id does not exist', async () => {
    const record = await repository.findById(10)
    expect(record).toBeUndefined()
  })
})

describe('find', () => {
  it('should return an array of messages with the specified sprint id', async () => {
    const [user] = await createForUsers(fakeUser())
    const [gif] = await createForGifs(fakeGif())
    const [sprint] = await createForSprints(fakeSprint())
    const [template] = await createForTemplates(fakeTemplate())
    await createForMessages(
      fakeMessage({
        userId: user.id,
        sprintId: sprint.id,
        templateId: template.id,
        gifId: gif.id,
      })
    )
    const expression = searchExpressions.findBySprintID(sprint!.id)
    const record = await repository.find(expression)
    expect(record).toEqual([
      messageMatcher({
        userId: user.id,
        sprintId: sprint.id,
        templateId: template.id,
        gifId: gif.id,
      }),
    ])
  })

  it('should return an empty array if specified sprint id does not exist', async () => {
    const expression = searchExpressions.findBySprintID(10)
    const record = await repository.find(expression)
    expect(record).toEqual([])
  })

  it('should return an array of messages with the specified user id', async () => {
    const [user] = await createForUsers(fakeUser())
    const [gif] = await createForGifs(fakeGif())
    const [sprint] = await createForSprints(fakeSprint())
    const [template] = await createForTemplates(fakeTemplate())
    await createForMessages(
      fakeMessage({
        userId: user.id,
        sprintId: sprint.id,
        templateId: template.id,
        gifId: gif.id,
      })
    )
    const expression = searchExpressions.findByUserID(user!.id)
    const record = await repository.find(expression)
    expect(record).toEqual([
      messageMatcher({
        userId: user.id,
        sprintId: sprint.id,
        templateId: template.id,
        gifId: gif.id,
      }),
    ])
  })
  it('should return an empty array if specified user id does not exist', async () => {
    const expression = searchExpressions.findByUserID(10)
    const record = await repository.find(expression)
    expect(record).toEqual([])
  })
})

describe('Update', () => {
  it('should return updated record and update the record with the specifie id', async () => {
    const [user] = await createForUsers(fakeUser())
    const [gif] = await createForGifs(fakeGif())
    const [sprint] = await createForSprints(fakeSprint())
    const [template1, template2] = await createForTemplates([
      fakeTemplate({ text: 'test text 1' }),
      fakeTemplate({ text: 'test text 2' }),
    ])
    const [message] = await createForMessages(
      fakeMessage({
        userId: user.id,
        sprintId: sprint.id,
        templateId: template1.id,
        gifId: gif.id,
      })
    )

    const record = await repository.update(message.id, {
      templateId: template2.id,
    })
    expect(record).toMatchObject(
      messageMatcher({
        userId: user.id,
        sprintId: sprint.id,
        templateId: template2.id,
        gifId: gif.id,
      })
    )
  })

  it('should return the original user record if no changes are made', async () => {
    const [user] = await createForUsers(fakeUser())
    const [gif] = await createForGifs(fakeGif())
    const [sprint] = await createForSprints(fakeSprint())
    const [template] = await createForTemplates(fakeTemplate())
    const [message] = await createForMessages(
      fakeMessage({
        userId: user.id,
        sprintId: sprint.id,
        templateId: template.id,
        gifId: gif.id,
      })
    )
    const record = await repository.update(message.id, {})
    expect(record).toMatchObject(
      messageMatcher({
        userId: user.id,
        sprintId: sprint.id,
        templateId: template.id,
        gifId: gif.id,
      })
    )
  })

  it('should return undefined if record is not found', async () => {
    const record = await repository.update(999, fakeMessage())
    expect(record).toBeUndefined()
  })
})

describe('Delete', () => {
  it('Should delete the record with the specified id and return the deleted record', async () => {
    const [user] = await createForUsers(fakeUser())
    const [gif] = await createForGifs(fakeGif())
    const [sprint] = await createForSprints(fakeSprint())
    const [template] = await createForTemplates(fakeTemplate())
    const [message] = await createForMessages(
      fakeMessage({
        userId: user.id,
        sprintId: sprint.id,
        templateId: template.id,
        gifId: gif.id,
      })
    )
    const record = await repository.delete(message.id)
    expect(record).toEqual(
      messageMatcher({
        userId: user.id,
        sprintId: sprint.id,
        templateId: template.id,
        gifId: gif.id,
      })
    )
  })
  it('should return undefined if the record with the specified id does not exist', async () => {
    const record = await repository.delete(999)
    expect(record).toBeUndefined()
  })
})
