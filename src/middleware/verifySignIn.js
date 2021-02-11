const db = require("../models");
const Config = db.config;
const User = db.user;

checkTwofa = (req, res, next) => {
    console.log(req.body)
    Config.findOne({ where: { otpActive: 1 } })
        .then(otp => {
            console.log(otp)
            if (otp) {
                User.findOne({
                    where: { username: req.body.username }
                }).then(user => {
                    if (user.otp == '') {
                        console.log('testeI')
                        req.flash('otp', '')
                        return res.redirect('back')
                    } else {
                        next();
                    }

                })
            } else {
                next()
            }
        });

};

const verifySignIn = {
    checkTwofa: checkTwofa
};

module.exports = verifySignIn;
