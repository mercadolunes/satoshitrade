
// database
const db = require("./src/models");
const bcrypt = require("bcryptjs");
const Role = db.role;
const AdminUser = db.user
const ConfigOtp = db.config;

db.sequelize.sync();
// force: true will drop the table if it already exists
db.sequelize.sync({ force: true }).then(() => {
    console.log('Drop and Resync Database with { force: true }');
    initialRoles();
    setTimeout(() => {
        initialAdmin();
        ConfigOtp.create({
            id: 1,
            otpActive: 0

        })
    }, 2000);

});
// essa function cadastra as roles de acessos admin e user
function initialRoles() {
    Role.create({
        id: 0,
        name: "user"
    });

    Role.create({
        id: 1,
        name: "admin"
    });
}
// essa function cadastra um adm
function initialAdmin() {
    AdminUser.create({
        username: "fernandoffw",
        email: "fernando.ffw@gmail.com",
        password: bcrypt.hashSync('123456', 8),
        pin:bcrypt.hashSync('123456', 8),
    })


    
        .then(user => {
            // user role = 1 admin
            user.setRoles([0]);
        })

}