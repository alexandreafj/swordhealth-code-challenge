const bcrypt = require("bcryptjs");

const generateHashPassword = ({ password }) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

const comparePassword = async ({ hash, password }) => {
  return await bcrypt.compare(password, hash);
};

module.exports = {
  bcrypt: {
    generateHashPassword,
    comparePassword,
  },
};
