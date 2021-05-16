import model from '../models';

const {
  Publication
} = model;

/**
 * publication management
 */
class PublicationHelper {
  /**
   *
   * @param {Object} body
   * @param {Object} userId user id
   * @returns {Object} returns publication created
   */
  static async createPublication(body, userId) {
    const {
      title,
      category,
      pubDocument,
    } = body;

    const publication = {
      title,
      userId,
      category,
      pubDocument
    };

    const addPublication = await Publication.create(publication);
    return addPublication;
  }
}

export default PublicationHelper;
