const express = require('express')
const bodyParser = require('body-parser')
const { sequelize } = require('./model')
const { getProfile } = require('./middleware/getProfile')
const app = express()
const { Op, Transaction } = require('sequelize')

app.use(bodyParser.json())
app.set('sequelize', sequelize)
app.set('models', sequelize.models)

async function withTransaction(callback) {
  const t = await sequelize.transaction()
  try {
    const result = await callback(t)
    await t.commit()
    return result
  } catch (error) {
    await t.rollback()
    throw error
  }
}

function handleAsyncErrors(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res, next)
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'An error occurred.' })
    }
  }
}

/**
 * @returns contract by id
 */
app.get(
  '/contracts/:id',
  getProfile,
  handleAsyncErrors(async (req, res) => {
    const { Contract } = req.app.get('models')
    const { id } = req.params
    const contract = await Contract.findOne({
      where: {
        id,
        [Op.or]: [
          { ContractorId: req.profile.id },
          { ClientId: req.profile.id },
        ],
      },
    })

    if (!contract) return res.status(404).end()
    res.json(contract)
  })
)

/**
 * @returns all non terminated contracts
 */
app.get(
  '/contracts',
  getProfile,
  handleAsyncErrors(async (req, res) => {
    const { Contract } = req.app.get('models')
    const profileId = req.profile.id

    const contracts = await Contract.findAll({
      where: {
        [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }],
        status: { [Op.ne]: 'terminated' },
      },
    })

    if (contracts.length === 0)
      return res.status(404).json({ message: 'No active contracts found' })

    return res.json(contracts)
  })
)

/**
 * @returns all unpaid jobs
 */
app.get(
  '/jobs/unpaid',
  getProfile,
  handleAsyncErrors(async (req, res) => {
    const { Job, Contract } = req.app.get('models')
    const profileId = req.profile.id

    const unpaidJobs = await Job.findAll({
      where: { paid: false },
      include: [
        {
          model: Contract,
          where: {
            status: { [Op.ne]: 'terminated' },
            [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }],
          },
        },
      ],
    })

    if (!unpaidJobs || unpaidJobs.length === 0)
      return res
        .status(404)
        .json({ message: 'No unpaid jobs found for active contracts.' })

    return res.json(unpaidJobs)
  })
)

/**
 * Pay for a job. It allows to pay for a job if the balance is greater than or equal to the job's price.
 * The specified amount is transferred from the client's balance to the contractor's balance and the job is marked as paid.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response object with a status and a message
 */
app.post(
  '/jobs/:job_id/pay',
  getProfile,
  handleAsyncErrors(async (req, res) => {
    const { Job, Contract, Profile } = req.app.get('models')
    const jobId = req.params.job_id
    const profile = req.profile

    await withTransaction(async (t) => {
      const job = await Job.findOne({
        where: { id: jobId },
        include: Contract,
        transaction: t,
        lock: t.LOCK.UPDATE,
      })

      if (
        !job ||
        job.paid ||
        job.Contract.ClientId !== profile.id ||
        profile.balance < job.price
      ) {
        throw new Error('Unable to process the payment.')
      }

      const contractor = await Profile.findByPk(job.Contract.ContractorId, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      })
      const client = await Profile.findByPk(profile.id, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      })

      await client.update(
        { balance: profile.balance - job.price },
        { transaction: t }
      )
      await contractor.update(
        { balance: contractor.balance + job.price },
        { transaction: t }
      )
      await job.update(
        { paid: true, paymentDate: new Date() },
        { transaction: t }
      )

      res.status(200).json({ message: 'Payment successful.' })
    })
  })
)

/**
 * Deposits money into a client's balance.
 * A client can't deposit more than 25% of his total unpaid jobs
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response object with a status and message
 */
