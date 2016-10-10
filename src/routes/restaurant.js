var _ = require('lodash');

var express = require('express');
var router = express.Router();

var apiSrv = require('../services/service.srv.js');


function findByPosition(req, res) {
  var options = { offset: req.query.offset, limit: req.query.limit};
  apiSrv.getRestaurants(req.query.point, options).then(function(restaurants) {
    // Order the dataset by ratingScore Desc
    // TODO: Request the team to add sort parameter
    restaurants.data = _.orderBy(restaurants.data, ['ratingScore'], ['desc']);
    res.status(200).send(restaurants);
  });
};


router.get('/find', findByPosition);

module.exports = router;
