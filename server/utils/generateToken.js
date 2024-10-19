const jwt = require('jsonwebtoken');

/**
 * Generates a JWT token for the given user ID.
 * @param {string} id - User ID for which the token will be generated.
 * @returns {string} - JWT token.
 */
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables.');
  }

  try {
    // Generate a JWT token with the user ID payload and the provided JWT secret
    // Set the token to expire in 15 days
    console.log("Generating Token:", jwt.sign({ id }, process.env.JWT_SECRET, { // Debugging
      expiresIn: '15d',
    }));
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: '15d',
    });
  } catch (error) {
    console.error('Error generating token:', error);
    throw new Error('Failed to generate token');
  }
};

module.exports = generateToken;
