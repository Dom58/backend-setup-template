import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import model from '../models';
import {
  generate as generateToken,
  decode as decodeToken,
} from '../utils/tokens';
import CreateUserHelper from '../helpers/userHelper';
import {
  resetAccountUrl,
  sendForgotPasswordUrl,
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
  SUCCESS_LOGIN,
  NOT_FOUND_USER,
  INCORECT_EMAIL_PASSWORD,
  SUCCESS_USER_CREATED,
  ACCOUNT_NOT_VERIFIED,
  NOT_SIGNED_IN,
  RESET_PASSWORD_ACCOUNT,
  SALT_ROUNDS,
  SEND_FORGET_PASSWORD,
  // ACCOUNT_NOT_ACTIVE,
  INVALID_TOKEN,
  UPDATE_USER_PROFILE,
  NO_USER_CREATED,
  SUCCESS_DELETE,
  SUCCESS_RESTORE_USER,
  SUCCESS_MEMBER_CREATED,
  SUCCESS_COMPLETE_ACCOUNT,
  NOT_FOUND_MEMBER,
  SUCCESS_APPROVED_MEMBER,
  SUCCESS_PENDED_MEMBER,
  ACCOUNT_STATUS_EMAIL_MESSAGE,
  ACCOUNT_STATUS_EMAIL_DENIED_MESSAGE,
  SUCCESS_ACTIVATED_USER,
  SUCCESS_DEACTIVATED_USER
} from '../constants/general';

dotenv.config();

const {
  User,
  MemberDetails
} = model;

/**
 * User Controllers
 */
