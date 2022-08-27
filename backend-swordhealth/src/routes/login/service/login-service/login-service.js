const httpErrors = require("http-errors");

class LoginService {
  constructor({ userRepository, bcrypt, jwt, redis }) {
    this.userRepository = userRepository;
    this.bcrypt = bcrypt;
    this.jwt = jwt;
    this.redis = redis;
  }
  verifyCredentials = async ({ email, password }) => {
    // const key = `sword:findOne:${email}`;
    // const userRawData = await this.redis.get(key);
    // let userObj = JSON.parse(userRawData) || { password: "" };
    // console.log(userRawData);
    // if (!!userRawData) {
    //   const [user] = await this.userRepository.findOne({
    //     email,
    //   });
    //   console.log(user);
    //   await this.redis.set({ key, value: user });
    //   userObj = user;
    // }
    // console.log(userObj);
    const [user = { password: "" }] = await this.userRepository.findOne({
      email,
    });
    const { password: hash = "" } = user;
    const passwordMatch = await this.bcrypt.checkPassword({ hash, password });
    if (passwordMatch === false) {
      throw new httpErrors.Unauthorized(
        "You have entered an invalid username or password"
      );
    }
    return { user };
  };
  generateToken = ({ user }) => {
    const data = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };
    const { token } = this.jwt.signToken({ data });
    return { token };
  };
}
module.exports = { LoginService };
