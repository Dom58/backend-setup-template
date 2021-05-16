import Joi from '@hapi/joi';

/**
 *  news validaton
 */
class NewsValidation {
  /**
     * @param {object} req
     * @param {object} res
     * @param {object} next
     * @returns {Object} newsSchema object
     *
	*/
  static async newsValidator(req, res, next) {
    const newsSchema = Joi.object().keys({
      title: Joi.string().required().label('Title'),
      newsBody: Joi.string().required().label('News body'),
      image: Joi.string().required().label('Image'),
    });

    const news = {
      /**
     * create news body
     */
      title: req.body.title,
      newsBody: req.body.newsBody,
      image: req.body.image,
    };

    const checkNews = Joi.validate(news, newsSchema, {
      abortEarly: false,
    });

    if (checkNews.error) {
      const Errors = [];

      for (let i = 0; i < checkNews.error.details.length; i += 1) {
        Errors.push(
          checkNews.error.details[i].message.replace('"', ' ').replace('"', ' ')
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
     * @returns {Object} newsSlugSchema object
     *
	*/

  static async slugValidator(req, res, next) {
    const {
      slug
    } = req.params;
    switch (true) {
      case slug === null || slug === undefined:
        return res.status(400).json({
          error: 'A valid email is required',
        });
    }
    next();
  }
}

export default NewsValidation;
