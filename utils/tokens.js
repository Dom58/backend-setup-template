import 'dotenv/config';
import jwt from 'jsonwebtoken';

/**
 * @param {object} payload the payload to encode the token
 * @param {object} options the options to encode the token
 * @returns {string} the generated token
 */
export const generate = (payload = {
}, options = {
  expiresIn: '1d'
}) => {
  let isValidPayload = true;

  if (typeof payload === 'number') {
    isValidPayload = false;
  } else if (payload === null) {
    isValidPayload = false;
  } else if (typeof payload === 'object' && !Object.keys(payload).length) {
    isValidPayload = false;
  }

  return isValidPayload
    ? jwt.sign(payload, process.env.JWT_SECRET_KEY, options)
    : null;
};

/**
 * @param {string} token the token to decode
 * @returns {object} the decoded token
 */
export const decode = (token = '') => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (error) {
    return {
      error,
    };
  }
};
