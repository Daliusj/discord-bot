import supertest from 'supertest'
import createTestDatabase from '@tests/utils/createTestDatabase'
import { createFor } from '@tests/utils/records'
import { omit } from 'lodash/fp'
import createApp from '@/app'
import { fakeTemplate, templateMatcher } from './utils'
import {
  buildMockGiphySuccess,
  buildMockDiscordSuccess,
} from '@/modules/messages/tests/utils'

const db = await createTestDatabase()
const giphy = await buildMockGiphySuccess()
const discord = await buildMockDiscordSuccess()
const app = createApp(db, discord, giphy)

const createForTemplates = createFor(db, 'templates')

afterEach(async () => {
  await db.deleteFrom('templates').execute()
})

afterAll(() => db.destroy())

describe('POST', () => {
  it('should return 201 and created template record', async () => {
    const { body } = await supertest(app)
      .post('/templates')
      .send(fakeTemplate({}))
      .expect(201)
    expect(body).toEqual(templateMatcher())
  })
  it('does not allow to create a template with empty text', async () => {
    const { body } = await supertest(app)
      .post('/templates')
      .send(
        fakeTemplate({
          text: '',
        })
      )
      .expect(400)
    expect(body.error.message).toMatch(/text/i)
  })

  it('should return 400 if text is missing', async () => {
    const { body } = await supertest(app)
      .post('/templates')
      .send(omit(['text'], fakeTemplate()))
      .expect(400)
    expect(body.error.message).toMatch(/text/i)
  })
})

describe('GET', () => {
  it('should return a list of existing templates', async () => {
    await createForTemplates([
      fakeTemplate(),
      fakeTemplate({
        text: 'test text',
      }),
    ])
    const { body } = await supertest(app).get('/templates').expect(200)
    expect(body).toEqual([
      templateMatcher(),
      templateMatcher({
        text: 'test text',
      }),
    ])
  })
  it('should return an empty array when there are no templates', async () => {
    const { body } = await supertest(app).get('/templates').expect(200)
    expect(body).toEqual([])
  })
})

describe('GET /:id', () => {
  it('should return a template if it exists', async () => {
    const id = 222
    await createForTemplates(fakeTemplate({ id }))
    const { body } = await supertest(app).get(`/templates/${id}`).expect(200)
    expect(body).toEqual(templateMatcher({ id }))
  })
  it('should return 404 if template does not exists', async () => {
    const { body } = await supertest(app).get('/templates/999').expect(404)
    expect(body.error.message).toMatch(/not found/i)
  })
})

describe('PATCH /:id', () => {
  it('allows partial updates', async () => {
    const id = 111
    await createForTemplates(fakeTemplate({ id }))
    const { body } = await supertest(app)
      .patch(`/templates/${id}`)
      .send({
        text: 'test text',
      })
      .expect(200)
    expect(body).toEqual(
      templateMatcher({
        text: 'test text',
      })
    )
  })
  it('persists changes', async () => {
    const id = 1212
    await createForTemplates(fakeTemplate({ id }))
    await supertest(app)
      .patch(`/templates/${id}`)
      .send({
        text: 'test text',
      })
      .expect(200)

    const { body } = await supertest(app).get(`/templates/${id}`).expect(200)
    expect(body).toEqual(
      templateMatcher({
        text: 'test text',
      })
    )
  })
  it('returns 404 if template does not exist', async () => {
    const { body } = await supertest(app)
      .patch('/templates/12345')
      .send(fakeTemplate())
      .expect(404)
    expect(body.error.message).toMatch(/not found/i)
  })
})

describe('DELETE /:id', () => {
  it('should return deleted record', async () => {
    const id = 333
    await createForTemplates(fakeTemplate({ id }))
    const { body } = await supertest(app).delete(`/templates/${id}`).expect(200)
    expect(body).toEqual(templateMatcher({ id }))
  })
  it('returns 404 if template does not exist', async () => {
    const { body } = await supertest(app).delete('/templates/12345').expect(404)
    expect(body.error.message).toMatch(/not found/i)
  })
})
