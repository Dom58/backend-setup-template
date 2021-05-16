import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import model from '../models';
import {
  generate as generateToken,
  decode as decodeToken,
} from '../utils/tokens';
import CreateUserHelper from '../helpers/userHelper';
import {
  memberAccountConfirmUrl,
  membershipApprovalEmail,
} from '../helpers/mailer/resetAccount';
import {
  HTTP_OK,
  HTTP_CREATED,
  HTTP_UNAUTHORIZED,
  HTTP_NOT_FOUND,
  HTTP_SERVER_ERROR,
} from '../constants/httpStatusCodes';
import {
  SERVER_NOT_RESPONDING,
  NOT_FOUND_USER,
  NOT_SIGNED_IN,
  SALT_ROUNDS,
  INVALID_TOKEN,
  NO_USER_CREATED,
  SUCCESS_MEMBER_CREATED,
  SUCCESS_COMPLETE_ACCOUNT,
  NOT_FOUND_MEMBER,
  SUCCESS_APPROVED_MEMBER,
  SUCCESS_PENDED_MEMBER,
  ACCOUNT_STATUS_EMAIL_MESSAGE,
  ACCOUNT_STATUS_EMAIL_DENIED_MESSAGE
} from '../constants/general';

dotenv.config();

const {
  User,
  MemberDetails,
  Conversation
} = model;

/**
 * User Controllers
 */
export default class MemberController {
  /**
   * @param {Object} req
   * @param {Object} res
   * @returns {String} return token response
   *
  */
  static async createMember(req, res) {
    try {
      const createMember = await CreateUserHelper.createMember(req.body);

      delete createMember.dataValues.password;
      const {
        email, firstName, lastName
      } = createMember.dataValues;

      const token = await generateToken({
        id: createMember.get().id,
        firstName: createMember.get().firstName,
        lastName: createMember.get().lastName,
        email: createMember.get().email,
        phoneNumber: createMember.get().phoneNumber,
        role: createMember.get().role,
        accountStatus: createMember.get().accountStatus,
        isActive: createMember.get().isActive,
      });

      await MemberDetails.create({
        userId: createMember.get().id
      });

      await memberAccountConfirmUrl(token, email, firstName, lastName);
      return res
        .status(HTTP_CREATED)
        .json({
          message: SUCCESS_MEMBER_CREATED,
          token,
          email,
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
   * @param {Object} req
   * @param {Object} res
   * @returns {String} return member response
   *
  */
  static async verifyMember(req, res) {
    try {
      const {
        token,
        password,
        description,
        backgroundCover,
        documentsURL,
        websiteLink,
      } = req.body;

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

      const tokenData = await decodeToken(token);

      if (tokenData.error || !tokenData) {
        return res
          .status(HTTP_UNAUTHORIZED)
          .json({
            code: HTTP_UNAUTHORIZED,
            errors: {
              auth: INVALID_TOKEN
            }
          });
      }

      const findMember = await MemberDetails.findOne({
        where: {
          userId: tokenData.id
        }
      });

      if (!findMember) {
        return res
          .status(HTTP_NOT_FOUND)
          .json({
            error: NOT_FOUND_MEMBER
          });
      }

      const hashPassword = await bcrypt.hash(password, SALT_ROUNDS);
      await User.update({
        password: hashPassword,
        isActive: true,
      }, {
        where: {
          id: findMember.get().userId
        },
        paranoid: false
      });

      let documentsURLs = null;

      if (documentsURL) {
        documentsURLs = documentsURL.split(',');
      } else {
        documentsURLs = [];
      }

      await MemberDetails.update({
        description,
        backgroundCover,
        documentsURL: documentsURLs || [],
        websiteLink,
      }, {
        where: {
          id: findMember.get().id
        }
      });

      const findMemberUpdated = await MemberDetails.findOne({
        where: {
          userId: tokenData.id
        }
      });

      const allDocumentsURLs = [];
      findMemberUpdated.dataValues.documentsURL.forEach((el) => allDocumentsURLs.push({
        documentName: el
      }));

      return res
        .status(HTTP_OK)
        .json({
          message: SUCCESS_COMPLETE_ACCOUNT,
          data: {
            ...findMemberUpdated.dataValues,
            documentsURL: allDocumentsURLs,
          }
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
   * @param {Object} req
   * @param {Object} res
   * @returns {String} return response
   *
  */
  static async approveMember(req, res) {
    try {
      const {
        accountStatus,
      } = req.body;

      const findUser = await User.findOne({
        where: {
          id: req.params.id
        }
      });

      if (!findUser) {
        return res
          .status(HTTP_NOT_FOUND)
          .json({
            error: NOT_FOUND_USER
          });
      }

      await User.update({
        accountStatus,
      }, {
        where: {
          id: findUser.dataValues.id
        }
      });

      const {
        email, firstName, lastName
      } = findUser.dataValues;

      await membershipApprovalEmail(
        email,
        firstName,
        lastName,
        accountStatus === 'approved'
          ? ACCOUNT_STATUS_EMAIL_MESSAGE
          : ACCOUNT_STATUS_EMAIL_DENIED_MESSAGE
      );

      const findUserUpdated = await User.findOne({
        where: {
          id: findUser.dataValues.id
        }
      });

      delete findUserUpdated.dataValues.password;
      return res
        .status(HTTP_OK)
        .json({
          message: accountStatus === 'approved'
            ? SUCCESS_APPROVED_MEMBER
            : SUCCESS_PENDED_MEMBER,
          data: findUserUpdated.dataValues
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
   * @param {Object} req
   * @param {Object} res
   * @returns {String} all users response and count
   *
  */
  static async getAllMembers(req, res) {
    try {
      const members = await User.findAll({
        where: {
          role: 'member'
        },
        order: [['createdAt', 'DESC']],
        attributes: ['id', 'firstName', 'lastName', 'email', 'organization', 'role', 'isActive', 'accountStatus', 'createdAt', 'updatedAt', 'deletedAt'],
        include: [
          {
            as: 'memberDetail',
            model: MemberDetails,
            attributes: ['id', 'userId', 'backgroundCover', 'documentsURL', 'websiteLink', 'description'],
          },
        ],
        paranoid: false
      });

      if (!members.length) {
        return res
          .status(HTTP_NOT_FOUND)
          .json({
            error: NO_USER_CREATED
          });
      }

      return res
        .status(HTTP_OK)
        .json({
          membersCount: members.length,
          data: members
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
   * @param {Object} req
   * @param {Object} res
   * @returns {String} user response
   *
  */
  static async getSingleMember(req, res) {
    try {
      const findUser = await User.findOne({
        where: {
          id: req.params.id,
          role: 'member'
        },
        order: [['createdAt', 'DESC']],
        attributes: ['id', 'firstName', 'lastName', 'email', 'organization', 'role', 'isActive', 'accountStatus', 'createdAt', 'updatedAt', 'deletedAt'],
        include: [
          {
            as: 'memberDetail',
            model: MemberDetails,
            attributes: ['id', 'userId', 'backgroundCover', 'documentsURL', 'websiteLink', 'description'],
            include: [
              {
                as: 'conversations',
                model: Conversation,
                attributes: ['id', 'message', 'seen'],
                include: [
                  {
                    as: 'sender',
                    model: User,
                    attributes: ['id', 'firstName', 'lastName', 'email', 'role', 'phoneNumber'],
                  },
                ],
              },
            ],
          },
        ],
      });

      if (!findUser) {
        return res
          .status(HTTP_NOT_FOUND)
          .json({
            error: NOT_FOUND_USER
          });
      }
      return res
        .status(HTTP_OK)
        .json({
          data: findUser
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
