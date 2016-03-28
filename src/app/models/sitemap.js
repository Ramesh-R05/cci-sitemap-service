import Sequelize from 'sequelize';
import db from '../core/db';

/*eslint-disable */
const Sitemap = db.define('sitemap',
    {
        id: {
            type: Sequelize.STRING(20),
            primaryKey: true
        },
        siteId: {
            type: Sequelize.STRING(10)
        },
        data: {
            type: Sequelize.JSONB
        }
    }, {
        freezeTableName: true
    }
);
/*eslint-enable */

export default Sitemap;
