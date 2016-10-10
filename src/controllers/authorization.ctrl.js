var cache    = require('memory-cache');
var Promise  = require('bluebird');
var jwt      = require('jsonwebtoken');
var config   = require('../config/config.json');
var logger   = require('../lib/log').getLogger();


var apiSrv = require('../services/service.srv.js');


// Authorize a user consume private resources
function authorize(token) {
  return new Promise(function (resolve, reject) {
    // Verify token provided
    jwt.verify(token, config.jwt.secretKey, function (err, payload) {
      if (err) {
        reject({success: false, message: 'Failed to authenticate token.'});
      }
      resolve(payload);
    });
  });
}

// login and if success get Account data
function login(credentials) {
  return new Promise(function(resolve, reject) {
    logger.debug("Login username: %s", credentials.username);
    apiSrv.login(credentials).then(function(response) {
      apiSrv.getAccount(response.access_token).then(function(userInfo) {
        userInfo.username = credentials.username;
        var token = jwt.sign(userInfo, config.jwt.secretKey);
        cache.put(credentials.username, userInfo);
        resolve({user: userInfo, token: token});
      });
    }).catch(function (response) {
      logger.debug("Fail Login username: %s, error: %s", credentials.username, response);
      reject(response);
    });
  });
}

// Remove information of the user
function logout(username) {
  logger.debug("Logout username: %s", username);
  return new Promise(function (resolve) {
    cache.del(username);
    resolve();
  });
}


module.exports = {
  authorize: authorize,
  login: login,
  logout: logout
}
