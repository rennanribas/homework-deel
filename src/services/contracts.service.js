const { Profile: ProfileConstants } = require('../constants')
const ContractRepository = require('../repositories/contracts.repository')
const { ContractMissingError, UnauthorizedError } = require('../errors')

const findContractIdByProfile = async (id, profile) => {
  const contract = await ContractRepository.findById(id)

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
  const contracts = await ContractRepository.findNonTerminated({
    where: {
      [profile.type === ProfileConstants.type.CLIENT
        ? 'ClientId'
        : 'ContractorId']: profile.id,
    },
  })

  return contracts
}

module.exports = {
  findContractIdByProfile,
  findNotTerminatedByProfile,
}
