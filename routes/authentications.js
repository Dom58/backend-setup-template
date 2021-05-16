import express from 'express';
import UserController from '../controllers/UserController';
import UserValidation from '../middlewares/validations/userValidations';

const router = express.Router();

router.post('/login', UserController.login);
router.post('/reset-password-account', UserValidation.resetPasswordAccount, UserController.resetPassword);
router.post('/send-forgot-password', UserController.sendForgotPassword);

export default router;
