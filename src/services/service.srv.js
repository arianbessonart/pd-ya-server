var rp     = require('request-promise');
var cache  = require('memory-cache');
var Promise = require('bluebird');
var config = require('../config/config.json');
var logger = require('../lib/log').getLogger();

var clientKey = config.clientKey;
var baseUrl = config.apiUrl.base+config.apiUrl.prefix;

var limitDefault  = 20;
var offsetDefault = 0;
var retryDefault = 1;


function getToken() {
  return new Promise(function (resolve, reject) {
    var url = baseUrl + "tokens?clientId="+clientKey.clientId+"&clientSecret="+clientKey.clientSecret;
    return rp({
      uri: url,
      json: true
    }).then(function (response) {
      logger.info(response);
      cache.put("apiToken", response.access_token);
      resolve(response);
    }).catch(function (error) {
      logger.error(error);
      reject(error);
    });
  });
}

function login(credentials) {
  var url = baseUrl + "tokens?userName="+credentials.username+"&password="+credentials.password;
  return rp({
    uri: url,
    headers: {
      'Authorization': cache.get("apiToken")
    },
    json: true
  });
}

function getAccount(uToken) {
  var url = baseUrl + "myAccount";
  return rp(
    {
      uri: url,
      headers:{
        'Authorization': uToken
      },
      json: true
    });
}

function getRestaurants(point, options) {
  var limit = options.limit || limitDefault;
  var offset = options.offset || offsetDefault;
  var retry = retryDefault;
  if (options.retry !== undefined && options.retry !== null) {
    retry = options.retry;
  }
  var url = baseUrl + "search/restaurants?point="+point+"&max="+limit+"&offset="+offset;
  return new Promise(function (resolve, reject) {
    rp(
      {
        uri: url,
        headers: {
          'Authorization': cache.get("apiToken")
        },
        json: true
    }).then(function (response) {
      logger.debug(response);
      resolve(response);
    }).catch(function (error) {
      if (error.error && error.error.code === 'INVALID_TOKEN' && retry > 0) {
        getToken().then(function() {
          options.retry = retry - 1;
          return getRestaurants(point, options);
        }).catch(function (error) {
          reject(error);
        });
      } else {
        reject(error);
      }
    });
  });
}


module.exports = {
  getToken: getToken,
  login: login,
  getAccount: getAccount,
  getRestaurants: getRestaurants
}
