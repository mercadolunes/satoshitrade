const db = require("../models");
const nodemailer = require('nodemailer')

const User = db.user;
const Role = db.role
const Otp = db.otp;
const Config = db.config;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const twoFactor = require('node-2fa');

// var tempologin = process.env.TEMPO_LOGIN_MINUTOS * 60000 / 1 //calcula tempo de expiração login

exports.signup = (req, res) => {
  // Save User to Database
  User.create({
    username: req.body.username,
    email: req.body.email,
    pin: bcrypt.hashSync(req.body.pin, 8),



    password: bcrypt.hashSync(req.body.password, 8),
    otp: (req.body.token == '') ? null : req.body.token,
    urlotp: (req.body.urlotp == '') ? null : req.body.urlotp
    
  })
    .then(user => {

      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
            }
          }
        }).then(roles => {

          user.setRoles(roles).then(() => {
            req.flash('info', {
              title: "Cadastro!",
              type: "success",
              msg: "Cadastro Realizado com sucesso!!"
            })
            res.redirect('back')
          });
        });
      } else {

        user.setRoles([0]).then(() => {
          req.flash('info', {
            title: "Cadastro!",
            type: "success",
            msg: "Cadastro Realizado com sucesso!!"
          })
          res.redirect('back')
        });

        //enviar email de cadastro realizado com sucesso
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        });
      
        transporter.sendMail({
          from:"Cadastro realizado com sucesso <planaltek20@gmail.com>",
          to: req.body.email,
          subject: "Cadastro Realizado com sucesso",
          text: "teste",
          html: 
            `
            // aqui vc coloca um código html
            `
        });


      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.getUser = (req, res) => {
  let { username } = req.body
  User.findOne({
    where: { username: username }
  }).then(user => {
    if (user) {
      return res.json(user)
    } else {
      return res.json(user)
    }
  });
};

exports.logout = (req, res) => {

  res.status(200).clearCookie('x-access-token', {
    path: '/'
  });
  res.clearCookie("user");
  req.session.destroy(function (err) {
    res.redirect('/');
  });
};
// faz o update da senha

exports.reset = (req, res) => {
  let { userId, password, token } = req.body;

  User.findOne({
    where: { id: parseInt(userId) }
  }).then(user => {

    if (user != null) {
      if (user.token != null && user.token == token) {
        User.update(
          {
            password: bcrypt.hashSync(password, 8),
            token: null
          },
          { where: { id: userId } }
        )
          .then(rows => {
            req.flash('info', {
              title: "REDEFINIÇÃO DE SENHA!",
              type: "success",
              msg: "a sua senha foi alterada, você já pode fazer login"
            })
            return res.redirect('/')
          })
      } else {
        req.flash('info', {
          title: "ERRO TOKEN",
          type: "warning",
          msg: "esse token já foi usado, solicite um novo link para redefini sua senha!"
        })
        return res.redirect('back')
      }
    } else {
      req.flash('info', {
        title: "ERRO USER",
        type: "danger",
        msg: " o usuário não foi encontrado na nossa base de dados"
      })
      return res.redirect('back')
    }
  });
};

