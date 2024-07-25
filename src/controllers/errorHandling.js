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

class ExceedsDebtRatioError extends Error {
  constructor(message) {
    super(message)
    this.name = 'ExceedsDebtRatioError'
    this.status = 400
  }
}

class JobNotLocatedError extends Error {
  constructor(message) {
    super(message)
    this.name = 'JobNotLocatedError'
    this.status = 404
  }
}

class UserNotClientError extends Error {
  constructor(message) {
    super(message)
    this.name = 'UserNotClientError'
    this.status = 400
  }
}

class JobClientMismatchError extends Error {
  constructor(message) {
    super(message)
    this.name = 'JobClientMismatchError'
    this.status = 400
  }
}

class JobAlreadySettledError extends Error {
  constructor(message) {
    super(message)
    this.name = 'JobAlreadySettledError'
    this.status = 400
  }
}

module.exports = {
  UnauthorizedError,
  ContractMissingError,
  InvalidSelfDepositError,
  ExceedsDebtRatioError,
  JobNotLocatedError,
  UserNotClientError,
  JobClientMismatchError,
  JobAlreadySettledError,
}
