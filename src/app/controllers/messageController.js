import Subscriber from '@bxm/pro-amqplib';
import {backendLogger as logger} from '@bxm/winston-logger';
import sitemapController from './sitemapController';

//TODO: Subscribe msg and call sitemapController to save/delete

const subscriber = new Subscriber();
subscriber.connect();

function subscribe() {

}

export default {
    subscribe
};
