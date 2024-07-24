module.exports = (sequelize) => {
  class Job extends sequelize.Model {}

  Job.init(
    {
      description: {
        type: sequelize.TEXT,
        allowNull: false,
      },
      price: {
        type: sequelize.DECIMAL(12, 2),
        allowNull: false,
      },
      paid: {
        type: sequelize.BOOLEAN,
        default: false,
      },
      paymentDate: {
        type: sequelize.DATE,
      },
    },
    {
      sequelize,
      modelName: 'Job',
    }
  )

  return Job
}
