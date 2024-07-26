const { findById } = require('../services/profiles.service')
const { handleError } = require('../errors')
const { update } = require('../entities/job.model')

const getProfile = async (req, res) => {
  const profile = req.app.get('profile')
  try {
    res.status(200).json({ result: profile })
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { getProfile }
