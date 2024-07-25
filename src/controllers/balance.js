const { makeDeposit } = require('../services/profile')
const { handleError } = require('./errorHandling')

const deposit = async (req, res) => {
  const profile = req.app.get('profile')
  const userId = Number(req.params.userId)
  const amount = Number(req.body.amount)

  try {
    const result = await makeDeposit(profile, userId, amount)
    res.status(201).json({ result })
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { deposit }