export default class UserController {
  /**
     *
     * @param {Object} req
     * @param {Object} res
     * @returns {Object} user object
    */
  static async create(req, res) {
    try {
      const createUser = await CreateUserHelper.createUser(req.body);

      delete createUser.dataValues.password;
      const {
        email, lastName
      } = createUser.dataValues;

      const token = await generateToken({
        id: createUser.get().id,
        firstName: createUser.get().firstName,
        lastName: createUser.get().lastName,
        email: createUser.get().email,
        phoneNumber: createUser.get().phoneNumber,
        role: createUser.get().role,
        accountStatus: createUser.get().accountStatus,
        isActive: createUser.get().isActive,
      });

      await resetAccountUrl(token, email, lastName);
      return res
        .status(HTTP_CREATED)
        .json({
          message: SUCCESS_USER_CREATED,
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
     * @returns {String} acknowledgement message
     *
     */
  static async login(req, res) {
    const {
      email, password
    } = req.body;

    try {
      const findUser = await User.findOne({
        where: {
          email
        }
      });

      if (!findUser) {
        return res
          .status(HTTP_UNAUTHORIZED)
          .json({
            error: INCORECT_EMAIL_PASSWORD
          });
      }

      if (!findUser.get().isActive) {
        return res
          .status(HTTP_UNAUTHORIZED)
          .json({
            error: ACCOUNT_NOT_VERIFIED
          });
      }

      const isPasswordCorrect = await findUser.comparePassword(password);

      if (!isPasswordCorrect) {
        return res
          .status(HTTP_UNAUTHORIZED)
          .json({
            error: INCORECT_EMAIL_PASSWORD
          });
      }

      delete findUser.dataValues.password;

      return res
        .status(HTTP_OK)
        .json({
          message: SUCCESS_LOGIN,
          token: generateToken({
            id: findUser.get().id,
            firstName: findUser.get().firstName,
            lastName: findUser.get().lastName,
            email: findUser.get().email,
            role: findUser.get().role,
            isActive: findUser.get().isActive,
          }),
        });
    } catch (error) {
      return res
        .status(HTTP_SERVER_ERROR)
        .json({
          message: SERVER_NOT_RESPONDING
        });
    }
  }

  /**
     * @param {Object} req
     * @param {Object} res
     * @returns {String} acknowledgement message
     *
     */
  static async resetPassword(req, res) {
    try {
      const {
        token,
        password,
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
      const findUser = await User.findOne({
        where: {
          email: tokenData.email
        }
      });

      if (!findUser) {
        return res
          .status(HTTP_NOT_FOUND)
          .json({
            error: NOT_FOUND_USER
          });
      }

      const hashPassword = await bcrypt.hash(password, SALT_ROUNDS);
      await User.update({
        password: hashPassword,
        isActive: true,
      }, {
        where: {
          id: findUser.dataValues.id
        }
      });

      return res
        .status(HTTP_OK)
        .json({
          message: RESET_PASSWORD_ACCOUNT
        });
    } catch (error) {
      return res
        .status(HTTP_SERVER_ERROR)
        .json({
          message: SERVER_NOT_RESPONDING
        });
    }
  }

  /**
   * @param {Object} req
   * @param {Object} res
   * @returns {String} acknowledgement message
   *
   */
  static async sendForgotPassword(req, res) {
    try {
      const {
        email
      } = req.body;

      const findUser = await User.findOne({
        where: {
          email
        }
      });

      if (!findUser) {
        return res
          .status(HTTP_OK)
          .json({
            message: SEND_FORGET_PASSWORD,
          });
      }

      const token = await generateToken({
        id: findUser.get().id,
        firstName: findUser.get().firstName,
        lastName: findUser.get().lastName,
        email: findUser.get().email,
        role: findUser.get().role,
        isActive: findUser.get().isActive,
      });

      await sendForgotPasswordUrl(token, email);
      return res
        .status(HTTP_CREATED)
        .json({
          message: SEND_FORGET_PASSWORD,
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
   * @returns {String} acknowledgement message
   *
  */
  static async updateUser(req, res) {
    try {
      const {
        firstName, lastName
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
        firstName,
        lastName,
      }, {
        where: {
          id: findUser.get().id
        }
      });

      return res
        .status(HTTP_OK)
        .json({
          message: UPDATE_USER_PROFILE
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
   * @returns {String} acknowledgement message
   *
  */
  static async updateUserByAdmin(req, res) {
    try {
      const {
        firstName, lastName, role, isActive
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
        firstName,
        lastName,
        role,
        isActive
      }, {
        where: {
          id: findUser.get().id
        }
      });

      return res
        .status(HTTP_OK)
        .json({
          message: UPDATE_USER_PROFILE
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
  static async getUsers(req, res) {
    try {
      const users = await User.findAll({
        order: [['createdAt', 'DESC']],
        attributes: ['id', 'firstName', 'lastName', 'email', 'organization', 'role', 'isActive', 'accountStatus', 'createdAt', 'updatedAt', 'deletedAt'],
        include: [
          {
            as: 'memberDetail',
            model: MemberDetails,
            attributes: ['id', 'userId', 'backgroundCover', 'documentsURL', 'websiteLink', 'description'],
          },
        ],
        // paranoid: false
      });

      if (!users.length) {
        return res
          .status(HTTP_NOT_FOUND)
          .json({
            error: NO_USER_CREATED
          });
      }

      return res
        .status(HTTP_OK)
        .json({
          usersCount: users.length,
          data: users
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
  static async getUser(req, res) {
    try {
      const findUser = await User.findOne({
        where: {
          id: req.params.id
        },
        attributes: ['id', 'firstName', 'lastName', 'email', 'organization', 'role', 'accountStatus', 'isActive', 'createdAt'],
        include: [
          {
            as: 'memberDetail',
            model: MemberDetails,
            attributes: ['id', 'userId', 'backgroundCover', 'documentsURL', 'websiteLink', 'description'],
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

  /**
   * @param {Object} req
   * @param {Object} res
   * @returns {String} acknowledgement response
   *
  */
  static async deleteUser(req, res) {
    try {
      const findUser = await User.findOne({
        where: {
          id: req.params.id
        },
      });

      if (!findUser) {
        return res
          .status(HTTP_NOT_FOUND)
          .json({
            error: NOT_FOUND_USER
          });
      }

      await User.destroy({
        where: {
          id: findUser.get().id
        },
        paranoid: false
      });

      return res
        .status(HTTP_OK)
        .json({
          message: SUCCESS_DELETE
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
   * @returns {String} acknowledgement response
   *
  */
  static async restoreUser(req, res) {
    const findUser = await User.findOne({
      where: {
        id: req.params.id
      },
      paranoid: false
    });

    if (!findUser) {
      return res
        .status(HTTP_NOT_FOUND)
        .json({
          error: NOT_FOUND_USER
        });
    }
    try {
      await User.restore({
        where: {
          id: req.params.id
        }
      });
      return res
        .status(HTTP_OK)
        .json({
          message: SUCCESS_RESTORE_USER
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
   *
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} return approved User message
  */
  static async approveUser(req, res) {
    try {
      const {
        isActive
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
        isActive
      }, {
        where: {
          id: findUser.get().id
        }
      });

      return res
        .status(HTTP_OK)
        .json({
          message: isActive === true ? SUCCESS_ACTIVATED_USER : SUCCESS_DEACTIVATED_USER,
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
