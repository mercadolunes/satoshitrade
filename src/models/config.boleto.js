module.exports = (sequelize, Sequelize) => {
    const Boleto = sequelize.define("tbboleto", {
      codigotransacao: {
        type: Sequelize.STRING,
        allowNull: false
      },
      datapagamento: {
        type: Sequelize.STRING,
        allowNull: false
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false
      }









      
    });
  
    return Boleto;
  };
  