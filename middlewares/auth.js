import {
  decode
} from '../utils/tokens';
import {
  HTTP_UNAUTHORIZED
} from '../constants/httpStatusCodes';
import {
  NOT_SIGNED_IN,
  INVALID_TOKEN,
  IS_ADMIN
} from '../constants/general';

/**
 * authentication middleware
 */
class Authentication {
  /**
   *
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns{object} user object
   */
  static async checkAuthentication(req, res, next) {
    try {
      const {
        token
      } = req.headers;

      if (!token) {
        return res
          .status(HTTP_UNAUTHORIZED)
          .json({
            code: HTTP_UNAUTHORIZED,
            errors: {
              auth: NOT_SIGNED_IN
            }
          });
      }

      const decodedToken = await decode(token);
      if (decodedToken.error || !decodedToken) {
        return res
          .status(HTTP_UNAUTHORIZED)
          .json({
            code: HTTP_UNAUTHORIZED,
            errors: {
              auth: INVALID_TOKEN
            }
          });
      }

      req.user = decodedToken;
      next();
    } catch (error) {
      return res
        .status(HTTP_UNAUTHORIZED)
        .json({
          code: HTTP_UNAUTHORIZED,
          errors: {
            auth: INVALID_TOKEN
          }
        });
    }
  }

  /**
   *
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns{object} admin object
   */
  static async isAdmin(req, res, next) {
    try {
      const {
        token
      } = req.headers;

      if (!token) {
        return res
          .status(HTTP_UNAUTHORIZED)
          .json({
            code: HTTP_UNAUTHORIZED,
            errors: {
              auth: NOT_SIGNED_IN
            }
          });
      }

      const decodedToken = await decode(token);
      if (decodedToken.error || !decodedToken) {
        return res
          .status(HTTP_UNAUTHORIZED)
          .json({
            code: HTTP_UNAUTHORIZED,
            errors: {
              auth: INVALID_TOKEN
            }
          });
      }

      if (decodedToken.role !== 'admin') {
        return res
          .status(HTTP_UNAUTHORIZED)
          .json({
            code: HTTP_UNAUTHORIZED,
            errors: {
              auth: IS_ADMIN
            }
          });
      }

      req.user = decodedToken;
      next();
    } catch (error) {
      return res
        .status(HTTP_UNAUTHORIZED)
        .json({
          code: HTTP_UNAUTHORIZED,
          errors: {
            auth: INVALID_TOKEN
          }
        });
    }
  }
}
export default Authentication;
