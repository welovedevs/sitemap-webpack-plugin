var SitemapPlugin = require('../../../');

module.exports = {
  output: {
    filename: 'index.js',
    path: __dirname + '/actual-output',
    libraryTarget: 'umd'
  },

  plugins: [
    new SitemapPlugin('https://mysite.com', ['/', '/about'], 'map.xml')
  ]
};
