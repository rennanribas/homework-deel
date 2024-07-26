const request = require('supertest')
const app = require('../../src/app')

describe('Balances Endpoints', () => {
  it('should deposit money', async () => {
    const res = await request(app)
      .post('/balances/deposit/1')
      .set('profile_id', 1)
      .send({ amount: 10 })
    expect(res.statusCode).toEqual(201)
    expect(res.body.result).toHaveProperty('updatedSender')
    expect(res.body.result).toHaveProperty('updatedReceiver')
  })

  it('should not found receiver', async () => {
    const res = await request(app)
      .post('/balances/deposit/200')
      .set('profile_id', 1)
      .send({ amount: 10 })
    expect(res.statusCode).toEqual(404)
    expect(res.body).toHaveProperty('error')
  })

  it('should not found profile used', async () => {
    const res = await request(app)
      .post('/balances/deposit/1')
      .set('profile_id', 40)
      .send({ amount: 10 })
    expect(res.statusCode).toEqual(401)
    expect(res.body).toHaveProperty('error')
  })

  it('should respond amount is bigger that the debt ratio', async () => {
    const res = await request(app)
      .post('/balances/deposit/2')
      .set('profile_id', 1)
      .send({ amount: 1000 })
    expect(res.statusCode).toEqual(400)
    expect(res.body).toHaveProperty('error')
  })
})
