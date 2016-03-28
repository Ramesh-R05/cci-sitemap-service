'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('sitemap', {
      id: {
        type: Sequelize.STRING(20),
        primaryKey: true
      },
      siteId: {
        type: Sequelize.STRING(10)
      },
      data: {
        type: Sequelize.JSONB
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    }, {
      freezeTableName: true
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('sitemap');
  }
};

