/* eslint-disable valid-jsdoc */
/* eslint-disable no-tabs */
import model from '../models';
import {
  HTTP_NOT_FOUND
} from '../constants/httpStatusCodes';
import {
  NOT_FOUND_COMMENT,
} from '../constants/general';

const dotenv = require('dotenv');

const {
  Comment, News, User
} = model;

dotenv.config();

/**
 * Admin middleware
 */
class CommentHelper {
  /**
	 *
	 * @param {Object} body
	 * @returns {Object} returns Comment created
	 */
  static async createComment(body) {
    const {
      names, email, commentBody, newsId
    } = body;

    const comment = {
      names,
      email,
      commentBody,
      newsId,
    };

    const addedComment = await Comment.create(comment);
    return addedComment;
  }

  /**
	 *
	 * @param {Object} body
	 * @returns {Object} returns disable Comment
	 */
  static async changeCommentStatus(id, status) {
    const disabled = await Comment.update(
      {
        isActive: status,
      },
      {
        where: {
          id,
        },
      }
    );
    return disabled;
  }

  /**
	 *
	 * @param {Object} body
	 * @returns {Object} returns read Comment on news
	 */
  static async readCommentNews(newsId) {
    const read = await Comment.findAll({
      where: {
        newsId,
        // isActive: true
      },
      order: [['createdAt', 'DESC']],
    });
    return read;
  }

  /**
	 *
	 * @param {Object} body
	 * @returns {Object} returns read active comment
	 */
  static async readActiveComment(newsId) {
    const readcomment = await Comment.findAll({
      where: {
        newsId,
        isActive: true,
      },
      include: [
        {
          model: News,
          as: 'news',
          attributes: [
            'id', 'slug',
          ],
          include: [
            {
              as: 'author',
              model: User,
              attributes: ['firstName', 'firstName', 'email']
            }
          ]
        },
      ],
    });
    return readcomment;
  }

  /**
	 *
	 * @param {Object} body
	 * @returns {Object} returns read Comment on news
	 */
  static async readAllComment() {
    const allcomments = await Comment.findAll({
      include: [
        {
          model: News,
          as: 'news',
          attributes: [
            'id', 'slug',
          ],
          include: [
            {
              as: 'author',
              model: User,
              attributes: ['firstName', 'firstName', 'email']
            }
          ]
        },
      ],
    });
    return allcomments;
  }

  /**
	 *
	 * @param {Object} body
	 * @returns {Object} returns destroy Comment
	 */
  static async deleteComment(id) {
    const deleted = await Comment.destroy({
      where: {
        id,
      },
    });
    return deleted;
  }

  static async notFoundComment(array, res) {
    if (array === null || array === undefined || array[0] !== 1) {
      return res.status(HTTP_NOT_FOUND).json({
        error: NOT_FOUND_COMMENT,
        array,
      });
    }
  }
}

export default CommentHelper;
