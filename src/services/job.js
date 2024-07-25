const JobEntity = require('../entities/job')
const ContractEntity = require('../entities/contract')
const { ProfileConstants, ContractConstants } = require('../constants')
const { sequelizeConfig } = require('../entities/config')
const { executeTransfer } = require('./profile')
const {
  JobNotFoundError,
  ProfileIsNotClientError,
  ProfileIsNotJobClient,
  JobAlreadyPaidError,
} = require('../controllers/errorHandling')

const getUnpaidJobsByProfile = async (profileId) => {
  const clientJob = JobEntity.unpaidWithFilter({
    include: {
      model: ContractEntity,
      where: {
        ClientId: profileId,
        status: ContractConstants.type.IN_PROGRESS,
      },
    },
  })

  const contractorJob = JobEntity.unpaidWithFilter({
    include: {
      model: ContractEntity,
      where: {
        ContractorId: profileId,
        status: ContractConstants.type.IN_PROGRESS,
      },
    },
  })

  const jobs = await Promise.all([clientJob, contractorJob])

  return jobs.flat()
}

const makePayment = async (jobId, profile) => {
  const t = await sequelize.transaction()
  try {
    const transactionOption = { transaction: t, lock: t.LOCK.UPDATE }
    const job = await JobEntity.getById(jobId, transactionOption)

    if (!job) throw new JobNotFoundError('Job not found')
    if (profile.type !== ProfileConstants.type.CLIENT)
      throw new ProfileIsNotClientError('Profile is not client')
    if (job.Contract.ClientId !== profile.id)
      throw new ProfileIsNotJobClient('Profile is not job client')
    if (job.paid) throw new JobAlreadyPaidError('Job already paid')

    await executeTransfer(
      job.Contract.ClientId,
      job.Contract.ContractorId,
      job.price,
      transactionOption
    )

    await job.pay(transactionOption)
    await t.commit()

    return job
  } catch (error) {
    await t.rollback()
    throw error
  }
}

module.exports = { getUnpaidJobsByProfile, makePayment }
