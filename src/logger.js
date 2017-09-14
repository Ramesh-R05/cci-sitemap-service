import { backendLogger as logger } from '@bxm/winston-logger';

logger.transports.console.handleExceptions = false;
logger.transports.console.level = (process.env.APP_DEBUG === 'true') ? 'debug' : 'info';

if (process.env.APP_ENV === 'production' || process.env.APP_ENV === 'prod' || process.env.APP_ENV === 'sit' || process.env.NODE_ENV === 'production') {
    logger.addTransports([{
        type: 'loggly',
        name: 'loggly',
        options: {
            inputToken: '9b4a2693-dc77-4e7e-a5ee-498845c59793',
            subdomain: 'bauerdigital',
            tags: [
                process.env.APP_KEY,
                process.env.APP_ENV || process.env.NODE_ENV
            ],
            json: true,
            level: (process.env.APP_DEBUG === 'true') ? 'debug' : 'warn',
            proxy: process.env.HTTP_PROXY,
            colorize: false
        }
    }]);
    logger.setMetadata({
        product: process.env.APP_KEY,
        env: process.env.APP_ENV || process.env.NODE_ENV || 'local'
    });
} else {
    logger.transports.console.timestamp = function () {
        const d = new Date();
        const h = ('0' + d.getHours()).slice(-2);
        const m = ('0' + d.getMinutes()).slice(-2);
        const s = ('0' + d.getSeconds()).slice(-2);
        const ms = ('00' + d.getMilliseconds()).slice(-3);
        return `${h}:${m}:${s}.${ms}`;
    };
}

logger.info([
    `HTTP_PROXY=${process.env.HTTP_PROXY ? 'set' : 'not set'}`
].join(' '));

logger.info([
    `NODE_ENV=${process.env.NODE_ENV}`
].join(' '));

logger.info([
    `APP_KEY=${process.env.APP_KEY}`,
    `APP_DEBUG=${process.env.APP_DEBUG}`,
    `APP_STUBBED=${process.env.APP_STUBBED}`,
    `APP_ENV=${process.env.APP_ENV}`
].join(' '));

export default logger;