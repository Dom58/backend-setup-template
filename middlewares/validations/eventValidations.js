import Joi from '@hapi/joi';
import {
  HTTP_BAD_REQUEST
} from '../../constants/httpStatusCodes';

/**
 *  Event validator
 */
class EventValidation {
  /**
    * @param {object} req
    * @param {object} res
    * @param {object} next
    * @returns {Object} EventSchema object
    *
  */
  static async eventValidator(req, res, next) {
    const createEventSchema = Joi.object().keys({
      title: Joi.string().required().label('Title'),
      startDate: Joi.date().required().label('Start Date'),
      endDate: Joi.date().required().label('End Date'),
      place: Joi.string().required().label('Place'),
      price: Joi.number().min(0).label('Price'),
      description: Joi.string().required().allow(''),
    });

    const event = {
      /**
       * create event body
       */
      title: req.body.title,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      place: req.body.place,
      price: req.body.price,
      description: req.body.description
    };

    const checkEvent = Joi.validate(event, createEventSchema, {
      abortEarly: false
    });

    if (checkEvent.error) {
      const Errors = [];

      for (let i = 0; i < checkEvent.error.details.length; i += 1) {
        Errors.push(checkEvent.error.details[i].message.replace('"', ' ').replace('"', ' '));
      }

      return res.status(HTTP_BAD_REQUEST).json({
        Errors
      });
    }

    next();
  }
}

export default EventValidation;
