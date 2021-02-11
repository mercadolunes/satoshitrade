const jwt = require("jsonwebtoken");
const moment = require("moment");
const db = require("../models");
const User = db.user;

verifyToken = (req, res, next) => {
  let token = req.cookies['x-access-token'];
  if (!token) {
    return res.redirect('/')
  }
  jwt.verify(token,  process.env.SECRET_JWT, (err, decoded) => {
    if (err) {
      console.log(err)
      return res.redirect('/')
    }
    req.userId = decoded.id;
    next();
  });
};
verifyTokenParams = (req, res, next) => {
  let token = req.params.token;

  if (!token) {
    req.flash('info', {
      title: "ERRO TOKEN!",
      type: "danger",
      msg: "Token não definido"
    })
    next();
  }
  jwt.verify(token, process.env.SECRET_JWT, (err, decoded) => {

    if (err) {
      if (err.message == 'jwt expired') {
        let formattedDate = moment(err.expiredAt).format('DD-MM-YYYY HH:mm');
        req.flash('info', {
          title: "TOKEN ",
          type: "danger",
          msg: `Expirado em: ${formattedDate}, solicite um novo link para redefinição de senha `
        })
      } else {
        req.flash('info', {
          title: "ERRO TOKEN ",
          type: "danger",
          msg: `não foi possivel decodificar o token, TOKEN INVALIDO `
        })
      }
      next();
    } else {
      req.body.userId = decoded.id;
      next();
    }

  });


};

isAdmin = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "admin") {
          next();
          return;
        }
      }

      return res.redirect('/')
    });
  });
};

isUser = (req, res, next) => {
  console.log(req)
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "user") {
          next();
          return;
        }
      }

      return res.redirect('/')
    });
  });
};

isUserOrAdmin = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "user") {
          next();
          return;
        }

        if (roles[i].name === "admin") {
          next();
          return;
        }
      }

      return res.redirect('/')
    });
  });
};

const authJwt = {
  verifyToken: verifyToken,
  verifyTokenParams: verifyTokenParams,
  isAdmin: isAdmin,
  isUser: isUser,
  isUserOrAdmin: isUserOrAdmin
};
module.exports = authJwt;
