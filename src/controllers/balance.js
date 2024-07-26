const { handleDeposit } = require('../services/profile')
const { handleError } = require('../errors')

const deposit = async (req, res) => {
  const profile = req.app.get('profile')
  const userId = Number(req.params.userId)
  const amount = Number(req.body.amount)

  try {
    const result = await handleDeposit(profile, userId, amount)
    res.status(201).json({ result })
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { deposit }
