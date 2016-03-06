function SitemapWebpackPlugin(base, paths, fileName) {
  this.base = base;
  this.paths = paths;
  this.fileName = fileName || 'sitemap.xml';
}

SitemapWebpackPlugin.prototype.apply = function(compiler) {
  var self = this;

  // Create sitemap from paths
  var out = '<?xml version="1.0" encoding="UTF-8"?>';
  out += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  for(var i = 0; i < self.paths.length; i++) {
    var path = self.paths[i];

    out += '<url>';
    out += '<loc>' + self.base + path + '</loc>';
    out += '</url>';
  }
  out += '</urlset>';

  compiler.plugin('emit', function(compilation, callback) {
    compilation.fileDependencies.push(self.fileName);
    compilation.assets[self.fileName] = {
      source: function () {
        return out;
      },
      size: function () {
        return Buffer.byteLength(out, 'utf8');
      }
    };
    callback();
  });
};

module.exports = SitemapWebpackPlugin;
