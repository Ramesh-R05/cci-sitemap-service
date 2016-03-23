import {Router} from 'express';
import sitemapController from './controllers/sitemapController';

/*eslint-disable */
const router = Router();
/*eslint-enable */

//NOTE: TBA by requirements
router.get('/:version/:site/news', sitemapController.getNews);
router.get('/:version/:site/:section', sitemapController.getSection);
router.get('/:version/:site', sitemapController.getRoot);
router.post('/:version/:site', sitemapController.post);

export default router;
