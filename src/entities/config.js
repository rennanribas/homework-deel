import Sequelize from 'sequelize'

export const sequelizeConfig = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite3',
})
