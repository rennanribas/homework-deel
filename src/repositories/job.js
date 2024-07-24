import { Op } from 'sequelize'
import { Job as JobEntity, Contract as ContractEntity } from '../entities'

class JobRepository {
  async findById(id, options = {}) {
    return await JobEntity.findOne({
      where: { id },
      include: [ContractEntity],
      ...options,
    })
  }

  async findOpenJobs(filter = {}) {
    const openJobsFilter = {
      where: {
        ...(filter.where || {}),
        paid: { [Op.or]: [null, false] },
      },
    }

    return await JobEntity.findAll(openJobsFilter)
  }

  async findClientBalance(clientId, options = {}) {
    return await JobEntity.sum('price', {
      where: { paid: { [Op.or]: [false, null] } },
      include: {
        model: ContractEntity,
        where: { ClientId: clientId },
      },
      ...options,
    })
  }

  async updateJobPayment(paid = true, transaction) {
    await JobEntity.update({ paid, paymentDate: new Date() }, { transaction })
  }
}

module.exports = JobRepository
