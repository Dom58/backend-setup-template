import dotenv from 'dotenv';
import model from '../models';
import PublicationHelper from '../helpers/publicationHelper';
import {
  sendPubtoScribers
} from '../helpers/mailer/maillist';
import {
  HTTP_OK,
  HTTP_CREATED,
  HTTP_NOT_FOUND,
  HTTP_SERVER_ERROR,
} from '../constants/httpStatusCodes';
import {
  SERVER_NOT_RESPONDING,
  SUCCESS_PUBLICATION_CREATED,
  NO_PUBLICATION_FOUND,
  SUCCESS_UPDATED_PUBLICATION,
  SUCCESS_DELETED,
  PUBLICATION_SUCCESS_UPDATED,
} from '../constants/general';

dotenv.config();

const {
  User,
  Publication,
  Maillist,
} = model;

/**
 * PublicactionController Controllers
 */
export default class PublicactionController {
  /**
   *
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} Publicaction Controller object
  */
  static async create(req, res) {
    try {
      const createdPub = await PublicationHelper.createPublication(req.body, req.user.id);
      // end send mail
      const {
        dataValues
      } = createdPub;
      const findSubscribes = await Maillist.findAll();
      const sendingtoAll = findSubscribes.map(async (i) => {
        const sendMail = await sendPubtoScribers(
          i.email,
          dataValues.pubDocument,
          dataValues.title,
          i.id
        );
        return {
          sendMail,
        };
      });

      await Promise.all(sendingtoAll); // end send mail
      return res
        .status(HTTP_CREATED)
        .json({
          message: SUCCESS_PUBLICATION_CREATED,
          data: dataValues,
        });
    } catch (error) {
      return res
        .status(HTTP_SERVER_ERROR)
        .json({
          error: SERVER_NOT_RESPONDING
        });
    }
  }

  /**
   *
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} return Publication object
  */
  static async getPublications(req, res) {
    try {
      const publications = await Publication.findAll({
        order: [['createdAt', 'DESC']],
        include: [
          {
            as: 'user',
            model: User,
            attributes: ['id', 'firstName', 'lastName', 'email', 'organization', 'role'],
          },
        ]
      });

      if (!publications.length) {
        return res
          .status(HTTP_NOT_FOUND)
          .json({
            error: NO_PUBLICATION_FOUND
          });
      }

      return res
        .status(HTTP_OK)
        .json({
          publicationsCount: publications.length,
          data: publications
        });
    } catch (error) {
      return res
        .status(HTTP_SERVER_ERROR)
        .json({
          error: SERVER_NOT_RESPONDING
        });
    }
  }

  /**
   *
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} return updated Publication object
  */
  static async approvePublication(req, res) {
    try {
      const {
        status
      } = req.body;

      const findPublication = await Publication.findOne({
        where: {
          id: req.params.id
        }
      });

      if (!findPublication) {
        return res
          .status(HTTP_NOT_FOUND)
          .json({
            error: NO_PUBLICATION_FOUND
          });
      }

      await Publication.update({
        status
      }, {
        where: {
          id: findPublication.get().id
        }
      });

      return res
        .status(HTTP_OK)
        .json({
          message: SUCCESS_UPDATED_PUBLICATION
        });
    } catch (error) {
      return res
        .status(HTTP_SERVER_ERROR)
        .json({
          error: SERVER_NOT_RESPONDING
        });
    }
  }

  /**
   *
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} return publication object
  */
  static async getPublication(req, res) {
    try {
      const findPublication = await Publication.findOne({
        where: {
          id: req.params.id
        },
        include: [
          {
            as: 'user',
            model: User,
            attributes: ['id', 'firstName', 'lastName', 'email', 'organization', 'role'],
          },
        ]
      });

      if (!findPublication) {
        return res
          .status(HTTP_NOT_FOUND)
          .json({
            error: NO_PUBLICATION_FOUND
          });
      }

      return res
        .status(HTTP_OK)
        .json({
          data: findPublication.dataValues
        });
    } catch (error) {
      return res
        .status(HTTP_SERVER_ERROR)
        .json({
          error: SERVER_NOT_RESPONDING
        });
    }
  }

  /**
   *
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} return message
  */
  static async deletePublication(req, res) {
    try {
      const findPublication = await Publication.findOne({
        where: {
          id: req.params.id
        }
      });

      if (!findPublication) {
        return res
          .status(HTTP_NOT_FOUND)
          .json({
            error: NO_PUBLICATION_FOUND
          });
      }

      await Publication.destroy({
        where: {
          id: findPublication.get().id
        },
      });
      return res
        .status(HTTP_OK)
        .json({
          message: SUCCESS_DELETED
        });
    } catch (error) {
      return res
        .status(HTTP_SERVER_ERROR)
        .json({
          error: SERVER_NOT_RESPONDING
        });
    }
  }

  /**
   *
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} return object
  */
  static async updatePublication(req, res) {
    try {
      const {
        title, category, pubDocument
      } = req.body;

      const findPublication = await Publication.findOne({
        where: {
          id: req.params.id
        }
      });

      if (!findPublication) {
        return res
          .status(HTTP_NOT_FOUND)
          .json({
            error: NO_PUBLICATION_FOUND,
          });
      }

      await Publication.update({
        title,
        category,
        pubDocument,
      }, {
        where: {
          id: findPublication.get().id
        }
      });

      const updatedPublication = await Publication.findOne({
        where: {
          id: req.params.id
        }
      });

      return res
        .status(HTTP_OK)
        .json({
          message: PUBLICATION_SUCCESS_UPDATED,
          data: updatedPublication
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
