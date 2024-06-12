import supertest from 'supertest'
import createTestDatabase from '@tests/utils/createTestDatabase'
import { createFor } from '@tests/utils/records'
import { omit } from 'lodash/fp'
import createApp from '@/app'
import { fakeSprint, sprintMatcher } from './utils'
import {
  buildMockDiscordSuccess,
  buildMockGiphySuccess,
} from '@/modules/messages/tests/utils'

const db = await createTestDatabase()
const giphy = await buildMockGiphySuccess()
const discord = await buildMockDiscordSuccess()
const app = createApp(db, discord, giphy)

const createForSprints = createFor(db, 'sprints')

afterEach(async () => {
  await db.deleteFrom('sprints').execute()
})

afterAll(() => db.destroy())

describe('POST', () => {
  it('should return 201 and create sprint record', async () => {
    const { body } = await supertest(app)
      .post('/sprints')
      .send(fakeSprint({}))
      .expect(201)
    expect(body).toEqual(sprintMatcher())
  })
  it('does not allow to create a sprint with empty sprints code', async () => {
    const { body } = await supertest(app)
      .post('/sprints')
      .send(
        fakeSprint({
          sprintsCode: '',
          title: 'Intermediate Programming with Python',
        })
      )
      .expect(400)
    expect(body.error.message).toMatch(/sprintsCode/i)
  })
  it('does not allow to create a sprint with an empty title', async () => {
    const { body } = await supertest(app)
      .post('/sprints')
      .send(
        fakeSprint({
          sprintsCode: 'WD-1.2',
          title: '',
        })
      )
      .expect(400)
    expect(body.error.message).toMatch(/title/i)
  })
  it('should return 400 if sprints code is missing', async () => {
    const { body } = await supertest(app)
      .post('/sprints')
      .send(omit(['sprintsCode'], fakeSprint({})))
      .expect(400)
    expect(body.error.message).toMatch(/sprintscode/i)
  })
  it('should return 400 if title is missing', async () => {
    const { body } = await supertest(app)
      .post('/sprints')
      .send(omit(['title'], fakeSprint({})))
      .expect(400)
    expect(body.error.message).toMatch(/title/i)
  })
})

describe('GET', () => {
  it('should return a list of existing sprints', async () => {
    await createForSprints([
      fakeSprint(),
      fakeSprint({
        sprintsCode: 'WD-1.2',
        title: 'Intermediate Programming with Python',
      }),
    ])
    const { body } = await supertest(app).get('/sprints').expect(200)
    expect(body).toEqual([
      sprintMatcher(),
      sprintMatcher({
        sprintsCode: 'WD-1.2',
        title: 'Intermediate Programming with Python',
      }),
    ])
  })
  it('should return an empty array when there ar no sprints', async () => {
    const { body } = await supertest(app).get('/sprints').expect(200)
    expect(body).toEqual([])
  })
})

describe('GET /:id', () => {
  it('should return a sprint if it exists', async () => {
    const id = 222
    await createForSprints(fakeSprint({ id }))
    const { body } = await supertest(app).get(`/sprints/${id}`).expect(200)
    expect(body).toEqual(sprintMatcher({ id }))
  })
  it('should return 404 if sprint does not exists', async () => {
    const { body } = await supertest(app).get('/sprints/999').expect(404)
    expect(body.error.message).toMatch(/not found/i)
  })
})

describe('PATCH /:id', () => {
  it('allows partial updates', async () => {
    const id = 111
    await createForSprints(fakeSprint({ id }))
    const { body } = await supertest(app)
      .patch(`/sprints/${id}`)
      .send({
        sprintsCode: 'WD-1.1',
        title: 'Updated',
      })
      .expect(200)
    expect(body).toEqual(
      sprintMatcher({
        sprintsCode: 'WD-1.1',
        title: 'Updated',
      })
    )
  })
  it('persists changes', async () => {
    const id = 1212
    await createForSprints(fakeSprint({ id }))
    await supertest(app)
      .patch(`/sprints/${id}`)
      .send({
        sprintsCode: 'WD-1.1',
        title: 'Updated',
      })
      .expect(200)

    const { body } = await supertest(app).get(`/sprints/${id}`).expect(200)
    expect(body).toEqual(
      sprintMatcher({
        sprintsCode: 'WD-1.1',
        title: 'Updated',
      })
    )
  })
  it('returns 404 if sprint does not exist', async () => {
    const { body } = await supertest(app)
      .patch('/sprints/12345')
      .send(fakeSprint())
      .expect(404)
    expect(body.error.message).toMatch(/not found/i)
  })
})

describe('DELETE /:id', () => {
  it('should return deleted record', async () => {
    const id = 333
    await createForSprints(fakeSprint({ id }))
    const { body } = await supertest(app).delete(`/sprints/${id}`).expect(200)
    expect(body).toEqual(sprintMatcher({ id }))
  })
  it('returns 404 if sprint does not exist', async () => {
    const { body } = await supertest(app).delete('/sprints/12345').expect(404)
    expect(body.error.message).toMatch(/not found/i)
  })
})
