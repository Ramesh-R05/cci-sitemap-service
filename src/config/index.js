const nodeEnv = process.env.NODE_ENV;
process.env.NODE_ENV = process.env.APP_ENV;
const config = require('config');
process.env.NODE_ENV = nodeEnv;
export default config;