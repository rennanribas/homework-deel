const { Profile: ProfileConstants } = require('../constants')
const ContractRepository = require('../repositories/contract')
const {
  ContractMissingError,
  UnauthorizedError,
} = require('../controllers/errorHandling')

const findContractIdByProfile = async (id, profile) => {
  const contract = await ContractRepository.findById(id)
  console.log('contract', contract)

  if (!contract) {
    throw new ContractMissingError('Contract not found')
  }

  const isAuthorized =
    profile.type === ProfileConstants.type.CLIENT
      ? contract.ClientId === profile.id
      : contract.ContractorId === profile.id

  if (!isAuthorized) {
    throw new UnauthorizedError('Unauthorized')
  }

  return contract
}

const findNotTerminatedByProfile = async (profile) => {
  let contracts = []

  if (profile.type === ProfileConstants.type.CLIENT) {
    contracts = await ContractRepository.findNonTerminated({
      where: { ClientId: profile.id },
    })
  } else if (profile.type === ProfileConstants.type.CONTRACTOR) {
    contracts = await ContractRepository.findNonTerminated({
      where: { ContractorId: profile.id },
    })
  }

  return contracts
}

module.exports = {
  findContractIdByProfile,
  findNotTerminatedByProfile,
}
