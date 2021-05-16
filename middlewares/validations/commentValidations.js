/* eslint-disable no-tabs */
import Joi from '@hapi/joi';

/**
 *  comment validaton
 */
class CommentValidation {
  /**
	 * @param {object} req
	 * @param {object} res
	 * @param {object} next
	 * @returns {Object} commentSchema object
	 *
	 */

  static async commentValidator(req, res, next) {
    const commentSchema = Joi.object().keys({
      names: Joi.string().required().label('Names'),
      email: Joi.string().email().insensitive().required()
        .label('Email'),
      commentBody: Joi.string().required().label('Comment body'),
      slug: Joi.string().required().label('Slug'),
    });

    const comment = {
      /**
			 * create comment body
			 */
      names: req.body.names,
      email: req.body.email,
      commentBody: req.body.commentBody,
      slug: req.body.slug
    };

    const checkComment = Joi.validate(comment, commentSchema, {
      abortEarly: false,
    });

    if (checkComment.error) {
      const Errors = [];

      for (let i = 0; i < checkComment.error.details.length; i += 1) {
        Errors.push(
          checkComment.error.details[i].message.replace('"', ' ').replace('"', ' ')
        );
      }

      return res.status(400).json({
        Errors,
      });
    }

    next();
  }

  /**
	 * @param {object} req
	 * @param {object} res
	 * @param {object} next
	 * @returns {Object} commentSchema object
	 *
	 */

  static async statusValidator(req, res, next) {
    const commentSchema = Joi.object().keys({
      status: Joi.string().required().label('status'),
    });

    const commentStatus = {
      /**
			 * create commentStatus status
			 */
      status: req.body.status,
    };

    const checkStatus = Joi.validate(commentStatus, commentSchema, {
      abortEarly: false,
    });

    if (checkStatus.error) {
      const Errors = [];

      for (let i = 0; i < checkStatus.error.details.length; i += 1) {
        Errors.push(
          checkStatus.error.details[i].message.replace('"', ' ').replace('"', ' ')
        );
      }

      return res.status(400).json({
        Errors,
      });
    }

    next();
  }

  /**
	 * @param {object} req
	 * @param {object} res
	 * @param {object} next
	 * @returns {Object} commentSlugSchema object
	 *
	 */

  static async idValidator(req, res, next) {
    const commentSchema = Joi.object().keys({
      id: Joi.string().required().label('id'),
    });

    const itemId = {
      /**
			 * params id
			 */
      id: req.params.id,
    };

    const checkStatus = Joi.validate(itemId, commentSchema, {
      abortEarly: false,
    });

    if (checkStatus.error) {
      const Errors = [];

      for (let i = 0; i < checkStatus.error.details.length; i += 1) {
        Errors.push(
          checkStatus.error.details[i].message.replace('"', ' ').replace('"', ' ')
        );
      }

      return res.status(400).json({
        Errors,
      });
    }

    next();
  }
}

export default CommentValidation;
