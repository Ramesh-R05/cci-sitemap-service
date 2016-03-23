import Sequelize from 'sequelize';
import config from 'config';

const db = config.db;

if (typeof db === 'undefined') {
    throw new Error('Configuration not found');
}

const sequelize = new Sequelize(db.schema, db.user, db.password, {
    logging: false,
    /*logging: (string) => { console.log(string); },*/
    host: db.host,
    dialect: db.dialect
});

export default sequelize;
