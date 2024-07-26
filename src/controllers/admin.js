const { findBestClients, findBestProfession } = require('../services/profile')
const { handleError, InvalidDateError } = require('../errors')

const getBestProfession = async (req, res) => {
  const { start, end } = req.query

  try {
    const startDate = new Date(start)
    const endDate = new Date(end)

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new InvalidDateError('Invalid date format')
    }
    const result = await findBestProfession(startDate, endDate)
    res.status(200).json(result)
  } catch (error) {
    handleError(res, error)
  }
}

const getBestClients = async (req, res) => {
  const { start, end, limit } = req.query

  try {
    const startDate = new Date(start)
    const endDate = new Date(end)

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new InvalidDateError('Invalid date format')
    }

    const result = await findBestClients(startDate, endDate, limit)
    res.status(200).json(result)
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { getBestProfession, getBestClients }
