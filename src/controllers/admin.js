const { queryBestClients, queryBestProfession } = require('../services/profile')
const { handleError } = require('./errorHandling')

const getBestProfession = async (req, res) => {
  const { start, end } = req.query

  const since = new Date(Number(start))
  const to = new Date(Number(end))

  try {
    const result = await queryBestProfession(since, to)
    res.status(200).json(result)
  } catch (error) {
    handleError(res, error)
  }
}

const getBestClients = async (req, res) => {
  const { start, end, limit } = req.query

  const since = new Date(Number(start))
  const to = new Date(Number(end))

  try {
    const result = await queryBestClients(since, to, limit)
    res.status(200).json(result)
  } catch (error) {
    handleError(res, error)
  }
}

module.exports = { getBestProfession, getBestClients }
