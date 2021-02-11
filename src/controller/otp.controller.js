
const twoFactor = require('node-2fa');
const db = require("../models");
const Config = db.config;
module.exports = {
    async  configOTP(req, res) {
        let optionsRadios = req.body.optionsRadios;
        let option;
        (optionsRadios == 'option1') ? option = 1 : option = 0;

        Config.update(
            {
                otpActive: option
            },
            { where: { id: 1 } }
        )
            .then(result => {
                req.flash('info', {
                    title: "SUCESSO!",
                    type: "success",
                    msg: "Dados salvos com sucesso!"
                });
                res.redirect('back')
            })
            .catch(err => {
                req.flash('info', {
                    title: "SUCESSO!",
                    type: "danger",
                    msg: "Erro ao salvar dados!"
                });
                res.redirect('back')
            });
    },
    async getFA(req, res) {

        var newSecret = twoFactor.generateSecret({ name: 'teste', account: req.body.email });
        return res.json(newSecret)
    },
    async getFA2(req, res) {
        User.findOne({
            where: {
                username: req.body.username
            }
        })
            .then(user => {

                if (user) {
                    const newSecret = twoFactor.generateSecret({ name: 'teste', account: user.email });
                    return res.json(newSecret)
                } else {
                    return res.json('null')
                }

            });

    },
    async updateFA(req, res) {
        User.findOne({
            where: {
                username: req.body.username
            }
        })
            .then(user => {
                console.log(user)
                if (user) {
                    User.update(
                        {
                            otp: req.body.secret,
                            urlotp: req.body.urlotp
                        },
                        { where: { id: user.id } }
                    )
                        .then(result =>
                            res.json(result)
                        )
                        .catch(err =>
                            res.json(err.message)
                        )
                } else {
                    return res.json('null')
                }

            });

    },
    async verifyFA(req, res) {
        let { secret, code } = req.body;
        console.log(secret, code)
        let result = twoFactor.verifyToken(secret, code);
        if (result != null) {
            return res.json(result.delta)
        } else {
            return res.json(result)
        }

    }
};
