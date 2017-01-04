var expect = require('chai').expect;
var webpack = require('webpack');
var clean = require('rimraf');
var getSubDirsSync = require('./utils/get-sub-dirs-sync');
var directoryContains = require('./utils/directory-contains');

var successCases = getSubDirsSync(__dirname + '/success-cases');
var errorCases = getSubDirsSync(__dirname + '/error-cases');

describe('Success cases', function() {
  successCases.forEach(function(successCase) {
    var desc = require('./success-cases/' + successCase + '/desc.js');

    describe(desc, function () {
      beforeEach(function (done) {
        clean(__dirname + '/success-cases/' + successCase + '/actual-output', done);
      });

      it('generates the expected sitemap', function (done) {
        var webpackConfig = require('./success-cases/' + successCase + '/webpack.config.js');

        webpack(webpackConfig, function(err, stats) {
          if (err) {
            return done(err);
          }

          var caseDir = __dirname + '/success-cases/' + successCase;
          var expectedDir = caseDir + '/expected-output/';
          var actualDir = caseDir + '/actual-output/';

          directoryContains(expectedDir, actualDir, function(err, result) {
            if (err) {
              return done(err);
            }

            expect(result).to.be.ok;
            done();
          });
        });
      });
    });
  });
});

describe('Error cases', function() {
  errorCases.forEach(function(errorCase) {
    var desc = require('./error-cases/' + errorCase + '/desc.js');

    describe(desc, function () {
      beforeEach(function (done) {
        clean(__dirname + '/error-cases/' + errorCase + '/actual-output', done);
      });

      it('generates the expected error', function (done) {
        var webpackConfig = require('./error-cases/' + errorCase + '/webpack.config.js');
        var expectedError = require('./error-cases/' + errorCase + '/expected-error.js');

        webpack(webpackConfig, function(err, stats) {
          var actualError = stats.compilation.errors[0].toString().split('\n')[0];
          expect(actualError).to.include(expectedError);
          done();
        });
      });
    });
  });
});
