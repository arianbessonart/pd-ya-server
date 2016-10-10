'use strict';

// var request = require('supertest');
var should = require('should');
var mocks = require('node-mocks-http');
var nock = require('nock')

var config = require('../src/config/config.json');
var apiSrv = require('../src/services/service.srv.js');


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


describe('external api services', function () {


  beforeEach(function (done) {
    this.response = mocks.createResponse({eventEmitter: require('events').EventEmitter});
    done();
  });

  it('get token', function (done) {
    nock(config.apiUrl.base).get(config.apiUrl.prefix+'tokens')
      .query({clientId: config.clientKey.clientId, clientSecret: config.clientKey.clientSecret})
      .reply(200, { access_token: "7125-4af6-b197-94ba45cef185"});
    apiSrv.getToken().then(function (response) {
      should(response.access_token).eql("7125-4af6-b197-94ba45cef185");
      done();
    });
  });


  it('login', function (done) {
    var username = "johndoe@company.com";
    var password = "complex-password";
    var token = '8113-4a45-b324-13fb';
    nock(config.apiUrl.base).get(config.apiUrl.prefix+'tokens')
      .query({userName: username, password: password})
      .reply(200, { access_token: token});
    apiSrv.login({username: username, password: password}).then(function (response) {
      should(response).eql({access_token: token});
      done();
    });
  });

  it('getAccount', function (done) {
    var token = "8113-4a45-b324-13fb";
    nock(config.apiUrl.base, {
      reqheaders: {'authorization': token}
    })
      .get(config.apiUrl.prefix+'myAccount')
      .reply(200, {"id":12,"lastName":"Doe","name":"John","country":{"id":1}});
    apiSrv.getAccount(token).then(function (response) {
      should(response).eql({"id":12,"lastName":"Doe","name":"John","country":{"id":1}});
      done();
    });
  });


  it('getRestaurants', function (done) {
    var token = "8113-4a45-b324-13fb";
    var maxValue = 1;
    var offsetValue = 0;
    var point = "-34.9200968,-56.1508075";
    nock(config.apiUrl.base)
      .get(config.apiUrl.prefix+'search/restaurants')
      .query({point: point, max: maxValue, offset: offsetValue})
      .reply(200, responseMock);
    apiSrv.getRestaurants(point, {limit: maxValue, offset: offsetValue}).then(function (response) {
      should(response).eql(responseMock);
      done();
    });
  });

});
