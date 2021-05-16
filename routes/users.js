import express from 'express';
import UserController from '../controllers/UserController';
import UserValidation from '../middlewares/validations/userValidations';
import Authentication from '../middlewares/auth';

const router = express.Router();

router.post('/create', Authentication.isAdmin, UserValidation.userValidator, UserController.create);
router.put('/update/:id', Authentication.checkAuthentication, UserValidation.updateUserValidator, UserController.updateUser);
router.put('/admin/update/:id', Authentication.isAdmin, UserValidation.updateUserByAdminValidator, UserController.updateUserByAdmin);
router.get('/', Authentication.isAdmin, UserController.getUsers);
router.get('/:id', UserController.getUser);
router.delete('/:id', Authentication.isAdmin, UserController.deleteUser);
router.patch('/:id', Authentication.isAdmin, UserController.restoreUser);
router.put('/approve/:id', Authentication.isAdmin, UserController.approveUser);

export default router;
