'use strict';
require('@bxm/node-apm')('sitemap service', 'service');
require('babel/register')();

module.exports = require('./app/server')();