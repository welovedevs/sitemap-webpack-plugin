var expect = require('chai').expect;
var Timecop = require('timecop');

var GenerateDate = require('../date');

describe('GenerateDate', function() {
  beforeEach(function (done) {
    Timecop.install();
    done();
  });

  it('generates the current date in the correct format', function(done) {
    Timecop.freeze(new Date(2012, 1, 5, 14, 30));
    expect(GenerateDate()).to.eq('2012-02-05');
    done();
  });

  afterEach(function (done) {
    Timecop.uninstall();
    done();
  });
});
