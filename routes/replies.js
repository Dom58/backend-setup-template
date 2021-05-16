import express from 'express';
import ReplyController from '../controllers/ReplyController';
import Authentication from '../middlewares/auth';

const router = express.Router();

router.post('/create', Authentication.checkAuthentication, ReplyController.create);

export default router;
