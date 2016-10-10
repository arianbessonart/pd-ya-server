'use strict';

var should = require('should');
var Promise  = require('bluebird');
var jwt      = require('jsonwebtoken');
var config = require('../src/config/config.json');
var proxyquire =  require('proxyquire');

var responseMock = {
  "total": 190,
  "max": 1,
  "sort": "",
  "count": 1,
  "data": [
    {
      "deliveryTimeMinMinutes": "45",
      "validReviewsCount": 691,
      "cityName": "Montevideo",
      "allCategories": "Burgers",
      "sortingDistance": 0.005368389562056307,
      "doorNumber": "798",
      "minDeliveryAmount": 120,
      "deliveryTimeOrder": 2,
      "description": "",
      "mandatoryPaymentAmount": false,
      "sortingTalent": 0,
      "shippingAmountIsPercentage": false,
      "sortingVip": 1,
      "stamps": {
        "state": "ACTIVE",
        "needed": 9,
        "has": 0,
        "average": 0
      },
      "opened": 1,
      "sortingConvertionRate": 0,
      "deliveryAreas": "New York",
      "index": 0,
      "paymentMethodsList": [
        {
          "id": "1",
          "descriptionPT": "Dinheiro",
          "descriptionES": "Efectivo",
          "online": false
        },
        {
          "id": "3",
          "descriptionPT": "Ticket Alimentação (Maquininha)",
          "descriptionES": "Ticket Alimentación (POS)",
          "online": false
        }
      ],
      "favoritesCount": 742,
      "isNew": false,
      "delivers": false,
      "nextHourClose": "2010-01-02T00:15:00Z",
      "hasOnlinePaymentMethods": false,
      "homeVip": false,
      "discount": 10,
      "deliveryTime": "10'",
      "food": 4.1,
      "deliveryTimeId": 3,
      "sortingNew": 0,
      "nextHour": "2010-01-01T18:30:00Z",
      "acceptsPreOrder": true,
      "weighing": 171.1713919754867,
      "noIndex": false,
      "sortingRejectionRate": 0.892857015132904,
      "restaurantRegisteredDate": "2010-11-29 15:01:21.0",
      "link": "burgers",
      "isGoldVip": false,
      "generalScore": 4.1,
      "restaurantTypeId": 3,
      "topCategories": "Burgers",
      "id": 17509,
      "distance": 0.6,
      "area": "New Jersey",
      "name": "The Burgers",
      "sortingReviews": 4.099999904632568,
      "coordinates": "-31.9162,-52.1545",
      "maxShippingAmount": 0,
      "ratingScore": "4.10",
      "logo": "logo-mafalda.jpg",
      "deliveryTimeMaxMinutes": "60",
      "deliveryType": "ALL",
      "speed": 4.1,
      "favoriteByUser": false,
      "sortingOrderCount": 4498,
      "sortingOnlinePayment": 0,
      "shippingAmount": 0,
      "sortingGroupOrderCount": 17392,
      "address": "fifth avenue",
      "stateId": 1,
      "hasZone": true,
      "favoriteByOrders": false,
      "service": 4.1,
      "paymentMethods": "Cash",
      "categories": [
        {
          "id": 275,
          "name": "Burgers",
          "isTop": false
        }
      ],
      "rating": "40",
      "sortingConfirmationTime": 3199.179931640625
    }
  ],
  "offset": 0
};

var servicesStub = {
  getRestaurants: function (point, options) {
    return new Promise(function (resolve) {
      setTimeout(function () {
        resolve(responseMock);
      }, 1);
    });
  }
};

var servicesFailFetchStub = {
  getRestaurants: function (point, options) {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        reject({message: 'error fetching restaurants', code: 500});
      }, 1);
    });
  }
};

var restaurantCtrl = proxyquire('../src/controllers/restaurant.ctrl.js', {'../services/service.srv.js': servicesStub});
var restaurantFailFetchCtrl = proxyquire('../src/controllers/restaurant.ctrl.js', {'../services/service.srv.js': servicesFailFetchStub});

describe('restaurant controller', function () {

  before(function () {
  });

  it('findByPosition', function (done) {
    var point = "-53.21,34.312";
    restaurantCtrl.findByPosition(point, {}).then(function (response) {
      should(response).eql(responseMock);
      done();
    }).catch(function(error) {
      should.fail();
      done();
    });
  });

  it('findByPosition fail fetch', function (done) {
    var point = "-53.21,34.312";
    restaurantFailFetchCtrl.findByPosition(point, {}).then(function (response) {
      should.fail();
      done();
    }).catch(function(error) {
      should(error).eql({message: 'error fetching restaurants', code: 500});
      done();
    });
  });

  it('findByPosition fail point', function (done) {
    var point = "-53.34.312";
    restaurantCtrl.findByPosition(point, {}).then(function (response) {
      should.fail();
      done();
    }).catch(function(error) {
      should(error).eql({code: 400, message: "Invalid point format"});
      done();
    });
  });


});
