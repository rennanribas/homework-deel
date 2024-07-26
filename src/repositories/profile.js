const { Op, Sequelize, Model } = require('sequelize')
const {
  Profile: ProfileEntity,
  Contract: ContractEntity,
  Job: JobEntity,
} = require('../entities')
const { Profile: ProfileConstants } = require('../constants')
const sequelize = require('../entities/config')

class ProfileRepository {
  constructor(sequelize) {
    this.model = ProfileEntity
  }
  static async findById(id, options = {}) {
    return await ProfileEntity.findOne({ where: { id }, ...options })
  }

  static async findBestProfession(since, to) {
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

  static async findBestClients(since, to, limit) {
    const bestClients = await ProfileEntity.findAll({
      subQuery: false,
      attributes: [
        'id',
        [Sequelize.fn('SUM', Sequelize.col('Client.Jobs.price')), 'totalPaid'],
        [Sequelize.literal("firstName || ' ' || lastName"), 'fullName'],
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

  static async updateBalance(id, newAmount, transaction) {
    return await ProfileEntity.update(
      { balance: newAmount },
      {
        where: { id },
        transaction,
      }
    )
  }
}

module.exports = ProfileRepository
