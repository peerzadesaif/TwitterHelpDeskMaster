const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");

module.exports = {
  makeJson: data => {
    console.log('data', data)
    return JSON.parse(
      '{"' +
      data
        .split("=")
        .join('":"')
        .split("&")
        .join('","') +
      '"}'
    )
  },

  createToken: payload =>
    jwt.sign({ user: payload }, JWT_SECRET, { expiresIn: "10 days" })
};
