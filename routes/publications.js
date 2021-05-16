import express from 'express';
import PublicactionController from '../controllers/PublicactionController';
import PublicationValidation from '../middlewares/validations/publicationValidation';
import Authentication from '../middlewares/auth';

const router = express.Router();

router.post(
  '/create',
  Authentication.isAdmin,
  PublicationValidation.publicationValidator,
  PublicactionController.create
);
router.get('/', PublicactionController.getPublications);
router.get('/:id', PublicactionController.getPublication);
router.delete('/:id', Authentication.isAdmin, PublicactionController.deletePublication);
router.put('/approve/:id', Authentication.isAdmin, PublicactionController.approvePublication);
router.put('/:id', Authentication.isAdmin, PublicationValidation.publicationValidator, PublicactionController.updatePublication);

export default router;
