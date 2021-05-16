/* eslint-disable no-tabs */
import dotenv from 'dotenv';
import model from '../models';
import ConversationHelper from '../helpers/conversationHelper';
import {
  HTTP_OK,
  HTTP_CREATED,
  HTTP_SERVER_ERROR,
} from '../constants/httpStatusCodes';
import {
  sendEmailNotification
} from '../helpers/mailer/emailNofitication';
import {
  SERVER_NOT_RESPONDING,
  SUCCESS_FOUND_CONVERSATION,
  SUCCESS_CREATE_NOTIFICATION,
} from '../constants/general';

const {
  User, MemberDetails
} = model;

dotenv.config();

/**
 * Conversation Controllers
 */
export default class ConversationController {
  /**
	 *
	 * @param {Object} req
	 * @param {Object} res
	 * @returns {Object} comment object
	 */

  static async create(req, res) {
    try {
      const receiverEmail = await MemberDetails.findOne({
        where: {
          id: req.body.memberId,
        },
        include: [
          {
            as: 'user',
            model: User,
            attributes: ['id', 'email', 'role'],
          },
        ],
      });

      const addconversation = await ConversationHelper.createConversation(
        req.body,
        req.user.id
      );
      const {
        dataValues
      } = addconversation;

      if (receiverEmail.dataValues.user.id !== req.user.id) {
        await sendEmailNotification(
          receiverEmail.dataValues.user.email,
          dataValues.message,
          req.user.id
        );
      }

      return res.status(HTTP_CREATED).json({
        message: SUCCESS_CREATE_NOTIFICATION,
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
	 * @returns {Object} messages object
	 */

  static async myNotifications(req, res) {
    try {
      const comments = await ConversationHelper.unSeenMessages(req.user.id);
      // await ConversationHelper.notFoundComment(comments, res);
      return res.status(HTTP_OK).json({
        message: SUCCESS_FOUND_CONVERSATION,
        comments,
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
	 * @returns {Object} messages object
	 */

  static async adminGetNotifications(req, res) {
    try {
      const comments = await ConversationHelper.unSeenMessages();
      // await ConversationHelper.notFoundComment(comments, res);
      return res.status(HTTP_OK).json({
        message: SUCCESS_FOUND_CONVERSATION,
        comments,
      });
    } catch (error) {
      return res.status(HTTP_SERVER_ERROR).json({
        error: SERVER_NOT_RESPONDING,
      });
    }
  }
}
