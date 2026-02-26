module.exports = (Sequelize, sequelize, DataTypes) => {
  return sequelize.define(
    "userTable",
    {
      ...require("./core")(Sequelize, DataTypes),
      firstName: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      role: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      deviceToken: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      otp: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      otpVerify: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1, //1 for not verified 2 for verified
      },
      passCode: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 12345,
      },
      phoneNumber: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      countryCode: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      step: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0, //1 for login,2 while otpsend
      },
      socketId: {
        type: DataTypes.STRING(225),
        allowNull: true,
      }
    },
    {
      tableName: "userTable",
    },
  );
};
