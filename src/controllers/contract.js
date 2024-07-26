const {
  findContractIdByProfile,
  findNotTerminatedByProfile,
} = require('../services/contract')
const { handleError } = require('../errors')

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

module.exports = { getContract, getNotTerminatedContracts }
