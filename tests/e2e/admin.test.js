const request = require('supertest')
const app = require('../../src/app')

describe('Admin Endpoints', () => {
  const headers = { profile_id: '1' }
  describe('GET /admin/best-profession', () => {
    it('should return 200 and the best profession for the given date range', async () => {
      const response = await request(app)
        .get('/admin/best-profession')
        .query({ start: '2020-08-02', end: '2020-08-20' })
        .set(headers)

      expect(response.status).toBe(200)
      if (response.body.length > 0) {
        expect(response.body[0]).toHaveProperty('profession')
        expect(response.body[0]).toHaveProperty('totalEarned')
      }
    })

    it('should return 400 for invalid date format', async () => {
      const response = await request(app)
        .get('/admin/best-profession')
        .query({ start: 'invalid-date', end: '2020-08-20' })

      expect(response.status).toBe(400)
      expect(response.body).toHaveProperty('error', 'Invalid date format')
    })
  })

  describe('GET /admin/best-clients', () => {
    it('should return 200 and the best clients for the given date range', async () => {
      const response = await request(app)
        .get('/admin/best-clients')
        .query({ start: '2020-08-02', end: '2020-08-20', limit: 5 })
        .set(headers)

      expect(response.status).toBe(200)
      expect(response.body).toEqual(expect.any(Array))
      if (response.body.length > 0) {
        expect(response.body[0]).toHaveProperty('id')
        expect(response.body[0]).toHaveProperty('totalPaid')
        expect(response.body[0]).toHaveProperty('fullName')
      }
    })

    it('should return 400 for invalid date format', async () => {
      const response = await request(app)
        .get('/admin/best-clients')
        .query({ start: 'invalid-date', end: '2020-08-20', limit: 5 })

      expect(response.status).toBe(400)
      expect(response.body).toHaveProperty('error', 'Invalid date format')
    })
  })
})
