const { findUnpaidJobsByProfile, updatePaymentJob } = require('../services/job')
const { handleError } = require('../errors')

const getUnpaidJobs = async (req, res) => {
  const profile = req.app.get('profile')

  try {
    const jobs = await findUnpaidJobsByProfile(profile.id)
    res.status(200).json({ result: jobs })
  } catch (error) {
    handleError(res, error)
  }
}

const payJob = async (req, res) => {
  const profile = req.app.get('profile')

  try {
    const jobId = Number(req.params.job_id)

    const job = await updatePaymentJob(jobId, profile)
    res.status(201).json({ result: job })
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { getUnpaidJobs, payJob }
