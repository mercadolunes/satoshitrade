const db = require("../models");
const Boleto = db.boleto;
var moment = require('moment');
var uuid = require('uuid');


exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
};

exports.index = (req, res) => {

  Boleto.findAll({raw: true}).then(boletos =>{
    res.render('dashboard/boleto', { listaboletos: boletos, name: req.body.username, message: req.flash('message') })
    });
  };
 
exports.pay = (req, res) => {

        var linhadigitavel = req.body.linhadigitavel;
        var datavencimento = req.body.datavencimento;
        var banco = req.body.banco;
        var valorboleto = req.body.valorboleto;
        var txadministrativa = req.body.txadministrativa;
        var totalpagar = req.body.totalpagar;
        var assinatura = req.body.assinatura;

        // res.json(dados);


res.render('dashboard/comprovante/comprovante-boleto', 
{ 
  linhadigitavel:linhadigitavel,
  datavencimento:datavencimento,
  banco : banco,
  valorboleto : valorboleto,
  valorboleto : valorboleto,
  txadministrativa : txadministrativa,
  totalpagar : totalpagar,
  assinatura : assinatura
});

};

exports.save = (req, res) => {
    req.flash('message_success', "Solicitação enviada com sucesso" );
    req.flash('message_error', "Não foi possivel processar o Pagamento" );
    
    req.flash('tipo_success', "success");
    req.flash('tipo_error', "danger");

    //salva data e hora atual
    var hora = moment().format('LT');
    var dataatual = moment().format('L ' + hora);   

  //gera o codigo de transaçao Unico
    var geraid = uuid.v4();

    Boleto.create({
      codigotransacao: geraid,
      datapagamento: dataatual,
      status: "pendente"

    })
    .then(() => {
      Boleto.findAll({raw: true}).then(boletos =>{
        res.render('dashboard/boleto', 
        { 
          listaboletos: boletos,
          name: req.body.username,
          message: req.flash('message_success'),
          tipo: req.flash('tipo_success')
        })
        });


     

    }).catch(()=>{

      res.render('dashboard/boleto', 
      { 
        name: req.body.username,
        message: req.flash('message_error'),
        tipo: req.flash('tipo_error')
      })
    });
    
};


