const Job = require('./job')
const Contract = require('./contract')
const Profile = require('./profile')

Profile.hasMany(Contract, { as: 'Contractor', foreignKey: 'ContractorId' })
Contract.belongsTo(Profile, { as: 'Contractor' })
Profile.hasMany(Contract, { as: 'Client', foreignKey: 'ClientId' })
Contract.belongsTo(Profile, { as: 'Client' })
Contract.hasMany(Job)
Job.belongsTo(Contract)

const entities = {
  Job,
  Contract,
  Profile,
}

module.exports = entities
