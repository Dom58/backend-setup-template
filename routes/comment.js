import express from 'express';
import CommentController from '../controllers/CommentController';
import Authentication from '../middlewares/auth';
import CommentValidation from '../middlewares/validations/commentValidations';

const router = express.Router();

router.post(
  '/create',
  CommentValidation.commentValidator,
  CommentController.create
);
router.put(
  '/change/:id',
  Authentication.checkAuthentication,
  CommentValidation.statusValidator,
  CommentValidation.idValidator,
  CommentController.changeComment
);

router.get(
  '/',
  Authentication.checkAuthentication,
  CommentController.readAllcomments
);

router.get(
  '/:slug/news',
  // Authentication.checkAuthentication,
  CommentController.readAllCommentNews
);

router.get(
  '/activecomments',
  CommentController.activeComment
);

router.delete(
  '/delete/:id',
  Authentication.isAdmin,
  CommentValidation.idValidator,
  CommentController.delete
);
export default router;
