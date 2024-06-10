import createTestDatabase from '@tests/utils/createTestDatabase'
import { createFor } from '@tests/utils/records'
import { fakeSprint } from '@/modules/sprints/tests/utils'
import { fakeTemplate } from '@/modules/templates/tests/utils'
import { fakeUser } from '@/modules/users/tests/utils'
import buildServices from '../services'
import {
  fakeMessage,
  buildMockGiphy,
  buildMockDiscord,
  postResponseBodyMatcher,
} from './utils'
import { fakeGif } from '@/modules/gifs/tests/utils'

const db = await createTestDatabase()
const discord = await buildMockDiscord()
const giphy = await buildMockGiphy()
const services = buildServices(db, discord, giphy)
const createForUsers = createFor(db, 'users')
const createForSprints = createFor(db, 'sprints')
const createForTemplates = createFor(db, 'templates')
const createForMessages = createFor(db, 'messages')
const createForGifs = createFor(db, 'gifs')

afterEach(async () => {
  await db.deleteFrom('messages').execute()
  await db.deleteFrom('users').execute()
  await db.deleteFrom('sprints').execute()
  await db.deleteFrom('gifs').execute()
  await db.deleteFrom('templates').execute()
})

afterAll(() => db.destroy())

describe('createMessage', () => {
  it('should create a message with valid sprint code and return data of created message', async () => {
    const [user] = await createForUsers(fakeUser({ name: 'Tester' }))
    const [sprint] = await createForSprints(
      fakeSprint({ sprintsCode: 'WD-1.1' })
    )
    const [template] = await createForTemplates(
      fakeTemplate({ text: 'Test text' })
    )
    const message = await services.createMessage(user.name, sprint.sprintsCode)
    expect(message).toEqual(
      postResponseBodyMatcher({
        name: user.name,
        sprintsCode: sprint.sprintsCode,
        title: sprint.title,
        text: template.text,
        url: await giphy.getGifUrl(),
      })
    )
  })

  it('should throw an error with invalid sprint code', async () => {
    const [user] = await createForUsers(fakeUser({ name: 'Tester' }))
    await createForSprints(fakeSprint({ sprintsCode: 'WD-1.1' }))
    await createForTemplates(fakeTemplate({ text: 'Test text' }))
    await expect(
      services.createMessage(user.name, 'Wrong-code')
    ).rejects.toThrow(/sprint/i)
  })
})

describe('getAllMessages', () => {
  it('should return all messages records', async () => {
    const [user1, user2] = await createForUsers([
      fakeUser({ name: 'Tester' }),
      fakeUser({ name: 'Tester2' }),
    ])
    const [sprint1, sprint2] = await createForSprints([
      fakeSprint({ sprintsCode: 'WD-1.1' }),
      fakeSprint({ sprintsCode: 'WD-1.2' }),
    ])
    const [template1, template2] = await createForTemplates([
      fakeTemplate({ text: 'Test text' }),
      fakeTemplate({ text: 'Test text 2' }),
    ])
    const [gif1, gif2] = await createForGifs([
      fakeGif({ url: 'http://fake.gif1' }),
      fakeGif({ url: 'http://fake.gif2' }),
    ])

    const [message1, message2] = await createForMessages([
      fakeMessage({
        gifId: gif1.id,
        sprintId: sprint1.id,
        templateId: template1.id,
        userId: user1.id,
      }),
      fakeMessage({
        gifId: gif2.id,
        sprintId: sprint2.id,
        templateId: template2.id,
        userId: user2.id,
      }),
    ])
    const messages = await services.getAllMessages()
    expect(messages).toEqual([
      postResponseBodyMatcher({
        url: gif1.url,
        sprintsCode: sprint1.sprintsCode,
        title: sprint1.title,
        text: template1.text,
        name: user1.name,
        timeStamp: message1.timeStamp,
      }),
      postResponseBodyMatcher({
        url: gif2.url,
        sprintsCode: sprint2.sprintsCode,
        title: sprint2.title,
        text: template2.text,
        name: user2.name,
        timeStamp: message2.timeStamp,
      }),
    ])
  })
})

describe('getAllMessagesByUserName', () => {
  it('should return all messages records by specified user name', async () => {
    const [user1, user2] = await createForUsers([
      fakeUser({ name: 'Tester' }),
      fakeUser({ name: 'Tester2' }),
    ])
    const [sprint1, sprint2] = await createForSprints([
      fakeSprint({ sprintsCode: 'WD-1.1' }),
      fakeSprint({ sprintsCode: 'WD-1.2' }),
    ])
    const [template1, template2] = await createForTemplates([
      fakeTemplate({ text: 'Test text' }),
      fakeTemplate({ text: 'Test text 2' }),
    ])
    const [gif1, gif2] = await createForGifs([
      fakeGif({ url: 'http://fake.gif1' }),
      fakeGif({ url: 'http://fake.gif2' }),
    ])

    const [message1] = await createForMessages([
      fakeMessage({
        gifId: gif1.id,
        sprintId: sprint1.id,
        templateId: template1.id,
        userId: user1.id,
      }),
      fakeMessage({
        gifId: gif2.id,
        sprintId: sprint2.id,
        templateId: template2.id,
        userId: user2.id,
      }),
    ])
    const messages = await services.getAllMessagesByUserName('Tester')
    expect(messages).toEqual([
      postResponseBodyMatcher({
        url: gif1.url,
        sprintsCode: sprint1.sprintsCode,
        title: sprint1.title,
        text: template1.text,
        name: user1.name,
        timeStamp: message1.timeStamp,
      }),
    ])
  })
})

describe('getAllMessagesBySprintCode', () => {
  it('should return all messages records by specified user name', async () => {
    const [user1, user2] = await createForUsers([
      fakeUser({ name: 'Tester' }),
      fakeUser({ name: 'Tester2' }),
    ])
    const [sprint1, sprint2] = await createForSprints([
      fakeSprint({ sprintsCode: 'WD-1.1' }),
      fakeSprint({ sprintsCode: 'WD-1.2' }),
    ])
    const [template1, template2] = await createForTemplates([
      fakeTemplate({ text: 'Test text' }),
      fakeTemplate({ text: 'Test text 2' }),
    ])
    const [gif1, gif2] = await createForGifs([
      fakeGif({ url: 'http://fake.gif1' }),
      fakeGif({ url: 'http://fake.gif2' }),
    ])

    const [message1] = await createForMessages([
      fakeMessage({
        gifId: gif1.id,
        sprintId: sprint1.id,
        templateId: template1.id,
        userId: user1.id,
      }),
      fakeMessage({
        gifId: gif2.id,
        sprintId: sprint2.id,
        templateId: template2.id,
        userId: user2.id,
      }),
    ])
    const messages = await services.getAllMessagesBySprintCode('WD-1.1')
    expect(messages).toEqual([
      postResponseBodyMatcher({
        url: gif1.url,
        sprintsCode: sprint1.sprintsCode,
        title: sprint1.title,
        text: template1.text,
        name: user1.name,
        timeStamp: message1.timeStamp,
      }),
    ])
  })
})
