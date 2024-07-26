const { Router } = require('express')
const {
  getBestProfession,
  getBestClients,
} = require('./controllers/admins.controller')
const { deposit, getBalance } = require('./controllers/balances.controller')
const {
  getContract,
  getNotTerminatedContracts,
} = require('./controllers/contracts.controller')
const { getUnpaidJobs, payJob } = require('./controllers/jobs.controller')
const { getProfileMiddleware } = require('./middleware/getProfile')
const { getProfile } = require('./controllers/profiles.controller')

const router = Router()

router.get('/admin/best-profession', getBestProfession)
router.get('/admin/best-clients', getBestClients)

router.get('/profile', getProfileMiddleware, getProfile)

router.post('/balances/deposit/:userId', getProfileMiddleware, deposit)

router.get('/contracts/:id', getProfileMiddleware, getContract)
router.get('/contracts', getProfileMiddleware, getNotTerminatedContracts)

router.get('/jobs/unpaid', getProfileMiddleware, getUnpaidJobs)
router.post('/jobs/:job_id/pay', getProfileMiddleware, payJob)

module.exports = router
