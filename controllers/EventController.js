import dotenv from 'dotenv';
import model from '../models';
import EventHelper from '../helpers/eventHelper';
import { sendToSubscribers } from '../helpers/mailer/maillist';
import {
	HTTP_OK,
	HTTP_CREATED,
	HTTP_UNAUTHORIZED,
	HTTP_NOT_FOUND,
	HTTP_SERVER_ERROR,
} from '../constants/httpStatusCodes';
import {
	SERVER_NOT_RESPONDING,
	SUCCESS_EVENT_CREATED,
	NO_EVENT_CREATED,
	NO_EVENT_FOUND,
	SUCCESS_DELETED,
	ACCESS_DENIED,
	SUCCESS_UPDATED_EVENT,
} from '../constants/general';

dotenv.config();

const { User, Event, Maillist } = model;

/**
 * Event Controllers
 */
export default class EventController {
	/**
	 *
	 * @param {Object} req
	 * @param {Object} res
	 * @returns {Object} Event object
	 */
	static async create(req, res) {
		try {
			const createEvent = await EventHelper.createEvent(req.body, req.user.id);
			const { dataValues } = createEvent;
			// end send mail
			const findSubscribes = await Maillist.findAll();
			const sendingtoAll = findSubscribes.map(async i => {
				const sendMail = await sendToSubscribers(
					i.email,
					dataValues.description,
					`[Event] ${dataValues.title}`,
					`events/${dataValues.slug}`,
					i.id
				);
				return {
					sendMail,
				};
			});

			await Promise.all(sendingtoAll); // end send mail

			return res.status(HTTP_CREATED).json({
				message: SUCCESS_EVENT_CREATED,
				data: dataValues,
			});
		} catch (error) {
			return res.status(HTTP_SERVER_ERROR).json({
				error: SERVER_NOT_RESPONDING,
			});
		}
	}

	/**
	 *
	 * @param {Object} req
	 * @param {Object} res
	 * @returns {Object} return events object
	 */
	static async getEvents(req, res) {
		try {
			const events = await Event.findAll({
				order: [['createdAt', 'DESC']],
				// where: {
				//   isApproved: true,
				// },
				include: [
					{
						as: 'user',
						model: User,
						attributes: [
							'id',
							'firstName',
							'lastName',
							'email',
							'organization',
							'role',
						],
					},
				],
			});

			if (!events.length) {
				return res.status(HTTP_NOT_FOUND).json({
					error: NO_EVENT_CREATED,
				});
			}

			return res.status(HTTP_OK).json({
				eventsCount: events.length,
				data: events,
			});
		} catch (error) {
			return res.status(HTTP_SERVER_ERROR).json({
				error: SERVER_NOT_RESPONDING,
			});
		}
	}

	/**
	 *
	 * @param {Object} req
	 * @param {Object} res
	 * @returns {Object} return my events object
	 */
	static async getMyEvents(req, res) {
		try {
			const myEvents = await Event.findAll({
				where: {
					userId: req.user.id,
				},
				order: [['createdAt', 'DESC']],
				include: [
					{
						as: 'user',
						model: User,
						attributes: [
							'id',
							'firstName',
							'lastName',
							'email',
							'organization',
							'role',
						],
					},
				],
			});

			if (!myEvents.length) {
				return res.status(HTTP_NOT_FOUND).json({
					error: NO_EVENT_CREATED,
				});
			}

			return res.status(HTTP_OK).json({
				myEventsCount: myEvents.length,
				data: myEvents,
			});
		} catch (error) {
			return res.status(HTTP_SERVER_ERROR).json({
				error: SERVER_NOT_RESPONDING,
			});
		}
	}

