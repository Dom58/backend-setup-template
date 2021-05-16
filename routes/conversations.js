import express from 'express';
import conversationController from '../controllers/ConversationController';
import Authentication from '../middlewares/auth';
import ConversationValidation from '../middlewares/validations/conversationValidations';

const router = express.Router();

router.post(
  '/create',
  Authentication.checkAuthentication,
  ConversationValidation.conversationValidator,
  conversationController.create
);
// user
router.patch(
  '/change/:id',
  Authentication.checkAuthentication,
  ConversationValidation.statusValidator,
  ConversationValidation.idValidator,
  conversationController.myNotifications
);

// admin
router.get(
  '/',
  Authentication.checkAuthentication,
  conversationController.adminGetNotifications
);
export default router;
