import model from '../models';

const dotenv = require('dotenv');

const {
  User
} = model;

dotenv.config();

/**
 * Admin middleware
 */
class CreateUserHelper {
  /**
     *
     * @param {Object} body
     * @returns {Object} returns user created
     */
  static async createUser(body) {
    const {
      firstName,
      lastName,
      email,
      role,
      organization,
      phoneNumber,
    } = body;

    const user = {
      // default password = Abcd123
      firstName,
      lastName,
      email,
      role,
      organization,
      isActive: false,
      accountStatus: 'approved',
      phoneNumber,
      password: process.env.DEFAULT_PASSWORD
    };

    const addedUser = await User.create(user);
    return addedUser;
  }

  /**
     *
     * @param {Object} body
     * @returns {Object} returns member created
     */
  static async createMember(body) {
    const {
      firstName,
      lastName,
      email,
      organization,
      phoneNumber,
    } = body;

    const member = {
      // default password = Abcd123
      firstName,
      lastName,
      email,
      role: 'member',
      organization,
      isActive: false,
      accountStatus: 'pending',
      phoneNumber,
      password: process.env.DEFAULT_PASSWORD
    };

    const addedUser = await User.create(member);
    return addedUser;
  }
}

export default CreateUserHelper;
