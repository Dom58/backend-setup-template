import Joi from '@hapi/joi';
import {
  HTTP_BAD_REQUEST
} from '../../constants/httpStatusCodes';

/**
 *  Publication validator
 */
class PublicationValidation {
  /**
    * @param {object} req
    * @param {object} res
    * @param {object} next
    * @returns {Object} Publication Schema object
    *
  */
  static async publicationValidator(req, res, next) {
    const createPubSchema = Joi.object().keys({
      title: Joi.string().required().label('Title'),
      pubDocument: Joi.string().required().label('Document'),
    });

    const publication = {
      /**
       * create publication body
       */
      title: req.body.title,
      pubDocument: req.body.pubDocument,
    };

    const checkPublication = Joi.validate(publication, createPubSchema, {
      abortEarly: false
    });

    if (checkPublication.error) {
      const Errors = [];

      for (let i = 0; i < checkPublication.error.details.length; i += 1) {
        Errors.push(checkPublication.error.details[i].message.replace('"', ' ').replace('"', ' '));
      }

      return res.status(HTTP_BAD_REQUEST).json({
        Errors
      });
    }

    next();
  }
}

export default PublicationValidation;
