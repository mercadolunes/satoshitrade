const { authJwt } = require("../middleware");
const controller = require("../controller/exchange.controller");
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
    "/exchange/btc",
    [authJwt.verifyToken, authJwt.isUser],
    controller.bitcoin
  );

  app.get(
    "/exchange/doge",
    [authJwt.verifyToken, authJwt.isUser],
    controller.dogecoin
  );

  app.get(
    "/exchange/dgb",
    [authJwt.verifyToken, authJwt.isUser],
    controller.digibyte
  );

  app.get(
    "/exchange/pivx",
    [authJwt.verifyToken, authJwt.isUser],
    controller.pivx
  );



  app.post(
    "/exchange/:coin",
    [authJwt.verifyToken, authJwt.isUser],
    controller.save
  );
  app.get(
    "/exchange/",
    [authJwt.verifyToken, authJwt.isUser],
    controller.redirect
  );

  app.get(
    "/exchange/*",
    [authJwt.verifyToken, authJwt.isUser],
    controller.redirect
  );
};
