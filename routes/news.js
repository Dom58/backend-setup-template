import express from 'express';
import NewsController from '../controllers/NewsController';
import newsValidation from '../middlewares/validations/newsValidations';
import Authentication from '../middlewares/auth';

// import { checkToken } from '../helpers';

const router = express.Router();
router.get(
  '/',
  NewsController.retrieveNews
);

router.get(
  '/five',
  NewsController.retrieveFiveNews
);
router.post(
  '/create',
  Authentication.checkAuthentication,
  newsValidation.newsValidator,
  NewsController.create
);
router.put(
  '/update/:slug',
  Authentication.checkAuthentication,
  newsValidation.slugValidator,
  NewsController.update
);
router.get('/', Authentication.checkAuthentication, NewsController.myNews);
router.get(
  '/:slug',
  newsValidation.slugValidator,
  NewsController.read
);
router.delete(
  '/delete/:slug',
  Authentication.isAdmin,
  newsValidation.slugValidator,
  NewsController.delete
);
router.put(
  '/publish/:slug',
  Authentication.isAdmin,
  newsValidation.slugValidator,
  NewsController.publish
);
export default router;
