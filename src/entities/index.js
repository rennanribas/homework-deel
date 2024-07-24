import { sequelizeConfig } from './config'

const Job = require('./models/job')(sequelizeConfig)
const Contract = require('./models/contract')(sequelizeConfig)
const Profile = require('./models/profile')(sequelizeConfig)

Profile.hasMany(Contract, { as: 'Contractor', foreignKey: 'ContractorId' })
Contract.belongsTo(Profile, { as: 'Contractor' })
Profile.hasMany(Contract, { as: 'Client', foreignKey: 'ClientId' })
Contract.belongsTo(Profile, { as: 'Client' })
Contract.hasMany(Job)
Job.belongsTo(Contract)

const models = {
  Job,
  Contract,
  Profile,
}

module.exports = models
