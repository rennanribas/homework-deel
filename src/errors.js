class NotFoundError extends Error {
  constructor(message) {
    super(message)
    this.name = 'NotFoundError'
    this.status = 404
  }
}

class ContractMissingError extends Error {
  constructor(message) {
    super(message)
    this.name = 'ContractMissingError'
    this.status = 404
  }
}

class UnauthorizedError extends Error {
  constructor(message) {
    super(message)
    this.name = 'UnauthorizedError'
    this.status = 401
  }
}

class InvalidSelfDepositError extends Error {
  constructor(message) {
    super(message)
    this.name = 'InvalidSelfDepositError'
    this.status = 400
  }
}

class InvalidDateError extends Error {
  constructor(message) {
    super(message)
    this.name = 'InvalidDateError'
    this.status = 400
  }
}

class ExceedsFundsError extends Error {
  constructor(message) {
    super(message)
    this.name = 'ExceedsDebtRatioError'
    this.status = 400
  }
}

class JobAlreadyPaidError extends Error {
  constructor(message) {
    super(message)
    this.name = 'JobAlreadyPaidError'
    this.status = 400
  }
}

const handleError = (res, error) => {
  console.error(error)
  let statusCode = 500

  if (error instanceof Error) {
    statusCode = error.status
  }

  res.status(statusCode).json({
    error: error.message || 'Internal Server Error',
  })
}

module.exports = {
  NotFoundError,
  ContractMissingError,
  UnauthorizedError,
  InvalidSelfDepositError,
  ExceedsFundsError,
  handleError,
  JobAlreadyPaidError,
  InvalidDateError,
}
