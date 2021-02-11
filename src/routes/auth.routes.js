const { verifySignUp, authJwt, verifySignIn } = require("../middleware");
const controller = require("../controller/auth.controller");
const otpController = require('../controller/otp.controller')

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/register",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted,
      verifySignUp.checkTokenOtp
    ],
    controller.signup
  );

  app.post("/login", controller.signin);
  app.post("/configOTP", otpController.configOTP)
  app.post("/get2fa", otpController.getFA)
  app.post("/get2fa2", otpController.getFA2)
  app.post("/updat2fa", otpController.updateFA)
  app.post("/verify2fa", otpController.verifyFA)
  app.get("/logout", controller.logout)
  app.post("/reset/forgot", controller.forgot)
  app.post("/reset", controller.reset)

  app.post("/auth/user", controller.getUser)

};
