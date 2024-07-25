const { ProfileConstants, JobConstants } = require('../constants')
const { ProfileEntity: Profile, JobEntity: Job } = require('../entities')
const { sequelizeConfig } = require('../entities/config')
const {
  AmountBiggerThanRatioError,
  SelfDepositError,
  NotFoundError,
  InsufficientFundsError,
} = require('../controllers/errorHandling')

const queryBestProfession = async (since, to) => {
  const queryResult = await ProfileEntity.getBestProfession(since, to)

  if (!queryResult || queryResult.length === 0) {
    throw new NotFoundError('No results found')
  }

  return queryResult[0]
}

const queryBestClients = async (since, to, limit = 2) => {
  const queryResult = await ProfileEntity.getBestClients(since, to, limit)

  if (!queryResult || queryResult.length === 0) {
    throw new NotFoundError('No results found')
  }

  return queryResult
}

const executeTransfer = async (fromId, toId, amount, transactionOption) => {
  const from = await ProfileEntity.getById(fromId, transactionOption)
  const to = await ProfileEntity.getById(toId, transactionOption)

  if (!from || !to) {
    throw new NotFoundError('Profile not found')
  }

  if (from.balance < amount) {
    throw new InsufficientFundsError('Insufficient funds')
  }

  await from.sendPayment(amount, transactionOption)
  await to.receivePayment(amount, transactionOption)
}

const makeDeposit = async (profile, toId, amount) => {
  const t = await sequelizeConfig.transaction()
  try {
    const transactionOption = { transaction: t, lock: t.LOCK.UPDATE }

    if (profile.type === ProfileConstants.type.CLIENT) {
      const debt = await JobEntity.getClientDebt(profile.id, transactionOption)
      if (debt * JobConstants.maxPercentage < amount) {
        throw new AmountBiggerThanRatioError('Amount is bigger than debt ratio')
      }
    }

    if (profile.id === toId) {
      throw new SelfDepositError('Cannot deposit to yourself')
    }

    await executeTransfer(profile.id, toId, amount, transactionOption)
    await t.commit()

    const result = await profile.reload()

    return result
  } catch (error) {
    await t.rollback()
    throw error
  }
}

module.exports = { queryBestProfession, queryBestClients, makeDeposit }
