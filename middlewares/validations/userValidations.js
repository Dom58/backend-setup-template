import Joi from '@hapi/joi';
import model from '../../models/index';
import {
  HTTP_BAD_REQUEST
} from '../../constants/httpStatusCodes';

const {
  User
} = model;

/**
 *  Signup validaton
 */
class UserValidation {
  /**
    * @param {object} req
    * @param {object} res
    * @param {object} next
    * @returns {Object} createUserSchema object
    *
  */
  static async userValidator(req, res, next) {
    const createUserSchema = Joi.object().keys({
      role: Joi.string().valid('admin', 'member', 'user').required().label('Role'),
      email: Joi.string().email().insensitive().required()
        .label('Email'),
      firstName: Joi.string().required().label('First ame'),
      lastName: Joi.string().required().label('Last Name'),
      organization: Joi.string().label('Organization'),
      phoneNumber: Joi.string().required().label('Phone Number')
    });

    const user = {
      /**
       * create user body
       */
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      role: req.body.role,
      organization: req.body.organization,
    };

    const checkUser = Joi.validate(user, createUserSchema, {
      abortEarly: false
    });

    if (checkUser.error) {
      const Errors = [];

      for (let i = 0; i < checkUser.error.details.length; i += 1) {
        Errors.push(checkUser.error.details[i].message.replace('"', ' ').replace('"', ' '));
      }

      return res.status(HTTP_BAD_REQUEST).json({
        Errors
      });
    }

    const findUser = await User.findOne({
      where: {
        email: user.email,
      },
      paranoid: false
    });

    if (findUser && (findUser.get().phoneNumber === user.phoneNumber)) {
      return res.status(409).json({
        error: `Sorry. Phone number "${user.phoneNumber}" already taken!`
      });
    }

    if (findUser) {
      return res.status(409).json({
        error: `Oops. User with email "${user.email}" already taken!`
      });
    }

    req.user = checkUser.value;

    next();
  }

  /**
  * @param {object} req
  * @param {object} res
  * @param {object} next
  * @returns {Object} password object
   */
  static resetPasswordAccount(req, res, next) {
    const resetPasswordAccountSchema = Joi.object().keys({
      password: Joi.string().regex(/^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{6,}$/).required()
        .options({
          language: {
            string: {
              regex: {
                base: 'must contain at least One Digit - One Special Character - One Lowercase and One Uppercase Letter and the length not less than 6!'
              }
            }
          }
        })
        .label('Password'),
      confirmPassword: Joi.any().valid(Joi.ref('password')).required().options({
        language: {
          any: {
            allowOnly: 'must match password!'
          }
        }
      })
        .label('Confirm Password'),
    });

    const resetPasswordData = {
      password: req.body.password,
      confirmPassword: req.body.confirmPassword
    };

    const validateResetPassword = Joi.validate(resetPasswordData, resetPasswordAccountSchema, {
      abortEarly: false
    });

    if (validateResetPassword.error) {
      const Errors = [];

      for (let i = 0; i < validateResetPassword.error.details.length; i += 1) {
        Errors.push(validateResetPassword.error.details[i].message.replace('"', ' ').replace('"', ' '));
      }

      return res.status(HTTP_BAD_REQUEST).json({
        Errors
      });
    }

    next();
  }

  /**
    * @param {object} req
    * @param {object} res
    * @param {object} next
    * @returns {Object} validate Email to forgot password object
    *
  */
  static async validateEmail(req, res, next) {
    const forgotPasswordSchema = Joi.object().keys({
      email: Joi.string().email().insensitive().required()
        .label('Email'),
    });

    const emailBody = {
    /**
     * validate email body
     */
      email: req.body.email,
    };

    const checkEmail = Joi.validate(emailBody, forgotPasswordSchema, {
      abortEarly: false
    });

    if (checkEmail.error) {
      const Errors = [];

      for (let i = 0; i < checkEmail.error.details.length; i += 1) {
        Errors.push(checkEmail.error.details[i].message.replace('"', ' ').replace('"', ' '));
      }

      return res.status(HTTP_BAD_REQUEST).json({
        Errors
      });
    }

    next();
  }

  /**
    * @param {object} req
    * @param {object} res
    * @param {object} next
    * @returns {Object} update user object
    *
  */
  static async updateUserValidator(req, res, next) {
    const updateUserSchema = Joi.object().keys({
      firstName: Joi.string().required().label('First ame'),
      lastName: Joi.string().required().label('Last Name'),
    });

    const user = {
      /**
       * update user body
       */
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    };

    const checkUser = Joi.validate(user, updateUserSchema, {
      abortEarly: false
    });

    if (checkUser.error) {
      const Errors = [];

      for (let i = 0; i < checkUser.error.details.length; i += 1) {
        Errors.push(checkUser.error.details[i].message.replace('"', ' ').replace('"', ' '));
      }

      return res.status(HTTP_BAD_REQUEST).json({
        Errors
      });
    }

    next();
  }

