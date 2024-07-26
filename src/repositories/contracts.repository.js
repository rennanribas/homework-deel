const { Contract: ContractConstants } = require('../constants')
const { Contract: ContractEntity } = require('../entities')
const { Op } = require('sequelize')

async function findById(id, whereOptions = {}) {
  const options = { where: { id, ...whereOptions } }
  return await ContractEntity.findOne(options)
}

async function findNonTerminated(filter = {}) {
  const activeFilter = {
    where: {
      ...(filter.where || {}),
      status: { [Op.ne]: ContractConstants.type.TERMINATED },
    },
  }

  return await ContractEntity.findAll(activeFilter)
}

module.exports = { findById, findNonTerminated }
