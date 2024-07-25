const { Router } = require('express')
const { getBestProfession, getBestClients } = require('./controllers/admin')
const { deposit } = require('./controllers/balance')
const {
  getContract,
  getNotTerminatedContracts,
} = require('./controllers/contract')
const { getUnpaidJobs, payJob } = require('./controllers/job')
const { getProfile } = require('./middleware/getProfile')

const router = Router()

router.get('/admin/best-profession', getBestProfession)
router.get('/admin/best-client', getBestClients)

router.post('/balances/deposit/:userId', getProfile, deposit)

router.get('/contracts/:id', getProfile, getContract)
router.get('/contracts', getProfile, getNotTerminatedContracts)

router.get('/jobs/unpaid', getProfile, getUnpaidJobs)
router.post('/jobs/:job_id/pay', getProfile, payJob)

module.exports = router
