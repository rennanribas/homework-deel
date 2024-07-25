const { getUnpaidJobsByProfile, makePayment } = require('../services/job')
const { handleError } = require('./errorHandling')

const getUnpaidJobs = async (req, res) => {
  const profile = req.app.get('profile')

  try {
    const jobs = await getUnpaidJobsByProfile(profile.id)
    res.status(200).json({ result: jobs })
  } catch (error) {
    handleError(res, error)
  }
}

const payJob = async (req, res) => {
  const profile = req.app.get('profile')
  const jobId = Number(req.params.job_id)

  try {
    const job = await makePayment(jobId, profile)
    res.status(201).json({ result: job })
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { getUnpaidJobs, payJob }
