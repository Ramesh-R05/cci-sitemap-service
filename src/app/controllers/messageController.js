import Subscriber from '@bxm/pro-amqplib';
import { backendLogger as logger } from '@bxm/winston-logger';
import sitemapController from './sitemapController';

const subscriber = new Subscriber();
subscriber.connect();

function subscribe() {
    subscriber.on('published', (msg, ack, nack) => {
        const msgHeaders = msg.headers;
        const content = msg.content;
        logger.log('info', 'Received a message', { requestId: msgHeaders.requestId, entityId: content.id, status: msgHeaders.status });

        sitemapController.processMessage(msgHeaders.status, msgHeaders.site, content)
            .then(ack())
            .catch((err) => {
                nack();
                logger.log('error', err.message, { requestId: msgHeaders.requestId, entityId: content.id, stack: err.stack });
            });
    })
    .on('error', (err) => {
        logger.log('error', err.message, { stack: err.stack });
    });
}

export default {
    subscribe
};
