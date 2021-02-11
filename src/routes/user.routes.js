const { authJwt } = require("../middleware");
const controller = require("../controller/user.controller");
const db = require("../models");
const Config = db.config;

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.get("/", (req, res) => {
    Config.findOne({ where: { otpActive: 0 } })
      .then(otp => {
        let active;
        (otp == null) ? active = 1 : active = 0
        res.render('login', { otpActive: active });
      });

  });
  app.get("/register", (req, res) => {
    Config.findOne({ where: { otpActive: 0 } })
      .then(otp => {
        let active;
        (otp == null) ? active = 1 : active = 0
        console.log(active)
        res.render('register', { otpActive: active });
      });

  });
  
  app.get("/api/test/all", controller.allAccess);

  app.get(
    "/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );
  app.get(
    "/reset/:token",
    authJwt.verifyTokenParams,
    controller.forgotBoard
  );








};
