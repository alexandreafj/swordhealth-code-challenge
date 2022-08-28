const bcryptjs = require("bcryptjs");
class Bcrypt {
  generateHashPassword = ({ password }) => {
    const salt = bcryptjs.genSaltSync(10);
    return bcryptjs.hashSync(password, salt);
  };

  comparePassword = async ({ hash, password }) => {
    return await bcryptjs.compare(password, hash);
  };
}

module.exports = { Bcrypt };
