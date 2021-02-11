exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
};

exports.dashboard = (req, res) => {
    res.render('dashboard/index', { name: req.body.username })
  };




