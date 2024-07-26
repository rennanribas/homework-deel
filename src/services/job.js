const JobRepository = require('../repositories/job')
const ContractEntity = require('../entities/contract')
const {
  Profile: ProfileConstants,
  Contract: ContractConstants,
} = require('../constants')
const sequelize = require('../entities/config')
const { transferBalance } = require('./profile')
const {
  NotFoundError,
  JobAlreadyPaidError,
  UnauthorizedError,
} = require('../errors')
const { Op } = require('sequelize')

const findUnpaidJobsByProfile = async (profile) => {
  console.log('profile', profile)
  const unpaidFilter = {
    include: {
      model: ContractEntity,
      where: {
        [profile.type === ProfileConstants.type.CLIENT
          ? 'ClientId'
          : 'ContractorId']: profile.id,
        status: ContractConstants.type.IN_PROGRESS,
      },
    },
  }

  const jobs = await JobRepository.findUnpaidJobs(unpaidFilter)

  return jobs
}

const updatePaymentJob = async (jobId, profile) => {
  const t = await sequelize.transaction()
  try {
    const transactionOption = { transaction: t, lock: t.LOCK.UPDATE }
    const job = await JobRepository.findById(jobId, transactionOption)

    if (!job) throw new NotFoundError('Job not found')
    if (profile.type !== ProfileConstants.type.CLIENT)
      throw new UnauthorizedError('Profile is not a client')
    if (job.Contract.ClientId !== profile.id)
      throw new UnauthorizedError('Profile is unauthorized to pay this job')
    if (job.paid) throw new JobAlreadyPaidError('Job already paid')

    await transferBalance(
      profile,
      job.Contract.ContractorId,
      job.price,
      transactionOption
    )

    await JobRepository.updateJobPayment(
      job.id,
      true,
      transactionOption.transaction
    )
    await t.commit()

    return { id: job.id, paid: true }
  } catch (error) {
    await t.rollback()
    throw error
  }
}

module.exports = { findUnpaidJobsByProfile, updatePaymentJob }
