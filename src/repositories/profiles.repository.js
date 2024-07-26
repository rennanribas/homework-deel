const { Op } = require('sequelize')
const {
  Profile: ProfileEntity,
  Contract: ContractEntity,
  Job: JobEntity,
} = require('../entities')
const { Profile: ProfileConstants } = require('../constants')
const sequelize = require('../entities/config')

async function findById(id, options = {}) {
  return await ProfileEntity.findOne({ where: { id }, ...options })
}

async function findBestProfession(startDate, endDate) {
  const bestProfession = await ProfileEntity.findAll({
    attributes: [
      'profession',
      [
        sequelize.fn('SUM', sequelize.col('Contractor.Jobs.price')),
        'totalEarned',
      ],
    ],
    group: ['profession'],
    where: { type: ProfileConstants.type.CONTRACTOR },
    include: [
      {
        model: ContractEntity,
        as: 'Contractor',
        attributes: [],
        include: [
          {
            model: JobEntity,
            as: 'Jobs',
            attributes: [],
            where: {
              paid: true,
              paymentDate: { [Op.between]: [startDate, endDate] },
            },
          },
        ],
      },
    ],
    order: [[sequelize.literal('totalEarned'), 'DESC']],
  })

  return bestProfession
}

async function findBestClients(since, to, limit) {
  const bestClients = await ProfileEntity.findAll({
    subQuery: false,
    attributes: [
      'id',
      [sequelize.fn('SUM', sequelize.col('Client.Jobs.price')), 'totalPaid'],
      [sequelize.literal("firstName || ' ' || lastName"), 'fullName'],
    ],
    group: ['Profile.id'],
    order: [[sequelize.col('totalPaid'), 'DESC']],
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

async function updateBalance(id, newAmount, transaction) {
  return await ProfileEntity.update(
    { balance: newAmount },
    {
      where: { id },
      transaction,
    }
  )
}

module.exports = {
  findById,
  findBestProfession,
  findBestClients,
  updateBalance,
}
