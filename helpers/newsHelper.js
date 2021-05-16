/* eslint-disable valid-jsdoc */
/* eslint-disable no-tabs */
import model from '../models';
import {
  HTTP_NOT_FOUND,
} from '../constants/httpStatusCodes';
import {
  NOT_FOUND_NEWS,
} from '../constants/general';

const dotenv = require('dotenv');

const {
  News, Read,
} = model;

dotenv.config();

/**
 * Admin middleware
 */
class NewsHelper {
  /**
	 *
	 * @param {Object} body
	 * @returns {Object} returns News created
	 */
  static async createNews(body, authorId) {
    const {
      title, newsBody, image
    } = body;

    const news = {
      title,
      newsBody,
      authorId,
      image,
    };

    const addedNews = await News.create(news);
    return addedNews;
  }

  /**
	 *
	 * @param {Object} body
	 * @returns {Object} returns all my News
	 */
  static async findMyNews(authorId) {
    const myNews = await News.findAll({
      where: {
        authorId,
      },
    });
    return myNews;
  }

  /**
	 *
	 * @param {Object} body
	 * @returns {Object} returns published News
	 */
  static async publishNews(slug, status) {
    const published = await News.update(
      {
        isPublished: status,
      },
      {
        where: {
          slug,
          // authorId,
        },
      }
    );
    return published;
  }

  static async countView(newsSlug) {
    const [result, created] = await Read.findOrCreate({
      where: {
        newsSlug,
      },
      defaults: {
        numberOfReading: 1,
      },
    });
    if (!created) {
      const viewed = await Read.update(
        {
          numberOfReading: result.numberOfReading + 1,
        },
        {
          where: {
            newsSlug,
          },
          returning: true,
        }
      );
      return viewed;
    }
    return result;
  }

  /**
	 *
	 * @param {Object} body
	 * @returns {Object} returns destroy News
	 */
  static async deleteNews(slug) {
    const deleted = await News.destroy({
      where: {
        slug,
      },
    });
    return deleted;
  }

  static async notFoundNews(array, res) {
    if (array === null || array === undefined || array[0] !== 1) {
      return res.status(HTTP_NOT_FOUND).json({
        error: NOT_FOUND_NEWS,
        array
      });
    }
  }
}

export default NewsHelper;
