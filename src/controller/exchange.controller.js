var { compareAsc, format}  =  require('date-fns');
const shortid = require('shortid');
const {v4 : uuidv4} = require('uuid')
const db = require("../models");
const dborderexchange = db.orderexchange;

exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
};

var pricebitcoin = "500";
var priceniobiocash = "0,02";
var pricedogecoin = "0,31";
var pricedigibyte = "0,28";







exports.bitcoin = (req, res) => {
  var dados = {
    label : "Bitcoin",
    price:pricebitcoin,
    ticker: "btc",
    
  }

  dborderexchange.findAll({raw:true,limit: 5, order:[['dataorder','DESC']],where:{coin: dados.ticker, iduser: isNaN(res.locals.idciente)}}).then(orders => {
    res.render('dashboard/exchange/index', { orders:orders, dados, name: req.body.username, teste: res.locals.email })
  });

};


exports.dogecoin = (req, res) => {
  var dados = {
    label : "Dogecoin",
    price:pricedogecoin,
    ticker: "DOGE",
    
  }

  dborderexchange.findAll({raw:true, limit: 5,order:[['dataorder','DESC']],where:{coin: dados.ticker, iduser: isNaN(res.locals.idciente)}}).then(orders => {
    res.render('dashboard/exchange/index', { orders:orders, dados, name: req.body.username, teste: res.locals.email })
  });
};

exports.digibyte = (req, res) => {
  var dados = {
    label : "Digibyte",
    price:pricedigibyte,
    ticker: "DGB",
    
  }

  dborderexchange.findAll({raw:true, limit: 5,order:[['dataorder','DESC']],where:{coin: dados.ticker, iduser: isNaN(res.locals.idciente)}}).then(orders => {
    res.render('dashboard/exchange/index', { orders:orders, dados, name: req.body.username, teste: res.locals.email })
  });
};


exports.pivx = (req, res) => {
  var dados = {
    label : "Pivx",
    price:pricedigibyte,
    ticker: "PIVX",
    
  }

  dborderexchange.findAll({raw:true, limit: 5,order:[['dataorder','DESC']],where:{coin: dados.ticker, iduser: isNaN(res.locals.idciente)}}).then(orders => {
    res.render('dashboard/exchange/index', { orders:orders, dados, name: req.body.username, teste: res.locals.email })
  });
};






exports.save = (req, res)=>{
var idclient = isNaN(res.locals.idciente);
var idtransaction = uuidv4();
var idorder = shortid.generate();
var dataatual = Date.now();
var dataorder= format(new Date(dataatual), 'dd-MM-yyyy');
// var totalbrl = req.body.totalbrl.replace(".",',')

var market = 'brl'+req.params.coin;

  dborderexchange.create({
    // campodatabela: nomevariavel,
    iduser: idclient,
    idtransaction,
    idorder,
    dataorder,
    coin : req.params.coin,
    market,
    totalcoin : req.body.totalcoin,
    cota: req.body.cota,
    totalfiat :req.body.totalbrl.replace(".",','),
    tipoorder : 'buy',
    status : 'pendente'

}).then(() => {
  res.redirect('/exchange/'+req.params.coin)
}).catch((err) => {
  console.log(err)
})

}




exports.redirect = (req, res) => {
  res.redirect('/exchange/btc');
};



