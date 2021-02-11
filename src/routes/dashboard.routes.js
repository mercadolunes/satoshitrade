const { authJwt } = require("../middleware");
const controller = require("../controller/dashboard.controller");
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
    "/dashboard/:coin",
    [authJwt.verifyToken, authJwt.isUser],
    controller.dashboard
  );



  





  app.get(
    "/dashboard/*",
    [authJwt.verifyToken, authJwt.isUser],
    controller.dashboard
  );







};
