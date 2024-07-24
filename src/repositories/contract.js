const { Model } = require('sequelize')
const { Contract } = require('../entities/contract') // Import the Contract model

class ContractRepository {
  static async findById(id, whereOptions = {}) {
    const options = { where: { id, ...whereOptions } }
    return await Contract.findOne(options)
  }

  static async findNotTerminated(filter = {}) {
    const notTerminatedFilter = {
      where: {
        ...(filter.where || {}),
        status: { [Op.ne]: ContractStatus.TERMINATED },
      },
    }

    return await Contract.findAll(notTerminatedFilter)
  }

  static isContractor(profile, contract) {
    return contract.ContractorId === profile.id
  }

  static isClient(profile, contract) {
    return contract.ClientId === profile.id
  }
}

module.exports = ContractRepository
