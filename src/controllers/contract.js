const {
  findContractIdByProfile,
  findNotTerminatedByProfile,
} = require('../services/contract')
const { ContractMissingError, UnauthorizedError } = require('./errorHandling')

const getContract = async (req, res) => {
  const profile = req.app.get('profile')
  const contractId = Number(req.params.id)

  try {
    const contract = await findContractIdByProfile(contractId, profile)
    res.status(200).json({ result: contract })
  } catch (error) {
    handleError(res, error)
  }
}

const getNotTerminatedContracts = async (req, res) => {
  const profile = req.app.get('profile')

  try {
    const contracts = await findNotTerminatedByProfile(profile)
    res.status(200).json({ result: contracts })
  } catch (error) {
    handleError(res, error)
  }
}

const handleError = (res, error) => {
  if (
    error instanceof ContractMissingError ||
    error instanceof UnauthorizedError
  ) {
    res.status(error.status).json({ error: error.message })
  } else {
    res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = { getContract, getNotTerminatedContracts }
