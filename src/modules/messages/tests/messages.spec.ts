import supertest from 'supertest'
import createTestDatabase from '@tests/utils/createTestDatabase'
import { createFor } from '@tests/utils/records'
import { omit } from 'lodash/fp'
import createApp from '@/app'
import {
  fakeMessage,
  messageMatcher,
  fakeMessagePostBody,
  postResponseBodyMatcher,
  buildMockDiscord,
  buildMockGiphy,
} from './utils'
import { fakeSprint } from '@/modules/sprints/tests/utils'
import { fakeTemplate } from '@/modules/templates/tests/utils'
import { fakeGif } from '@/modules/gifs/tests/utils'
import { fakeUser } from '@/modules/users/tests/utils'

const db = await createTestDatabase()
const giphy = await buildMockGiphy()
const discord = await buildMockDiscord()
const app = createApp(db, discord, giphy)

const createForMessages = createFor(db, 'messages')
const createForUsers = createFor(db, 'users')
const createForSprints = createFor(db, 'sprints')
const createForTemplates = createFor(db, 'templates')
const createForGifs = createFor(db, 'gifs')

afterEach(async () => {
  await db.deleteFrom('messages').execute()
  await db.deleteFrom('users').execute()
  await db.deleteFrom('sprints').execute()
  await db.deleteFrom('gifs').execute()
  await db.deleteFrom('templates').execute()
})

afterAll(() => db.destroy())

describe('POST', () => {
  it('should return 201 and create message', async () => {
    const [sprint] = await createForSprints(fakeSprint())
    const [template] = await createForTemplates(fakeTemplate())
    const { body } = await supertest(app)
      .post('/messages')
      .send(fakeMessagePostBody({ sprintsCode: sprint.sprintsCode }))
      .expect(201)
    expect(body).toEqual(
      postResponseBodyMatcher({
        sprintsCode: sprint.sprintsCode,
        title: sprint.title,
        text: template.text,
      })
    )
  })

  it('does not allow to create a message with an empty sprints code', async () => {
    const { body } = await supertest(app)
      .post('/messages')
      .send(fakeMessagePostBody({ sprintsCode: '' }))
      .expect(400)
    expect(body.error.message).toMatch(/at least/i)
  })

  it('does not allow to create a message with an empty user name', async () => {
    const { body } = await supertest(app)
      .post('/messages')
      .send(fakeMessagePostBody({ name: '' }))
      .expect(400)
    expect(body.error.message).toMatch(/at least/i)
  })

  it('should return 400 if sprints code is missing', async () => {
    const { body } = await supertest(app)
      .post('/messages')
      .send(omit(['sprintsCode'], fakeMessagePostBody()))
      .expect(400)
    expect(body.error.message).toMatch(/required/i)
  })

  it('should return 400 if user name is missing', async () => {
    const { body } = await supertest(app)
      .post('/messages')
      .send(omit(['name'], fakeMessagePostBody()))
      .expect(400)
    expect(body.error.message).toMatch(/required/i)
  })
})

describe('GET', () => {
  it('should return a list of existing messages', async () => {
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
    const { body } = await supertest(app).get('/messages').expect(200)

    expect(body).toEqual([
      postResponseBodyMatcher({
        sprintsCode: sprint1.sprintsCode,
        title: sprint1.title,
        text: template1.text,
        name: user1.name,
        url: gif1.url,
      }),
      postResponseBodyMatcher({
        sprintsCode: sprint2.sprintsCode,
        title: sprint2.title,
        text: template2.text,
        name: user2.name,
        url: gif2.url,
      }),
    ])
  })

  it('should return an empty array when there ar no messages', async () => {
    const { body } = await supertest(app).get('/messages').expect(200)
    expect(body).toEqual([])
  })
})

describe('GET ?username=', () => {
  it('should return a list of existing messages for speciefied user', async () => {
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
    const { body } = await supertest(app)
      .get(`/messages?username=${user1.name}`)
      .expect(200)

    expect(body).toEqual([
      postResponseBodyMatcher({
        sprintsCode: sprint1.sprintsCode,
        title: sprint1.title,
        text: template1.text,
        name: user1.name,
        url: gif1.url,
      }),
    ])
  })
})
