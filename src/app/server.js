import Server from '@bxm/microservice';
import routes from './routes';
import version from './../version';
import messageController from './controllers/messageController';
import config from './config';
import logger from './../logger';

export default function() {
    const server = new Server({
        name: 'SITEMAP_SERVICE',
        version: version,
        docs: './docs/api.raml',
        routes: routes,
        config: config,
        logger: logger
    });

    messageController.subscribe();

    server.start();
    return server;
}
