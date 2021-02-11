const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;
const Config = db.config;

checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Username
  User.findOne({
    where: {
      username: req.body.username
    }
  }).then(user => {
    if (user) {
      req.flash('info', {
        title: "Erro username!",
        type: "warning",
        msg: "o usuário " + req.body.username + " já está cadastrado na nossa base de dados"
      })
      res.redirect('back')
      return;
    }

    // Email
    User.findOne({
      where: {
        email: req.body.email
      }
    }).then(user => {
      if (user) {
        req.flash('info', {
          title: "Erro email!",
          type: "warning",
          msg: "o email " + req.body.email + " já está cadastrado na nossa base de dados"
        })
        res.redirect('back')
        return;
      }

      next();
    });
  });
};

checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: "Failed! Role does not exist = " + req.body.roles[i]
        });
        return;
      }
    }
  }

  next();
};
checkTokenOtp = (req, res, next) => {
  let token = req.body.tokenvalid
  Config.findOne({ where: { otpActive: 0 } })
    .then(otp => {
      let active;
      (otp == null) ? active = 1 : active = 0
      if (token == 'false' && active) {
        req.flash('info', {
          title: "ERRO 2FA!",
          type: "warning",
          msg: "2fa não verificado, é preciso verificar a autenticação de dois fatores "
        })
        return res.redirect('back')
      } else {
        next()
      }

    });

};
checkTokenOtp2 = (req, res, next) => {
  User.findOne({ where: { username: req.body.username } })
    .then(user => {
      Config.findOne({ where: { otpActive: 0 } })
        .then(otp => {
          let active;
          (otp == null) ? active = 1 : active = 0
          if (!active && user.otp == null) {
            req.flash('info', {msg:'token'})
            return res.redirect('back')
          } else {
            next()
          }

        });
    });

};

const verifySignUp = {
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
  checkRolesExisted: checkRolesExisted,
  checkTokenOtp: checkTokenOtp,
  checkTokenOtp2: checkTokenOtp2
};

module.exports = verifySignUp;
