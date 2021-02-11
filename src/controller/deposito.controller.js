exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
};

exports.index = (req, res) => {
    res.render('dashboard/wallet/index', { name: req.body.username })
  };

  exports.fiat = (req, res) => {
    res.render('dashboard/wallet/deposito/fiat/index', { name: req.body.username })
  };



