const request = require('supertest')
const app = require('../../src/app')

describe('Contracts Endpoints', () => {
  it('should get contract', async () => {
    const res = await request(app).get('/contracts/1').set('profile_id', 1)
    expect(res.statusCode).toBe(200)
    expect(res.body.result).toHaveProperty('id', 1)
    expect(res.body.result).toHaveProperty('terms')
  })

  it('should return unauthorized for invalid profile', async () => {
    const res = await request(app).get('/contracts/3').set('profile_id', 1)
    expect(res.statusCode).toBe(401)
    expect(res.body).toHaveProperty('error')
  })

  it('should return not found for invalid contract', async () => {
    const res = await request(app).get('/contracts/10').set('profile_id', 1)
    expect(res.statusCode).toBe(404)
    expect(res.body).toHaveProperty('error')
  })

  it('should get all contracts that are not terminated', async () => {
    const res = await request(app).get('/contracts').set('profile_id', 3)
    expect(res.statusCode).toBe(200)
    expect(res.body.result).toBeInstanceOf(Array)
    expect(res.body.result.length).toBeGreaterThanOrEqual(0)
    res.body.result.forEach((contract) => {
      expect(contract).toHaveProperty('id')
      expect(contract.status).not.toBe('terminated')
    })
  })

  it('should return not found for invalid profile', async () => {
    const res = await request(app).get('/contracts').set('profile_id', 200)
    expect(res.statusCode).toBe(401)
    expect(res.body).toHaveProperty('error')
  })
})
