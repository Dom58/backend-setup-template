import express from 'express';
import MessageController from '../controllers/MessageController';
import Authentication from '../middlewares/auth';

const router = express.Router();

router.post('/create', Authentication.isAdmin, MessageController.create);
router.get('/myMessages', Authentication.checkAuthentication, MessageController.getMyMessages);
router.get('/allMySends', Authentication.checkAuthentication, MessageController.getSends);
router.get('/:id', Authentication.checkAuthentication, MessageController.getMyMessage);

export default router;