app.post(
  '/balances/deposit/:userId',
  getProfile,
  handleAsyncErrors(async (req, res) => {
    const { Job, Profile, Contract } = req.app.get('models')
    const userId = req.params.userId
    const profile = req.profile

    if (profile.id.toString() !== userId) {
      return res.status(403).json({
        message: 'You are not authorized to deposit into this balance.',
      })
    }

    await withTransaction(async (t) => {
      const totalUnpaidJobsAmount = await Job.sum('price', {
        where: { paid: false },
        include: [
          {
            model: Contract,
            where: { ClientId: userId, status: { [Op.ne]: 'terminated' } },
            attributes: [],
          },
        ],
        transaction: t,
      })

      const maxDepositAllowed = totalUnpaidJobsAmount * 0.25
      const depositAmount = req.body.amount

      if (depositAmount > maxDepositAllowed) {
        throw new Error(
          'You cannot deposit more than 25% of your total unpaid jobs.'
        )
      }

      const client = await Profile.findByPk(userId, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      })
      await client.update(
        { balance: sequelize.literal(`balance + ${depositAmount}`) },
        { transaction: t }
      )

      res.status(200).json({ message: 'Deposit successful.' })
    })
  })
)

/**
 * Returns the profession that earned the most money (sum of jobs paid)
 * for any contractor that worked within the specified time range.
 *
 * @returns Response object with a status and the best earning profession
 */
app.get(
  '/admin/best-profession',
  handleAsyncErrors(async (req, res) => {
    const { Job, Profile, Contract } = req.app.get('models')
    const startDate = req.query.start
    const endDate = req.query.end

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ message: 'Both start and end dates are required.' })
    }

    const bestProfession = await Job.findAll({
      where: {
        paid: true,
        paymentDate: { [Op.between]: [new Date(startDate), new Date(endDate)] },
      },
      include: [
        {
          model: Contract,
          attributes: [],
          include: [
            {
              model: Profile,
              attributes: ['profession'],
              as: 'Contractor',
            },
          ],
        },
      ],
      attributes: [
        [sequelize.fn('SUM', sequelize.col('price')), 'totalEarnings'],
        [sequelize.col('Contract.Contractor.profession'), 'profession'],
      ],
      group: ['Contract.Contractor.profession'],
      order: [[sequelize.fn('SUM', sequelize.col('price')), 'DESC']],
      limit: 1,
    })

    if (!bestProfession.length) {
      return res
        .status(404)
        .json({ message: 'No professions found in the specified time range.' })
    }

    return res.status(200).json(bestProfession[0])
  })
)

/**
 * @returns clients that paid the most in the given time frame
 */
app.get(
  '/admin/best-clients',
  handleAsyncErrors(async (req, res) => {
    const { start, end, limit = 2 } = req.query

    if (!start || !end) {
      return res.status(400).json({ error: 'Start and end dates are required' })
    }

    const startDate = new Date(start)
    const endDate = new Date(end)

    const { Job, Contract, Profile } = req.app.get('models')

    const jobs = await Job.findAll({
      attributes: [[sequelize.fn('SUM', sequelize.col('price')), 'totalPaid']],
      where: {
        paid: true,
        paymentDate: { [Op.between]: [startDate, endDate] },
      },
      include: [
        {
          model: Contract,
          attributes: ['ClientId'],
          include: {
            model: Profile,
            as: 'Client',
            attributes: ['id', 'firstName', 'lastName'],
          },
        },
      ],
      group: [
        'Contract.ClientId',
        'Contract.Client.id',
        'Contract.Client.firstName',
        'Contract.Client.lastName',
      ],
      order: [[sequelize.literal('totalPaid'), 'DESC']],
      limit: parseInt(limit),
    })

    const response = jobs.map((job) => ({
      id: job.Contract.Client.id,
      fullName:
        job.Contract.Client.firstName + ' ' + job.Contract.Client.lastName,
      paid: parseFloat(job.get('totalPaid')),
    }))

    return res.json(response)
  })
)

module.exports = app
