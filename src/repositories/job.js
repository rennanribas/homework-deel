const { Op } = require('sequelize')
const { Job: JobEntity, Contract: ContractEntity } = require('../entities')

async function findById(id, options = {}) {
  return await JobEntity.findOne({
    where: { id },
    include: [ContractEntity],
    ...options,
  })
}

async function findUnpaidJobs(filter = {}) {
  console.log('filter', filter)
  const openJobsFilter = {
    ...(filter || {}),
    where: {
      paid: { [Op.or]: [null, false] },
    },
  }

  return await JobEntity.findAll(openJobsFilter)
}

async function findClientBalance(clientId, options = {}) {
  return await JobEntity.sum('price', {
    where: { paid: { [Op.or]: [false, null] } },
    include: {
      model: ContractEntity,
      where: { ClientId: clientId },
    },
    ...options,
  })
}

async function updateJobPayment(jobId, paid = true, transaction) {
  await JobEntity.update(
    { paid, paymentDate: new Date() },
    { where: { id: jobId }, transaction }
  )
}

module.exports = {
  findById,
  findUnpaidJobs,
  findClientBalance,
  updateJobPayment,
}
