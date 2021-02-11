module.exports = (sequelize, Sequelize) => {
    const Config = sequelize.define("configs", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        otpActive: {
            type: Sequelize.INTEGER,
            defaultValue:0
        }
    });

    return Config;
};
