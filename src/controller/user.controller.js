exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.dashboard = (req, res) => {
  // res.render('user', { name: req.body.username })
  res.render('dashboard/index', { name: req.body.username })
  
};

exports.adminBoard = (req, res) => {
  res.render('admin', { name: req.body.username })
  //res.status(200).send("Admin Content.");
};
exports.forgotBoard = (req, res) => {
  let userId = req.body.userId
  let token = req.params.token
  res.render('forgot', { id: userId, token: token })
  //res.status(200).send("Admin Content.");
};

