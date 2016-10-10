'use strict';

var should = require('should');
var Promise  = require('bluebird');

var proxyquire =  require('proxyquire');


var servicesStub = {
  login: function (credentials) {
    return new Promise(function (resolve) {
      setTimeout(function () {
        resolve({access_token: '8113-4a45-b324-13fb'});
      }, 1);
    });
  },
  getAccount: function (token) {
    return new Promise(function (resolve) {
      resolve({"id":12,"lastName":"Doe","name":"John","country":{"id":1}});
    });
  }
};

var authCtrl = proxyquire('../src/controllers/authorization.ctrl.js', {'../services/service.srv.js': servicesStub});


describe('authorization controller', function () {

  before(function () {
  });

  it('login', function (done) {
    authCtrl.login({username: "johndoe@company.com", password: "some-password"}).then(function (response) {
      should(response).have.property("user");
      should(response).have.property("token");
      var user = response.user;
      should(user).have.property("id");
      should(user).have.property("name");
      should(user).have.property("lastName");
      should(user).have.property("country");
      should(user).have.property("username");
      should(user.id).eql(12);
      should(user.name).eql("John");
      should(user.lastName).eql("Doe");
      should(user.username).eql("johndoe@company.com");
      should(user.country).eql({"id":1});
      done();
    });
  });

  it('logout', function (done) {
    authCtrl.logout("johndoe@company.com").then(function (response) {
      should(response).not.be.ok;
      done();
    });
  });

});
