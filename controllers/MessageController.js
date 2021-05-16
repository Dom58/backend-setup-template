import dotenv from 'dotenv';
import model from '../models';
import {
  HTTP_CREATED,
  HTTP_SERVER_ERROR,
  HTTP_BAD_REQUEST,
  HTTP_NOT_FOUND,
  HTTP_OK
} from '../constants/httpStatusCodes';
import {
  SERVER_NOT_RESPONDING,
  SUCCESS_MESSAGE_CREATED,
  NOT_FOUND_EMPTY_MEMBER,
  NOT_MESSAGE_BODY_EMPTY,
  NO_MESSAGE,
} from '../constants/general';

dotenv.config();

const {
  User,
  Message,
  Reply,
} = model;

/**
 * Message Controllers
 */
export default class MessageController {
  /**
   *
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} message object
  */
  static async create(req, res) {
    try {
      const {
        recieverId,
        messageBody
      } = req.body;
      const senderId = req.user.id;

      if (!messageBody) {
        return res
          .status(HTTP_BAD_REQUEST)
          .json({
            error: NOT_MESSAGE_BODY_EMPTY
          });
      }

      let receiverIds = null;
      if (recieverId.length > 0) {
        receiverIds = recieverId.split(',');
      } else {
        receiverIds = [];
        return res
          .status(HTTP_BAD_REQUEST)
          .json({
            error: NOT_FOUND_EMPTY_MEMBER
          });
      }

      receiverIds.map(async (itemId) => {
        const findUser = await User.findByPk(itemId);

        await Message.create({
          senderId,
          receiverId: findUser.get().id,
          messageBody,
        });
      });

      return res
        .status(HTTP_CREATED)
        .json({
          message: SUCCESS_MESSAGE_CREATED,
        });
    } catch (error) {
      return res
        .status(HTTP_SERVER_ERROR)
        .json({
          error: SERVER_NOT_RESPONDING
        });
    }
  }

  /**
   *
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} message object
  */
  static async getMyMessage(req, res) {
    try {
      const findMessage = await Message.findOne({
        where: {
          id: req.params.id
        },
      });

      if (!findMessage) {
        return res
          .status(HTTP_NOT_FOUND)
          .json({
            error: NO_MESSAGE
          });
      }

      await Message.update({
        isSeen: true,
      }, {
        where: {
          id: findMessage.dataValues.id
        }
      });

      const findMessageUpdated = await Message.findOne({
        where: {
          id: findMessage.dataValues.id
        },
        include: [
          {
            as: 'createdBy',
            model: User,
            attributes: ['id', 'firstName', 'lastName', 'email', 'organization', 'role'],
          },
          {
            as: 'replies',
            model: Reply,
            attributes: ['id', 'replyBody', 'senderId', 'createdAt', 'updatedAt'],
          },
        ]
      });

      return res
        .status(HTTP_OK)
        .json({
          data: findMessageUpdated
        });
    } catch (error) {
      return res
        .status(HTTP_SERVER_ERROR)
        .json({
          error: SERVER_NOT_RESPONDING
        });
    }
  }

  /**
   *
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} message object
  */
  static async getMyMessages(req, res) {
    try {
      const myMessages = await Message.findAll({
        where: {
          receiverId: req.user.id
        },
        order: [['createdAt', 'DESC']],
        include: [
          {
            as: 'createdBy',
            model: User,
            attributes: ['id', 'firstName', 'lastName', 'email', 'organization', 'role'],
          },
          {
            as: 'replies',
            model: Reply,
            attributes: ['id', 'replyBody', 'senderId', 'createdAt', 'updatedAt'],
          },
        ]
      });

      if (!myMessages.length) {
        return res
          .status(HTTP_NOT_FOUND)
          .json({
            error: NO_MESSAGE
          });
      }

      return res
        .status(HTTP_OK)
        .json({
          myMessagesCount: myMessages.length,
          data: myMessages
        });
    } catch (error) {
      return res
        .status(HTTP_SERVER_ERROR)
        .json({
          error: SERVER_NOT_RESPONDING
        });
    }
  }

  /**
   *
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} message object
  */
  static async getSends(req, res) {
    try {
      const myMessages = await Message.findAll({
        where: {
          senderId: req.user.id
        },
        order: [['createdAt', 'DESC']],
        include: [
          {
            as: 'receivedBy',
            model: User,
            attributes: ['id', 'firstName', 'lastName', 'email', 'organization', 'role'],
          },
          {
            as: 'replies',
            model: Reply,
            attributes: ['id', 'replyBody', 'senderId', 'createdAt', 'updatedAt'],
          },
        ],
      });

      if (!myMessages.length) {
        return res
          .status(HTTP_NOT_FOUND)
          .json({
            error: NO_MESSAGE
          });
      }

      return res
        .status(HTTP_OK)
        .json({
          myMessagesCount: myMessages.length,
          data: myMessages
        });
    } catch (error) {
      return res
        .status(HTTP_SERVER_ERROR)
        .json({
          error: SERVER_NOT_RESPONDING
        });
    }
  }
}
