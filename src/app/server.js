import Server from '@bxm/microservice';
import routes from './routes';
import version from './../version';
import messageController from './controllers/messageController';

export default function() {
    const server = new Server({
        name: 'SITEMAP_SERVICE',
        version: version,
        docs: './docs/api.raml',
        routes: routes
    });

    messageController.subscribe();

    server.start();
    return server;
}
