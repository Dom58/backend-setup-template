import express from 'express';

import users from './users';
import news from './news';
import authentications from './authentications';
import events from './events';
import comments from './comment';
import members from './members';
import notification from './conversations';
import messages from './messages';
import replies from './replies';
import contact from './contact';
import publications from './publications';
import maillists from './maillists';

const router = express.Router();

router.get('/', (req, res) => {
	res.status(200).json({
		message: 'Welcome to COT APIs',
	});
});

router.use('/users', users);
router.use('/news', news);
router.use('/events', events);
router.use('/auth', authentications);
router.use('/comments', comments);
router.use('/members', members);
router.use('/notification', notification);
router.use('/messages', messages);
router.use('/replies', replies);
router.use('/contact', contact);
router.use('/publications', publications);
router.use('/maillist', maillists);

export default router;
