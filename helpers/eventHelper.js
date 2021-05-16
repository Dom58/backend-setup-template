import model from '../models';

const dotenv = require('dotenv');

const {
  Event
} = model;

dotenv.config();

/**
 * Event management
 */
class EventHelper {
  /**
   *
   * @param {Object} body
   * @param {Object} userId user id
   * @returns {Object} returns event created
   */
  static async createEvent(body, userId) {
    const {
      title,
      startDate,
      endDate,
      place,
      price,
      description,
      image
    } = body;

    const event = {
      title,
      userId,
      startDate,
      endDate,
      place,
      price,
      description,
      image,
    };

    const addedEvent = await Event.create(event);
    return addedEvent;
  }

  /**
   *
   * @param {Object} body
   * @param {Object} condition where consition
   * @returns {Object} returns event created
   */
  static async updateEvent(body, condition) {
    const {
      title,
      startDate,
      endDate,
      place,
      price,
      description,
      image
    } = body;

    const event = {
      title,
      startDate,
      endDate,
      place,
      price,
      description,
      image,
    };

    const updateEvent = await Event.update(event, condition);
    return updateEvent;
  }
}

export default EventHelper;
