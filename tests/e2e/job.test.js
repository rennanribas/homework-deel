const request = require('supertest')
const app = require('../../src/app')

describe('Jobs Endpoints', () => {
  it('should get unpaid jobs', async () => {
    const res = await request(app).get('/jobs/unpaid').set('profile_id', 1)
    expect(res.statusCode).toEqual(200)
    expect(res.body.result).toBeInstanceOf(Array)
    res.body.result.forEach((job) => {
      expect(job).toHaveProperty('id')
      expect(job.paid).toBeFalsy()
    })
  })

  let jobIdToPay
  beforeAll(async () => {
    const getUnpaidJobsResponse = await request(app)
      .get('/jobs/unpaid')
      .set('profile_id', 1)

    jobIdToPay = getUnpaidJobsResponse.body.result[0].id
  })

  it('should pay a job', async () => {
    const res = await request(app)
      .post(`/jobs/${jobIdToPay}/pay`)
      .set('profile_id', 1)
    expect(res.statusCode).toEqual(201)
    expect(res.body.result).toHaveProperty('id')
    expect(res.body.result.paid).toBeTruthy()
  })

  it('should return error for job already paid', async () => {
    const res = await request(app)
      .post(`/jobs/${jobIdToPay}/pay`)
      .set('profile_id', 1)
    expect(res.statusCode).toEqual(400)
    expect(res.body).toHaveProperty('error')
  })

  it('should return not found for invalid job', async () => {
    const res = await request(app).post('/jobs/100/pay').set('profile_id', 1)
    expect(res.statusCode).toEqual(404)
    expect(res.body).toHaveProperty('error')
  })

  it('should return unauthorized for invalid profile', async () => {
    const res = await request(app).post('/jobs/3/pay').set('profile_id', 1)
    expect(res.statusCode).toEqual(401)
    expect(res.body).toHaveProperty('error')
  })
})
