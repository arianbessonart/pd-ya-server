var express = require('express');
var router = express.Router();

var restaurantCtrl = require('../controllers/restaurant.ctrl');


function findByPosition(req, res) {
  if (!req.query.point) {
    res.status(400).send({code: 'fail', message: 'point parameter is required'});
  } else {
    var options = { offset: req.query.offset, limit: req.query.limit};
    restaurantCtrl.findByPosition(req.query.point, options).then(function(restaurants) {
      res.status(200).send(restaurants);
    }).catch(function (error) {
      var code = error.code || 500;
      res.status(code).send({success: false, message: error.message});
    });
  }
};


router.get('/find', findByPosition);

module.exports = router;
