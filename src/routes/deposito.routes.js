const { authJwt } = require("../middleware");
const controller = require("../controller/deposito.controller");
const db = require("../models");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.get(
    "/wallet/",
    [authJwt.verifyToken, authJwt.isUser],
    controller.index
  );
  


  app.get(
    "/wallet/deposito/brl",
    [authJwt.verifyToken, authJwt.isUser],
    controller.fiat
  );
  







};
