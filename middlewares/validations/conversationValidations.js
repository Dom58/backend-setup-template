/* eslint-disable no-tabs */
import Joi from '@hapi/joi';

/**
 *  comment validaton
 */
class ConversationValidation {
  /**
	 * @param {object} req
	 * @param {object} res
	 * @param {object} next
	 * @returns {Object} commentSchema object
	 *
	 */

  static async conversationValidator(req, res, next) {
    const commentSchema = Joi.object().keys({
      message: Joi.string().required().label('message body'),
      memberId: Joi.string().required().label('member id'),
    });

    const comment = {
      /**
			 * create comment body
			 */
      message: req.body.message,
      memberId: req.body.memberId
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

export default ConversationValidation;
