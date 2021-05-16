import express from 'express';
import EventController from '../controllers/EventController';
import EventValidation from '../middlewares/validations/eventValidations';
import Authentication from '../middlewares/auth';

const router = express.Router();

router.post('/create', Authentication.checkAuthentication, EventValidation.eventValidator, EventController.create);
router.get('/', EventController.getEvents);
router.get('/myEvents', Authentication.checkAuthentication, EventController.getMyEvents);
router.get('/:slug', EventController.getEvent);
router.delete('/:slug', Authentication.checkAuthentication, EventController.deleteEvent);
router.put('/approve/:slug', Authentication.checkAuthentication, EventController.approveEvent);
router.put('/:slug', Authentication.checkAuthentication, EventController.updateEvent);

export default router;
