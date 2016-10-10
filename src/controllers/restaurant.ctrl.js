var Promise  = require('bluebird');
var _ = require('lodash');
var apiSrv = require('../services/service.srv.js');
var logger   = require('../lib/log').getLogger();

var pattern = new RegExp(/^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/);


function findByPosition(point, options) {
  return new Promise(function(resolve, reject) {
    if (pattern.test(point)) {
      apiSrv.getRestaurants(point, options).then(function(restaurants) {
        // Order the dataset by ratingScore Desc
        // TODO: Request the team to add sort parameter
        restaurants.data = _.orderBy(restaurants.data, ['ratingScore'], ['desc']);
        resolve(restaurants);
      }).catch(function(error) {
        logger.error('Obtain restaurants: ', error);
        reject(error);
      });
    } else {
      reject({code: 400, message: "Invalid point format"});
    }
  });
};


module.exports = {
  findByPosition: findByPosition
}
