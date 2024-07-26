const { handleDeposit } = require('../services/profiles.service')
const { handleError } = require('../errors')

const deposit = async (req, res) => {
  const profile = req.app.get('profile')

  try {
    const userId = Number(req.params.userId)
    const amount = Number(req.body.amount)

    const result = await handleDeposit(profile, userId, amount)
    res.status(201).json({ result })
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { deposit }
