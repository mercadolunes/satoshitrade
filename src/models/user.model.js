module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    username: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    pin: {
      type: Sequelize.STRING
    },
    token: {
      type: Sequelize.STRING,
      defaultValue: null
    },
    otp: {
      type: Sequelize.STRING,
      defaultValue: null
    },
    urlotp: {
      type: Sequelize.STRING,
      defaultValue: null
    }

  });

  return User;
};
