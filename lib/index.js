'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _zlib = require('zlib');

var _zlib2 = _interopRequireDefault(_zlib);

var _date = require('./date');

var _date2 = _interopRequireDefault(_date);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SitemapWebpackPlugin = function () {
  function SitemapWebpackPlugin(base, paths, options) {
    _classCallCheck(this, SitemapWebpackPlugin);

    // Set mandatory values
    this.base = base;
    this.paths = paths;

    // Set options
    if (typeof options === 'undefined') {
      options = {};
    }
    this.fileName = options.fileName || 'sitemap.xml';
    this.lastMod = options.lastMod || false;
    this.changeFreq = options.changeFreq || null;
    this.priority = options.priority || null;
    this.skipGzip = options.skipGzip || false;
    this.formatter = options.formatter || null;
  }

  _createClass(SitemapWebpackPlugin, [{
    key: 'generate',
    value: function generate() {
      var _this = this;

      // Validate configuration
      if (typeof this.base !== 'string') {
        throw new Error('Provided base URL is not a string');
      } else if (this.base.substr(-1) === '/') {
        this.base = this.base.replace(/\/$/, '');
      }
      if (!Array.isArray(this.paths)) {
        throw new Error('Provided paths are not an array');
      }

      // Create sitemap from paths
      var out = '<?xml version="1.0" encoding="UTF-8"?>';
      out += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">';

      var locs = this.paths.map(function (path) {
        if ((typeof path === 'undefined' ? 'undefined' : _typeof(path)) === 'object') {
          if (typeof path.path !== 'string') {
            throw new Error('Path is not a string: ' + path);
          }
        } else if (typeof path === 'string') {
          path = { path: path };
        } else {
          throw new Error('Path is not a string: ' + path);
        }

        var loc = '<url>';

        var stringPath = path.path;
        if (stringPath.substr(0, 1) !== '/') {
          stringPath = '/' + path.path;
        }
        loc += '<loc>' + _this.base + stringPath + '</loc>';

        // Add loc lastMod or default if set.
        if (path.lastMod) {
          loc += '<lastmod>' + path.lastMod + '</lastmod>';
        } else if (_this.lastMod) {
          loc += '<lastmod>' + (0, _date2.default)() + '</lastmod>';
        }

        // Add loc changeFreq or default if set.
        if (path.changeFreq) {
          loc += '<changefreq>' + path.changeFreq + '</changefreq>';
        } else if (_this.changeFreq) {
          loc += '<changefreq>' + _this.changeFreq + '</changefreq>';
        }

        // Add loc priority or default if set.
        if (path.priority) {
          loc += '<priority>' + path.priority + '</priority>';
        } else if (_this.priority) {
          loc += '<priority>' + _this.priority + '</priority>';
        }

        // Add alternates
        if (path.alternates) {
          path.alternates.forEach(function (alternate) {
            var hreflang = alternate.hreflang,
                href = alternate.href;

            loc += '<xhtml:link\n      rel="alternate"\n      hreflang="' + hreflang + '"\n      href="' + _this.base + '/' + href + '"/>';
          });
        }

        loc += '</url>';
        return loc;
      });

      out += locs.join('');
      out += '</urlset>';

      if (this.formatter !== null) {
        out = this.formatter(out);
      }

      return out;
    }
  }, {
    key: 'apply',
    value: function apply(compiler) {
      var _this2 = this;

      compiler.hooks.emit.tapAsync('sitemap-webpack-plugin', function (compilation, callback) {
        var sitemap = null;

        try {
          sitemap = _this2.generate();

          compilation.fileDependencies.add(_this2.fileName);
          compilation.assets[_this2.fileName] = {
            source: function source() {
              return sitemap;
            },
            size: function size() {
              return Buffer.byteLength(sitemap, 'utf8');
            }
          };
        } catch (err) {
          compilation.errors.push(err.stack);
        }

        if (sitemap !== null && _this2.skipGzip !== true) {
          _zlib2.default.gzip(sitemap, function (err, compressed) {
            if (err) {
              compilation.errors.push(err.stack);
            } else {
              compilation.assets[_this2.fileName + '.gz'] = {
                source: function source() {
                  return compressed;
                },
                size: function size() {
                  return Buffer.byteLength(compressed);
                }
              };
            }
            callback();
          });
        } else {
          callback();
        }
      });
    }
  }]);

  return SitemapWebpackPlugin;
}();

exports.default = SitemapWebpackPlugin;