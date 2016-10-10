var authCtrl = require('../controllers/authorization.ctrl.js');


function login(req, res) {
  if (!req.body.username || !req.body.password) {
    res.status(400).send({code: 'fail', message: 'username and password parameters are required'});
  } else {
    authCtrl.login({username: req.body.username, password: req.body.password}).then(function(response) {
      res.status(200).send(response);
    }).catch(function(response) {
      if (response.statusCode === 403) {
        res.status(401).send(response.error);
      } else {
        res.status(500).send(response.error);
      }
    });
  }
};

function logout(req, res) {
  authCtrl.logout(req.user.username).then(function () {
    res.status(200).send({ code: 'SUCCESS', message: 'logout successful'});
  });
};

module.exports = {
  login: login,
  logout: logout
};
