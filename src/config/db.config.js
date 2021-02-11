module.exports = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: "Timer100",
  DB: "sheepbit",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};



// module.exports = {
//   HOST: "45.175.244.51",
//   USER: "bethertr_sheepbituser01",
//   PASSWORD: "@Timer100",
//   DB: "bethertr_sheepbit",
//   dialect: "mysql",
//   pool: {
//     max: 5,
//     min: 0,
//     acquire: 30000,
//     idle: 10000
//   }
// };
