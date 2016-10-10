
var should = require('should');
var log = require('../src/lib/log');

describe('log test', function () {

  it('init', function (done) {
    var logger = log.init();
    should(logger).have.property("levels");
    should(logger.levels).eql({error: 0, warn: 1, silly: 2, info: 3, debug: 4});
    done();
  });

});
