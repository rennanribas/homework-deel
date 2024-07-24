import { Contract as ContractConstants } from '../constants'
import { Contract as ContractEntity } from '../entities'

class ContractRepository {
  static async findById(id, whereOptions = {}) {
    const options = { where: { id, ...whereOptions } }
    return await ContractEntity.findOne(options)
  }

  static async findNotTerminated(filter = {}) {
    const notTerminatedFilter = {
      where: {
        ...(filter.where || {}),
        status: { [Op.ne]: ContractConstants.type.TERMINATED },
      },
    }

    return await ContractEntity.findAll(notTerminatedFilter)
  }

  static isContractor(profile, contract) {
    return contract.ContractorId === profile.id
  }

  static isClient(profile, contract) {
    return contract.ClientId === profile.id
  }
}

module.exports = ContractRepository
