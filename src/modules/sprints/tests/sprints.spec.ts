import supertest from 'supertest'
import createTestDatabase from '@tests/utils/createTestDatabase'
import createApp from '@/app'

const db = await createTestDatabase()
const app = createApp(db)

describe('insert new record', () => {
  it('should insert the new record in the table and return inserted record', async () => {
    const { body } = await supertest(app)
      .post('/sprints')
      .send({
        sprintsCode: 'WD-1.1',
        title: 'First Steps Into Programming With Python',
      })
      .expect(200)
    expect(body).toEqual({
      id: 1,
      sprintsCode: 'WD-1.1',
      title: 'First Steps Into Programming With Python',
    })
  })
})

describe('get all', () => {
  it('should return all records from the table', async () => {
    const { body } = await supertest(app).get('/sprints').expect(200)
    expect(body).toEqual([
      {
        id: 1,
        sprintsCode: 'WD-1.1',
        title: 'First Steps Into Programming With Python',
      },
    ])
  })
})

describe('patch record by id', () => {
  it('should return patched record', async () => {
    const { body } = await supertest(app)
      .patch('/sprints/1')
      .send({
        sprintsCode: 'WD-1.1',
        title: 'First Steps Into Programming with Python',
      })
      .expect(200)
    expect(body).toEqual({
      id: 1,
      sprintsCode: 'WD-1.1',
      title: 'First Steps Into Programming with Python',
    })
  })
})

describe('delete by id', () => {
  it('should return deleted record', async () => {
    const { body } = await supertest(app).delete('/sprints/1').expect(200)
    expect(body).toEqual({
      id: 1,
      sprintsCode: 'WD-1.1',
      title: 'First Steps Into Programming with Python',
    })
  })
})
