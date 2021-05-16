/* eslint-disable no-tabs */
import dotenv from 'dotenv';
import model from '../models';
import NewsHelper from '../helpers/newsHelper';
import { sendToSubscribers } from '../helpers/mailer/maillist';
import {
	HTTP_OK,
	HTTP_CREATED,
	HTTP_NOT_FOUND,
	HTTP_SERVER_ERROR,
} from '../constants/httpStatusCodes';
import {
	SERVER_NOT_RESPONDING,
	NOT_FOUND_NEWS,
	SUCCESS_NEWS_CREATED,
	SUCCESS_FOUND_NEWS,
	SUCCESS_READ_NEWS,
	SUCCESS_PUBLISH_NEWS,
	SUCCESS_NEWS_UPDATED,
	SUCCESS_NEWS_DELETED,
	SUCCESS_FETCH_NEWS,
	SUCCESS_FETCH_FIVE_NEWS,
} from '../constants/general';

const { News, User, Read, Comment, Maillist } = model;

dotenv.config();

/**
 * News Controllers
 */
export default class NewsController {
	/**
	 *
	 * @param {Object} req
	 * @param {Object} res  get all created news
	 * @returns {Object} return all created news
	 */
	static async retrieveNews(req, res) {
		try {
			// @pagination
			let page, limit;
			if (Object.keys(req.query).length === 0) {
				page = 1;
				limit = 10;
			} else if (req.query.limit === undefined) {
				({ page } = req.query);
				limit = 10;
			} else {
				({ page, limit } = req.query);
			}
			// @retrieve news
			const allNews = await News.findAll({
				include: [
					{
						as: 'author',
						model: User,
						attributes: [
							'id',
							'firstName',
							'lastName',
							'email',
							'organization',
						],
					},
					{
						as: 'comments',
						model: Comment,
						attributes: [
							'id',
							'names',
							'email',
							'commentBody',
							'newsId',
							'createdAt',
						],
					},
					{
						as: 'views',
						model: Read,
						attributes: ['id', 'newsSlug', 'numberOfReading'],
					},
				],
				order: [['createdAt', 'DESC']],
				offset: (parseInt(page, 10) - 1) * limit,
				limit,
			});

			const totalNews = await News.findAll();
			return res.status(HTTP_OK).json({
				status: HTTP_OK,
				news: allNews,
				metadata: {
					currentPage: parseInt(page, 10),
					previousPage: parseInt(page, 10) > 1 ? parseInt(page, 10) - 1 : null,
					nextPage:
						Math.ceil(totalNews.length / limit) > page
							? parseInt(page, 10) + 1
							: null,
					totalPages: Math.ceil(totalNews.length / limit),
					limit: parseInt(limit, 10),
				},
				message: SUCCESS_FETCH_NEWS,
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
	 * @param {Object} res  get all created 5 news
	 * @returns {Object} return all created 5 news
	 */
	static async retrieveFiveNews(req, res) {
		try {
			// @retrieve news
			const fiveNews = await News.findAll({
				where: {
					isPublished: true,
				},
				include: [
					{
						as: 'author',
						model: User,
						attributes: [
							'id',
							'firstName',
							'lastName',
							'email',
							'organization',
						],
					},
				],
				order: [['createdAt', 'DESC']],
				offset: (parseInt(1, 5) - 1) * 5,
				limit: 5,
			});

			return res.status(HTTP_OK).json({
				status: HTTP_OK,
				message: SUCCESS_FETCH_FIVE_NEWS,
				newsCount: fiveNews.length,
				news: fiveNews,
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
	 * @returns {Object} news object
	 */

	static async create(req, res) {
		try {
			const createNews = await NewsHelper.createNews(req.body, req.user.id);
			const { dataValues } = createNews;

			const findSubscribes = await Maillist.findAll();
			const sendingtoAll = findSubscribes.map(async i => {
				const sendMail = await sendToSubscribers(
					i.email,
					dataValues.newsBody,
					`[Blog] ${dataValues.title}`,
					`blog/${dataValues.slug}`,
					i.id
				);
				return {
					sendMail,
				};
			});

			await Promise.all(sendingtoAll); // end send mail

			return res.status(HTTP_CREATED).json({
				status: HTTP_CREATED,
				message: SUCCESS_NEWS_CREATED,
				dataValues,
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
	 * @returns {Object} news object
	 */

	static async update(req, res) {
		try {
			const { title, newsBody, authorId, image } = req.body;

			const findNews = await News.findOne({
				where: {
					slug: req.params.slug,
				},
			});

			if (!findNews) {
				return res.status(HTTP_NOT_FOUND).json({
					error: NOT_FOUND_NEWS,
				});
			}

			await News.update(
				{
					title,
					newsBody,
					authorId,
					image,
				},
				{
					where: {
						id: findNews.get().id,
					},
				}
			);

			const updatedNews = await News.findOne({
				where: {
					slug: req.params.slug,
				},
			});

			return res.status(HTTP_OK).json({
				message: SUCCESS_NEWS_UPDATED,
				data: updatedNews,
			});
		} catch (error) {
			return res.status(HTTP_SERVER_ERROR).json({
				error: SERVER_NOT_RESPONDING,
			});
		}
	}

	/**
	 * @param {Object} req
	 * @param {Object} res
	 * @returns {String} acknowledgement message
	 *
	 */
	static async publish(req, res) {
		try {
			const findNews = await News.findOne({
				where: {
					slug: req.params.slug,
				},
			});
			if (!findNews) {
				return res.status(HTTP_NOT_FOUND).json({
					status: HTTP_NOT_FOUND,
					error: NOT_FOUND_NEWS,
				});
			}

			await NewsHelper.publishNews(req.params.slug, req.body.isPublished);

			return res.status(HTTP_OK).json({
				message: SUCCESS_PUBLISH_NEWS,
			});
		} catch (error) {
			return res.status(HTTP_SERVER_ERROR).json({
				message: SERVER_NOT_RESPONDING,
			});
		}
	}

	/**
	 *
	 * @param {Object} req
	 * @param {Object} res
	 * @returns {Object} user object
	 */

	static async read(req, res) {
		const { slug } = req.params;
		try {
			const findNews = await News.findOne({
				where: {
					slug,
				},
				include: [
					{
						model: Read,
						as: 'views',
						attributes: ['numberOfReading'],
					},
					{
						model: Comment,
						as: 'comments',
						where: {
							isActive: true,
						},
						required: false,
						attributes: [
							'id',
							'names',
							'email',
							'commentBody',
							'isActive',
							'createdAt',
						],
					},
				],
			});

			if (!findNews) {
				return res.status(HTTP_NOT_FOUND).json({
					error: NOT_FOUND_NEWS,
				});
			}

			await NewsHelper.countView(slug);
			return res.status(HTTP_OK).json({
				status: HTTP_OK,
				message: SUCCESS_READ_NEWS,
				news: findNews.get(),
			});
		} catch (error) {
			return res.status(HTTP_SERVER_ERROR).json({
				error: SERVER_NOT_RESPONDING,
			});
		}
	}
	/**
	 *
	 // eslint-disable-next-line no-tabs
	 * @param {Object} req
	 * @param {Object} res
	 * @returns {Object} news object
	 */

	static async myNews(req, res) {
		try {
			const news = await NewsHelper.findMyNews(req.user.id);
			return res.status(HTTP_OK).json({
				message: SUCCESS_FOUND_NEWS,
				news,
			});
		} catch (error) {
			return res.status(HTTP_SERVER_ERROR).json({
				error: SERVER_NOT_RESPONDING,
			});
		}
	}

	/**
	 *
	 // eslint-disable-next-line no-tabs
	 * @param {Object} req
	 * @param {Object} res
	 * @returns {String} delete message
	 */

	static async delete(req, res) {
		try {
			const news = await NewsHelper.deleteNews(req.params.slug);
			if (news === 0) {
				return res.status(HTTP_NOT_FOUND).json({
					error: NOT_FOUND_NEWS,
				});
			}
			return res.status(HTTP_OK).json({
				message: SUCCESS_NEWS_DELETED,
			});
		} catch (error) {
			return res.status(HTTP_SERVER_ERROR).json({
				error: SERVER_NOT_RESPONDING,
			});
		}
	}
}
