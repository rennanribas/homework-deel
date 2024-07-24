module.exports = (sequelize) => {
  class Profile extends sequelize.Model {}

  Profile.init(
    {
      firstName: {
        type: sequelize.STRING,
        allowNull: false,
      },
      lastName: {
        type: sequelize.STRING,
        allowNull: false,
      },
      profession: {
        type: sequelize.STRING,
        allowNull: false,
      },
      balance: {
        type: sequelize.DECIMAL(12, 2),
      },
      type: {
        type: sequelize.ENUM('client', 'contractor'),
      },
      role: {
        type: sequelize.ENUM('admin', 'user'),
        allowNull: false,
        defaultValue: 'user',
      },
    },
    {
      sequelize,
      modelName: 'Profile',
    }
  )

  return Profile
}