  /**
    * @param {object} req
    * @param {object} res
    * @param {object} next
    * @returns {Object} update user by Admin object
    *
  */
  static async updateUserByAdminValidator(req, res, next) {
    const updateUserSchema = Joi.object().keys({
      role: Joi.string().valid('admin', 'member', 'user').required().label('Role'),
      firstName: Joi.string().required().label('First ame'),
      lastName: Joi.string().required().label('Last Name'),
      organization: Joi.string().label('Organization'),
    });

    const user = {
      /**
       * update user body
       */
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      role: req.body.role,
      organization: req.body.organization,
    };

    const checkUser = Joi.validate(user, updateUserSchema, {
      abortEarly: false
    });

    if (checkUser.error) {
      const Errors = [];

      for (let i = 0; i < checkUser.error.details.length; i += 1) {
        Errors.push(checkUser.error.details[i].message.replace('"', ' ').replace('"', ' '));
      }

      return res.status(HTTP_BAD_REQUEST).json({
        Errors
      });
    }

    next();
  }

  /**
    * @param {object} req
    * @param {object} res
    * @param {object} next
    * @returns {Object} createMemberSchema object
    *
  */
  static async memberValidator(req, res, next) {
    const createMemberSchema = Joi.object().keys({
      // role: Joi.string().valid('admin', 'member', 'user').required().label('Role'),
      email: Joi.string().email().insensitive().required()
        .label('Email'),
      firstName: Joi.string().required().label('First ame'),
      lastName: Joi.string().required().label('Last Name'),
      organization: Joi.string().label('Organization'),
      phoneNumber: Joi.string().required().label('Phone Number'),
      // user or member descriptions
      backgroundCover: Joi.string().allow('').label('Profile Image'),
      documentsURL: Joi.string().allow('').label('Documents'),
      websiteLink: Joi.string().allow('').label('Link'),
      description: Joi.string().allow('').label('Description'),
    });

    const member = {
    /**
     * create member body
     */
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      // role: req.body.role,
      organization: req.body.organization,
      // user or member descriptions
      backgroundCover: req.body.backgroundCover,
      documentsURL: req.body.documentsURL,
      websiteLink: req.body.websiteLink,
      description: req.body.description,
    };

    const checkMember = Joi.validate(member, createMemberSchema, {
      abortEarly: false
    });

    if (checkMember.error) {
      const Errors = [];

      for (let i = 0; i < checkMember.error.details.length; i += 1) {
        Errors.push(checkMember.error.details[i].message.replace('"', ' ').replace('"', ' '));
      }

      return res.status(HTTP_BAD_REQUEST).json({
        Errors
      });
    }

    const findEmail = await User.findOne({
      where: {
        email: member.email,
      },
      paranoid: false
    });

    if (findEmail && (findEmail.get().phoneNumber === member.phoneNumber)) {
      return res.status(409).json({
        error: `Sorry. Phone number "${member.phoneNumber}" already taken!`
      });
    }

    if (findEmail) {
      return res.status(409).json({
        error: `Sorry. Email "${member.email}" already taken!`
      });
    }

    req.user = checkMember.value;

    next();
  }

  /**
    * @param {object} req
    * @param {object} res
    * @param {object} next
    * @returns {Object} updateMemberSchema object
    *
  */
  static async completeMemberValidator(req, res, next) {
    const updateMemberSchema = Joi.object().keys({
      password: Joi.string().regex(/^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{6,}$/).required()
        .options({
          language: {
            string: {
              regex: {
                base: 'must contain at least One Digit - One Special Character - One Lowercase and One Uppercase Letter and the length not less than 6!'
              }
            }
          }
        })
        .label('Password'),
      confirmPassword: Joi.any().valid(Joi.ref('password')).required().options({
        language: {
          any: {
            allowOnly: 'must match password!'
          }
        }
      })
        .label('Confirm Password'),
      description: Joi.string().required().label('Description'),
      backgroundCover: Joi.string().required().label('Profile Image'),
      documentsURL: Joi.string().required().label('Documents'),
      websiteLink: Joi.required().label('Link'),
    });

    const member = {
      /**
       * update member body
      */
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
      description: req.body.description,
      backgroundCover: req.body.backgroundCover,
      documentsURL: req.body.documentsURL,
      websiteLink: req.body.websiteLink,
    };

    const checkMember = Joi.validate(member, updateMemberSchema, {
      abortEarly: false
    });

    if (checkMember.error) {
      const Errors = [];

      for (let i = 0; i < checkMember.error.details.length; i += 1) {
        Errors.push(checkMember.error.details[i].message.replace('"', ' ').replace('"', ' '));
      }

      return res.status(HTTP_BAD_REQUEST).json({
        Errors
      });
    }

    next();
  }
}

export default UserValidation;
