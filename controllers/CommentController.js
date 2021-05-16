/* eslint-disable no-tabs */
import dotenv from 'dotenv';
import CommentHelper from '../helpers/commentHelper';
import model from '../models';
import {
  HTTP_OK,
  HTTP_CREATED,
  HTTP_NOT_FOUND,
  HTTP_SERVER_ERROR,
} from '../constants/httpStatusCodes';
import {
  SERVER_NOT_RESPONDING,
  NOT_FOUND_COMMENT,
  SUCCESS_COMMENT_CREATED,
  SUCCESS_FOUND_COMMENT,
  SUCCESS_READ_COMMENT,
  SUCCESS_COMMENT_DELETED,
  SUCCESS_CHANGED_COMMENT,
  NOT_FOUND_NEWS
} from '../constants/general';

const {
  News
} = model;

dotenv.config();

/**
 * Comment Controllers
 */
export default class CommentController {
  /**
	 *
	 * @param {Object} req
	 * @param {Object} res
	 * @returns {Object} comment object
	 */

  static async create(req, res) {
    try {
      const findNews = await News.findOne({
        where: {
          slug: req.body.slug,
        }
      });

      if (!findNews) {
        return res
          .status(HTTP_NOT_FOUND)
          .json({
            error: NOT_FOUND_NEWS,
          });
      }
      const dataBody = {
        names: req.body.names,
        email: req.body.email,
        commentBody: req.body.commentBody,
        newsId: findNews.get().id,
      };

      const createComment = await CommentHelper.createComment(dataBody);
      const {
        dataValues
      } = createComment;

      return res.status(HTTP_CREATED).json({
        status: HTTP_CREATED,
        message: SUCCESS_COMMENT_CREATED,
        comment: dataValues,
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
	 * @returns {Object} comment message object
	 */

  static async changeComment(req, res) {
    try {
      const updated = await CommentHelper.changeCommentStatus(req.params.id, req.body.status);
      await CommentHelper.notFoundComment(updated, res);
      return res.status(HTTP_OK).json({
        status: HTTP_OK,
        message: SUCCESS_CHANGED_COMMENT,
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

  static async readAllcomments(req, res) {
    try {
      const comments = await CommentHelper.readAllComment();
      // await CommentHelper.notFoundComment(comments, res);
      return res.status(HTTP_OK).json({
        message: SUCCESS_READ_COMMENT,
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
	 * @returns {Object} comment object
	 */

  static async activeComment(req, res) {
    try {
      const comments = await CommentHelper.readActiveComment(req.body.newsId);
      // await CommentHelper.notFoundComment(comments, res);
      return res.status(HTTP_OK).json({
        message: SUCCESS_FOUND_COMMENT,
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
	 * @returns {Object} comment object
	 */

  static async readAllCommentNews(req, res) {
    try {
      const findNews = await News.findOne({
        where: {
          slug: req.params.slug
        }
      });

      if (!findNews) {
        return res
          .status(HTTP_NOT_FOUND)
          .json({
            error: NOT_FOUND_NEWS,
          });
      }

      const comments = await CommentHelper.readCommentNews(findNews.get().id);
      return res.status(HTTP_OK).json({
        status: HTTP_OK,
        message: SUCCESS_FOUND_COMMENT,
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
	 * @returns {String} delete message
	 */

  static async delete(req, res) {
    try {
      const comment = await CommentHelper.deleteComment(req.params.id);
      if (comment === 0) {
        return res.status(HTTP_NOT_FOUND).json({
          error: NOT_FOUND_COMMENT,
        });
      }
      return res.status(HTTP_OK).json({
        message: SUCCESS_COMMENT_DELETED,
      });
    } catch (error) {
      return res.status(HTTP_SERVER_ERROR).json({
        error: SERVER_NOT_RESPONDING,
      });
    }
  }
}
