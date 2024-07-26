const { Router } = require('express')
const { getBestProfession, getBestClients } = require('./controllers/admin')
const { deposit } = require('./controllers/balance')
const {
  getContract,
  getNotTerminatedContracts,
} = require('./controllers/contract')
const { getUnpaidJobs, payJob } = require('./controllers/job')
const { getProfileMiddleware } = require('./middleware/getProfile')

const router = Router()

router.get('/admin/best-profession', getBestProfession)
router.get('/admin/best-clients', getBestClients)

router.post('/balances/deposit/:userId', getProfileMiddleware, deposit)

router.get('/contracts/:id', getProfileMiddleware, getContract)
router.get('/contracts', getProfileMiddleware, getNotTerminatedContracts)

router.get('/jobs/unpaid', getProfileMiddleware, getUnpaidJobs)
router.post('/jobs/:job_id/pay', getProfileMiddleware, payJob)

module.exports = router
