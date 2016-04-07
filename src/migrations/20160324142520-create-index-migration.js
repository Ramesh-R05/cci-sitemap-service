'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addIndex('sitemap',
        ['siteId'],
        {
          indexName: 'siteid_index',
          indexType: 'BTREE'
        }
    );
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.removeIndex('sitemap', 'siteid_index');
  }
};