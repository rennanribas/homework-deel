module.exports = (sequelize) => {
  class Contract extends sequelize.Model {}

  Contract.init(
    {
      terms: {
        type: sequelize.TEXT,
        allowNull: false,
      },
      status: {
        type: sequelize.ENUM('new', 'in_progress', 'terminated'),
      },
    },
    {
      sequelize,
      modelName: 'Contract',
    }
  )

  return Contract
}
