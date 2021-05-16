import express from 'express';
import MemberController from '../controllers/MemberController';
import UserValidation from '../middlewares/validations/userValidations';
import Authentication from '../middlewares/auth';

const router = express.Router();

router.post('/create', UserValidation.memberValidator, MemberController.createMember);
router.post('/completeRegistration', UserValidation.completeMemberValidator, MemberController.verifyMember);
router.patch('/approval/:id', Authentication.isAdmin, MemberController.approveMember);
router.get('/all', MemberController.getAllMembers);
router.get('/:id', MemberController.getSingleMember);

export default router;
