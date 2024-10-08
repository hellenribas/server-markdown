const validator = require('validator');

const sanitize = (input) => {
  return validator.escape(validator.trim(input));
};

module.exports = { sanitize };
