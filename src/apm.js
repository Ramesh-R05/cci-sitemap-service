import logger from './logger';

if (process.env.APM_KEY) {
    // New Relic environment variable configuration options
    // https://docs.newrelic.com/docs/agents/nodejs-agent/installation-configuration/nodejs-agent-configuration
    process.env.NEW_RELIC_APP_NAME = `${process.env.APP_KEY} ${process.env.APP_REGION || ''} ${process.env.APP_ENV || process.env.NODE_ENV || ''}`;
    process.env.NEW_RELIC_LICENSE_KEY = process.env.APM_KEY;
    if (process.env.HTTP_PROXY) process.env.NEW_RELIC_PROXY_URL = process.env.HTTP_PROXY;
    process.env.NEW_RELIC_NO_CONFIG_FILE = true;
    process.env.NEW_RELIC_LABELS = 'category: service';
    require('newrelic');
    logger.info('APM registered');
} else {
    logger.warn('APM not registered, missing process.env.APM_KEY');
}