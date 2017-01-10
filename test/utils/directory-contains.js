var glob = require('glob');
var async = require('async');
var fs = require('fs');
var path = require('path');
var zlib = require('zlib');
var GenerateDate = require('../../date');

var readFile = function(path, done) {
  if(path.endsWith('.gz')) {
    return fs.readFile(path, function(err, contents) {
      if(err) {
        done(err);
      } else {
        zlib.gunzip(contents, function(err, data) {
          if(err) {
            done(err);
          } else {
            done(null, data.toString('utf8'));
          }
        });
      }
    });
  } else {
    return fs.readFile(path, 'utf8', done);
  }
};

module.exports = function(referenceDir, targetDir, done) {
  var compareFile = function(file, done) {
    var referenceFile = path.join(referenceDir, file);
    var targetFile = path.join(targetDir, file);

    async.map([referenceFile, targetFile], readFile, function(err, results) {
      if (err) {
        return done(err);
      }

      var referenceContent = results[0].replace(/\$DATE\$/g, GenerateDate());
      var targetContent = results[1];
      done(null, referenceContent === targetContent);
    });
  };

  glob('**/*', { cwd: referenceDir, nodir: true }, function(err, referenceFiles) {
    if (err) {
      return done(err);
    }

    glob('**/*', { cwd: targetDir, nodir: true }, function(err, targetFiles) {
      if (err) {
        return done(err);
      }

      async.map(referenceFiles.concat(targetFiles), compareFile, function(err, results) {
        if (err) {
          return done(err);
        }

        done(null, !results.some(function(result) { return !result; }));
      });
    });
  });
};
