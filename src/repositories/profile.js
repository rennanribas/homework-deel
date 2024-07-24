import { Op, Sequelize } from 'sequelize'
import {
  Profile as ProfileEntity,
  Contract as ContractEntity,
  Job as JobEntity,
} from '../entities'
import { Profile as ProfileConstants } from '../constants'

class ProfileRepository {
  async getById(id, options = {}) {
    return await ProfileEntity.findOne({ where: { id }, ...options })
  }

  async getBestProfession(since, to) {
    const bestProfession = await ProfileEntity.findAll({
      attributes: [
        'profession',
        [
          Sequelize.fn('SUM', Sequelize.col('Contractor.Jobs.price')),
          'totalEarned',
        ],
      ],
      group: ['profession'],
      where: { type: ProfileConstants.type.CONTRACTOR },
      include: {
        model: ContractEntity,
        as: 'Contractor',
        attributes: [],
        include: {
          model: JobEntity,
          as: 'Jobs',
          attributes: [],
          where: {
            paid: true,
            paymentDate: { [Op.between]: [since, to] },
          },
        },
      },
      order: [[Sequelize.col('totalEarned'), 'DESC']],
    })

    return bestProfession
  }

  async getBestClients(since, to, limit) {
    const bestClients = await ProfileEntity.findAll({
      subQuery: false,
      attributes: [
        'id',
        [Sequelize.fn('SUM', Sequelize.col('Client.Jobs.price')), 'totalPaid'],
        [Sequelize.literal("firstName || ' ' || lastName"), 'fullName'], // Build full name
      ],
      group: ['ProfileEntity.id'],
      order: [[Sequelize.col('totalPaid'), 'DESC']],
      where: { type: ProfileConstants.type.CLIENT },
      include: {
        model: ContractEntity,
        as: 'Client',
        attributes: [],
        include: {
          model: JobEntity,
          as: 'Jobs',
          attributes: [],
          where: {
            paid: true,
            paymentDate: { [Op.between]: [since, to] },
          },
        },
      },
      limit,
    })

    return bestClients
  }

  async updateBalance(amount, transaction) {
    const updateAmount =
      ProfileEntity.type === ProfileConstants.type.CONTRACTOR ? amount : -amount
    return await ProfileEntity.update(
      {
        balance: Sequelize.literal(
          `balance ${updateAmount > 0 ? '+' : '-'} ${Math.abs(amount)}`
        ),
      },
      { transaction }
    )
  }
}

module.exports = ProfileRepository
