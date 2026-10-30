const jwt = require("jsonwebtoken");

class TokenService {
  generateToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "10h"
    });
  }
}

module.exports = new TokenService();
