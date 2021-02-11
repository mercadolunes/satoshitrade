module.exports = (sequelize, Sequelize) => {
    const orderexchange = sequelize.define("tbordertrade", {
      iduser: {
        type: Sequelize.STRING,
        allowNull: false
      },
      idtransaction: {
        type: Sequelize.STRING,
        allowNull: false
      },
      idorder: {
        type: Sequelize.STRING,
        allowNull: false
      },
      dataorder: {
        type: Sequelize.STRING,
        allowNull: false
      },
      coin: {
        type: Sequelize.STRING,
        allowNull: false
      },
      market: {
        type: Sequelize.STRING,
        allowNull: false
      },
      totalcoin: {
        type: Sequelize.STRING,
        allowNull: false
      },      totalfiat: {
        type: Sequelize.STRING,
        allowNull: false
      },
      cota: {
        type: Sequelize.STRING,
        allowNull: false
      },
      totalfiat: {
        type: Sequelize.STRING,
        allowNull: false
      },
      tipoorder: {
        type: Sequelize.STRING,
        allowNull: false
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false
      }

      
    });
  
    return orderexchange;
  };
  