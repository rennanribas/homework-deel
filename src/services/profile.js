const { ProfileConstants, JobConstants } = require('../constants')
const ProfileRepository = require('../repositories/profile')
const JobRepository = require('../repositories/job')
const sequelize = require('../entities/config')
const {
  AmountBiggerThanRatioError,
  NotFoundError,
  ExceedsFundsError,
} = require('../errors')

const findBestProfession = async (since, to) => {
  const queryResult = await ProfileRepository.findBestProfession(since, to)

  if (!queryResult || queryResult.length === 0) {
    throw new NotFoundError('No results found')
  }

  return queryResult[0]
}

const findBestClients = async (since, to, limit = 2) => {
  const queryResult = await ProfileRepository.findBestClients(since, to, limit)

  if (!queryResult || queryResult.length === 0) {
    throw new NotFoundError('No results found')
  }

  return queryResult
}

const transferBalance = async (
  profileSender,
  receiverId,
  amount,
  transactionOption
) => {
  const profileReceiver = await ProfileRepository.findById(
    receiverId,
    transactionOption
  )

  if (profileSender.balance < amount) {
    throw new ExceedsFundsError('No balance enough to make this transfer')
  }
  const newBalanceSender = profileSender.balance - amount
  const newBalanceReceiver = profileReceiver.balance + amount

  const updatedSender = await ProfileRepository.updateBalance(
    profileSender.id,
    newBalanceSender,
    transactionOption.transaction
  )
  const updatedReceiver = await ProfileRepository.updateBalance(
    receiverId,
    newBalanceReceiver,
    transactionOption.transaction
  )

  return { updatedSender, updatedReceiver }
}

const handleDeposit = async (profile, toId, amount) => {
  const t = await sequelize.transaction()
  try {
    const transactionOption = { transaction: t, lock: t.LOCK.UPDATE }

    if (profile.type === ProfileConstants.type.CLIENT) {
      const debt = await JobRepository.getClientBalance(
        profile.id,
        transactionOption
      )
      if (debt * JobConstants.maxPercentage < amount) {
        throw new AmountBiggerThanRatioError('Amount is bigger than debt ratio')
      }
    }

    await transferBalance(profile.id, toId, amount, transactionOption)
    await t.commit()

    const result = await profile.reload()

    return result
  } catch (error) {
    await t.rollback()
    throw error
  }
}

module.exports = {
  findBestProfession,
  findBestClients,
  handleDeposit,
  transferBalance,
}
