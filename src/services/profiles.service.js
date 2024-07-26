const { Profile: ProfileConstants, Job: JobConstants } = require('../constants')
const ProfileRepository = require('../repositories/profiles.repository')
const JobRepository = require('../repositories/jobs.repository')
const sequelize = require('../entities/config')
const {
  AmountBiggerThanRatioError,
  NotFoundError,
  ExceedsFundsError,
} = require('../errors')

const findBestProfession = async (startDate, endDate) => {
  const queryResult = await ProfileRepository.findBestProfession(
    startDate,
    endDate
  )

  if (!queryResult || queryResult.length === 0) {
    throw new NotFoundError('No results found')
  }

  return queryResult[0]
}

const findBestClients = async (startDate, endDate, limit = 2) => {
  const queryResult = await ProfileRepository.findBestClients(
    startDate,
    endDate,
    limit
  )

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

  if (!profileReceiver) {
    throw new NotFoundError('Receiver was not found')
  }

  if (profileSender.balance < amount) {
    throw new ExceedsFundsError('No balance enough to make this transfer')
  }
  const newBalanceSender = profileSender.balance - amount
  const newBalanceReceiver = profileReceiver.balance + amount

  await ProfileRepository.updateBalance(
    profileSender.id,
    newBalanceSender,
    transactionOption.transaction
  )
  await ProfileRepository.updateBalance(
    receiverId,
    newBalanceReceiver,
    transactionOption.transaction
  )

  return {
    updatedSender: profileSender.id,
    updatedReceiver: profileReceiver.id,
    amount: amount,
    newBalanceSender: newBalanceSender,
  }
}

const handleDeposit = async (profile, toId, amount) => {
  const t = await sequelize.transaction()
  try {
    const transactionOption = { transaction: t, lock: t.LOCK.UPDATE }

    if (profile.type === ProfileConstants.type.CLIENT) {
      const debt = await JobRepository.findClientBalance(
        profile.id,
        transactionOption
      )
      if (debt * JobConstants.maxPercentage < amount) {
        throw new AmountBiggerThanRatioError('Amount is bigger than debt ratio')
      }
    }

    const updateResult = await transferBalance(
      profile,
      toId,
      amount,
      transactionOption
    )
    await t.commit()

    return updateResult
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
