import dotenv from 'dotenv';
import model from '../models';
import {
  HTTP_CREATED,
  HTTP_SERVER_ERROR,
  HTTP_BAD_REQUEST,
  HTTP_NOT_FOUND,
} from '../constants/httpStatusCodes';
import {
  SERVER_NOT_RESPONDING,
  SUCCESS_REPLY_CREATED,
  NOT_REPLY_BODY_EMPTY,
  NO_MESSAGE,
} from '../constants/general';

dotenv.config();

const {
  Reply,
  Message
} = model;

/**
 * Reply Controllers
 */
export default class ReplyController {
  /**
   *
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} Reply object
  */
  static async create(req, res) {
    try {
      const {
        messageId,
        replyBody
      } = req.body;

      const senderId = req.user.id;

      if (!replyBody) {
        return res
          .status(HTTP_BAD_REQUEST)
          .json({
            error: NOT_REPLY_BODY_EMPTY
          });
      }
      const findMessage = await Message.findOne({
        where: {
          id: messageId
        }
      });

      if (!findMessage) {
        return res
          .status(HTTP_NOT_FOUND)
          .json({
            error: NO_MESSAGE,
          });
      }

      const createdReply = await Reply.create({
        senderId,
        messageId: findMessage.get().id,
        replyBody,
      });

      await Message.update({
        isSeen: true,
      }, {
        where: {
          id: findMessage.get().id
        }
      });

      return res
        .status(HTTP_CREATED)
        .json({
          message: SUCCESS_REPLY_CREATED,
          data: createdReply,
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
