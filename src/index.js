process.env.APP_KEY = 'sitemap';
process.title = process.env.APP_KEY;

require('babel/register')();
require('./logger');
require('./apm');

module.exports = require('./app/server')();