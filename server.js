
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require('cookie-parser')
var flash = require('connect-flash');
var session = require('express-session')
const app = express();
var moment = require('moment');








moment.locale('pt-br'); 
var corsOptions = {
  origin: "http://localhost:3000"
};

app.use(cors(corsOptions));


// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())
app.set('views', `${__dirname}/src/views`);
app.use(express.static(`${__dirname}/public`));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));



app.use(session({
  key: 'user_sid',
  secret: 'somerandonstuffs',
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: 24 * 60 * 60 * 1000 // 24 horas
  }
}));
app.use(flash());

app.use(function (req, res, next) {
  res.locals.message = req.flash();
  //para adicionar requisições locais va no arquivo auth.controller.js na linha 340
  //res.locals.user = req.session.user;
  res.locals.user = req.session.user;
  res.locals.email = req.session.email;

  res.locals.idciente = req.session.iduser;


  // res.locals.email="nando@nando.com.br"; // res.local.NOMEDAVARIVEL QUE VC VAI USAR COMO <%= NOMEDAVARIAVEL %>


  next();
});


// routes
require('./src/routes/auth.routes')(app);
require('./src/routes/user.routes')(app);
require('./src/routes/dashboard.routes')(app);
require('./src/routes/boleto.routes')(app);
require('./src/routes/exchange.routes.js')(app);
require('./src/routes/deposito.routes.js')(app);





// set port, listen for requests
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