	/**
	 *
	 * @param {Object} req
	 * @param {Object} res
	 * @returns {Object} return event object
	 */
	static async getEvent(req, res) {
		try {
			const findEvent = await Event.findOne({
				where: {
					slug: req.params.slug,
				},
				include: [
					{
						as: 'user',
						model: User,
						attributes: [
							'id',
							'firstName',
							'lastName',
							'email',
							'organization',
							'role',
						],
					},
				],
			});

			if (!findEvent) {
				return res.status(HTTP_NOT_FOUND).json({
					error: NO_EVENT_FOUND,
				});
			}

			return res.status(HTTP_OK).json({
				data: findEvent.dataValues,
			});
		} catch (error) {
			return res.status(HTTP_SERVER_ERROR).json({
				error: SERVER_NOT_RESPONDING,
			});
		}
	}

	/**
	 *
	 * @param {Object} req
	 * @param {Object} res
	 * @returns {Object} aknowldgement object
	 */
	static async deleteEvent(req, res) {
		try {
			const findEvent = await Event.findOne({
				where: {
					slug: req.params.slug,
				},
			});

			if (!findEvent) {
				return res.status(HTTP_NOT_FOUND).json({
					error: NO_EVENT_FOUND,
				});
			}

			if (
				req.user.id === findEvent.dataValues.userId ||
				req.user.role === 'admin'
			) {
				await Event.destroy({
					where: {
						id: findEvent.get().id,
					},
				});
				return res.status(HTTP_OK).json({
					message: SUCCESS_DELETED,
				});
			}
			return res.status(HTTP_UNAUTHORIZED).json({
				error: ACCESS_DENIED,
			});
		} catch (error) {
			return res.status(HTTP_SERVER_ERROR).json({
				error: SERVER_NOT_RESPONDING,
			});
		}
	}

	/**
	 *
	 * @param {Object} req
	 * @param {Object} res
	 * @returns {Object} aknowldgement object
	 */
	static async approveEvent(req, res) {
		try {
			const { isApproved } = req.body;

			const findEvent = await Event.findOne({
				where: {
					slug: req.params.slug,
				},
			});

			if (!findEvent) {
				return res.status(HTTP_NOT_FOUND).json({
					error: NO_EVENT_FOUND,
				});
			}

			if (req.user.id === findEvent.dataValues.userId) {
				await Event.update(
					{
						isApproved,
					},
					{
						where: {
							id: findEvent.get().id,
						},
					}
				);

				return res.status(HTTP_OK).json({
					message: SUCCESS_UPDATED_EVENT,
				});
			}
			return res.status(HTTP_UNAUTHORIZED).json({
				error: ACCESS_DENIED,
			});
		} catch (error) {
			return res.status(HTTP_SERVER_ERROR).json({
				error: SERVER_NOT_RESPONDING,
			});
		}
	}

	/**
	 *
	 * @param {Object} req
	 * @param {Object} res
	 * @returns {Object} aknowldgement object
	 */
	static async updateEvent(req, res) {
		try {
			const {
				title,
				startDate,
				endDate,
				place,
				price,
				description,
				image,
			} = req.body;

			const findEvent = await Event.findOne({
				where: {
					slug: req.params.slug,
				},
			});

			if (!findEvent) {
				return res.status(HTTP_NOT_FOUND).json({
					error: NO_EVENT_FOUND,
				});
			}

			// if (req.user.id !== findEvent.dataValues.userId || req.user.role !== 'admin') {
			//   return res
			//     .status(HTTP_UNAUTHORIZED)
			//     .json({
			//       error: ACCESS_DENIED
			//     });
			// }

			await Event.update(
				{
					title,
					startDate,
					endDate,
					place,
					price,
					description,
					image,
				},
				{
					where: {
						id: findEvent.get().id,
					},
				}
			);

			const updatedEvent = await Event.findOne({
				where: {
					slug: req.params.slug,
				},
			});

			return res.status(HTTP_OK).json({
				message: SUCCESS_UPDATED_EVENT,
				data: updatedEvent,
			});
		} catch (error) {
			return res.status(HTTP_SERVER_ERROR).json({
				error: SERVER_NOT_RESPONDING,
			});
		}
	}
}
