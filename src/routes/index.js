var express         = require('express');
var router          = express.Router();
var config          = require('../config/config.json');
var authRoute       = require('./auth');
var restaurantRoute = require('./restaurant');
var jwt             = require('jsonwebtoken');
var authCtrl        = require('../controllers/authorization.ctrl');
require('../services/service.srv').getToken();

// Authorize a user consume private resources
function authorize(req, res, next) {
  var token = req.body.token || req.query.token || req.headers[config.jwt.headerTokenField.toLowerCase()];
  if (token) {
    authCtrl.authorize(token).then(function(user) {
      // Store the user object into request
      // so the specific route could use it
      req.user = user;
      next();
    }).catch(function (error) {
      return res.status(403).send(error);
    });
  } else {
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });
  }
}


// Add headers for CORS
router.use(function (req, res, next) {
  res.header("Content-Type", 'application/json');
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  // intercept OPTIONS method
  if ('OPTIONS' == req.method) {
    res.sendStatus(200);
  }
  else {
    next();
  }
});

// Authorize middleware must be after auth routes
// for login access.
// Do not put a resource on authRoute that must
// check the permissions (authorize)
router.route('/v1/auth/login').post(authRoute.login);
router.use('/', authorize);
router.route('/v1/auth/logout').post(authRoute.logout);
router.use('/v1/restaurants', restaurantRoute);

// catch 404 and forward to error handler
router.use(function(req, res) {
  res.status(404).send({msg: 'Resource not found'});
});

module.exports = router;