// enviar o email com link
exports.forgot = async (req, res) => {

  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(user => {
      console.log(user)
      if (user != null) {
        const token = jwt.sign({ id: user.id }, process.env.SECRET_JWT, {
          expiresIn: 60000 // expires in 10min
        });
        const url = `${req.protocol}://${req.headers.host}/reset/${token} `
        
       
        const transport = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        });
        



        // Define informações pertinentes ao E-mail que será enviado
        const mailOptions = {
          from: process.env.SMTP_USER, // linha alterada
          to: req.body.email,
          subject: 'Alteração de Senha',
          html: `<table width="100%"><tbody><tr>` +
            `<td align="center" style="background-color:#F8F9F9"> <img src="https://www.ecmsp.co.uk/wp-content/uploads/locks-230x115.jpg" alt="email" width="230" height="115">` +
            `</td> </tr></tbody></table></td></tr> <tr><td align="center"><table> <tbody><tr><td>` +
            `<p><b>Olá ${user.username}</b>,</p> <p>Foi solicitado uma redefinição de senha</p><p>se você reconhecer essa solicitação por favor</p> <a href=' ${url}'>Click aqui</a>` +
            ' </br> obs: o link expira em 10 minutos' +
            `</td> </tr></tbody></table></td></tr> </tbody></table>`

        }

        transport.sendMail(mailOptions, (err, info) => {

          if (err) {
            req.flash('info', {
              title: "ERRO EMAIL!",
              type: "danger",
              msg: `ocorreu um erro ao enviar o email ${err.message} por favor tente novamente mais tarde`
            })
            return res.redirect('back');
          } else {
            req.flash('info', {
              title: "SUCESSO!",
              type: "success",
              msg: `um link para redefinição de senha foi enviado para: ${req.body.email} por favor verifique seu email. obs: o email pode cair na caixa de spam.`
            })
            User.update(
              { token: token },
              { where: { email: req.body.email } }
            )
            return res.redirect('back');
          }
        })
      } else {
        req.flash('info', {
          title: "ERRO EMAIL!",
          type: "danger",
          msg: `O ${req.body.email}  não existe na nossa base de dados.`
        })
        return res.redirect('back');
      }
    });
};

exports.lembrasenha = (req, res) => {
  // res.render('resetsenha', { name: req.body.username })
  res.render('auth/resetsenha', { name: req.body.username })


};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(user => {
      // verificar se o user existe
      if (!user) {
        req.flash('info', {
          title: "ERRO USER!",
          type: "danger",
          msg: "Credenciais invalidas"
        })
        return res.redirect('back')

      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      // verificar se o password ta ok
      if (!passwordIsValid) {
        req.flash('info', {
          title: "ERRO USER!",
          type: "danger",
          msg: "Credenciais invalidas"
        })

        return res.redirect('back')
      }
      //  verifica se  o 2fa está ativo
      Config.findOne({
        where: {
          otpActive: 1
        }
      }).then(config => {
        if (config) {

          if (user.otp != null) {
            // válidar codiog 2fa
            let code = req.body.twofa
            let secret = user.otp;

            let result2fa = twoFactor.verifyToken(secret, code);
            if (result2fa != null) {
              if (result2fa.delta != 0) {
                req.flash('info', {
                  title: "ERRO 2FA!",
                  type: "warning",
                  msg: "o código 2fa digitado não é valido"
                })
                return res.redirect('back')
              }

            } else {
              req.flash('info', {
                title: "ERRO 2FA!",
                type: "danger",
                msg: "Código  2fa invalido"
              })
              return res.redirect('back')
            }
            // se não tiver secret 2fa
          } else {
            req.flash('info', {
              title: "ERRO 2FA!",
              type: "danger",
              msg: `usuario não possuir 2fa <a href="#" onclick="getFA();">click aqui para gerar o código</a>`
            })
            return res.redirect('back')
          }
        }
      })

      var token = jwt.sign({ id: user.id }, process.env.SECRET_JWT, {
        expiresIn: 3000 // quantidade em segundos que dá o total de 24 horas
      });

      var authorities = [];
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        //res.set("Content-Type", "application/json");
        let options = {
          path: "/",
          sameSite: true,
          maxAge: 600000, // Expira Login
          httpOnly: true, // The cookie only accessible by the web server
        }

        res.cookie('x-access-token', token, options)
        res.cookie('user', user.username)
        
        
        if (authorities == 'ROLE_USER') {
          // req.session.user = user.dataValues; pega todo os valores do user

          
          req.session.user = user.username;
          req.session.email = user.email;
          req.session.iduser = user.id;
          // req.session.senhausuario = user.password;

          res.redirect('/exchange/btc')
        } else {
          res.redirect('/admin')
        }
      });
      var emailusuario = req.session.email;

      //envia email logado com sucesso
      const transporter = nodemailer.createTransport({
        
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
    
      transporter.sendMail({
        from:"Login Realizado com sucesso!",
        // to: "fernando.ffw@gmail.com",
        // to: user.email,
        to: "nulo@gmail.com",
        subject: "Login realizado com sucesso",
        text: "teste",
        html: 
          `
          // <b>Olá ${user.username}</b>
    
          `
      });

    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};
