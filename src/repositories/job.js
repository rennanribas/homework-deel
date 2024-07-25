const { Op } = require('sequelize')
const { Job: JobEntity, Contract: ContractEntity } = require('../entities')

async function getById(id, options = {}) {
  return await JobEntity.findOne({
    where: { id },
    include: [ContractEntity],
    ...options,
  })
}

async function getOpenJobs(filter = {}) {
  const openJobsFilter = {
    where: {
      ...(filter.where || {}),
      paid: { [Op.or]: [null, false] },
    },
  }

  return await JobEntity.findAll(openJobsFilter)
}

async function getClientBalance(clientId, options = {}) {
  return await JobEntity.sum('price', {
    where: { paid: { [Op.or]: [false, null] } },
    include: {
      model: ContractEntity,
      where: { ClientId: clientId },
    },
    ...options,
  })
}

async function updateJobPayment(paid = true, transaction) {
  await JobEntity.update({ paid, paymentDate: new Date() }, { transaction })
}

module.exports = { getById, getOpenJobs, getClientBalance, updateJobPayment }
