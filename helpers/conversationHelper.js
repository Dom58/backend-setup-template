/* eslint-disable valid-jsdoc */
/* eslint-disable no-tabs */
import model from '../models';
import {
  HTTP_NOT_FOUND
} from '../constants/httpStatusCodes';
import {
  NOT_FOUND_COMMENT,
} from '../constants/general';
// import {
//   sendEmailNotification
// } from './mailer/emailNofitication';

const dotenv = require('dotenv');

const {
  Conversation, User
} = model;

dotenv.config();

/**
 * Admin middleware
 */
class ConversationHelper {
  /**
	 *
	 * @param {Object} body
	 * @returns {Object} returns Conversation created
	 */
  static async createConversation(body, senderId) {
    const {
      memberId, message,
    } = body;

    const comment = {
      memberId,
      senderId,
      message,
    };

    const addedComment = await Conversation.create(comment);
    return addedComment;
  }

  /**
	 *
	 * @param {Object} body
	 * @returns {Object} returns read Conversation on news
	 */
  static async readConversation(memberId) {
    // in table of membership not conversation
    const read = await Conversation.findAll({
      where: {
        memberId
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: [
            'id', 'email', 'firstName', 'lastName', 'role', 'organization'
          ],
        },
      ],
    });
    return read;
  }

  /**
	 *
	 * @param {Object} body
	 * @returns {Object} returns read active comment
	 */
  static async unSeenMessages(memberId) {
    const readcomment = await Conversation.findAll({
      where: {
        memberId,
        seen: false,
        senderId: !memberId
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: [
            'id', 'email', 'firstName', 'lastName', 'role', 'organization'
          ],
        },
      ],
    });
    return readcomment;
  }

  // /**
  //  *
  //  * @param {Object} body
  //  * @returns {Object} returns read comment
  //  */
  // static async changeConversationStatus(id, authId) {
  //   const readcomment = await Conversation.update({
  //     seen: true,
  //   },
  //   {
  //     where: {
  //       id,
  //       senderId: !authId,
  //     },
  //   });
  //   return readcomment;
  // }

  static async notFoundComment(array, res) {
    if (array === null || array === undefined || array[0] !== 1) {
      return res.status(HTTP_NOT_FOUND).json({
        error: NOT_FOUND_COMMENT,
        array,
      });
    }
  }
}

export default ConversationHelper;
