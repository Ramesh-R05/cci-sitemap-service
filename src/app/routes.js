import {Router} from 'express';
import sitemapController from './controllers/sitemapController';

/*eslint-disable */
const router = Router();
/*eslint-enable */

router.get('/:version/:site/:section', sitemapController.getSection);
router.get('/:version/:site', sitemapController.getIndex);

export default router;
