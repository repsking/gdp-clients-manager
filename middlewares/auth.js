const jwt = require('jsonwebtoken');
const ApiError = require('../Errors/ApiError');

module.exports =  (req, res, next) => {
    try {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.SECRET_AUTH_TOKEN);
        next();       
      } catch(error) {
        if(error.name === 'TokenExpiredError') {
          throw new ApiError("User token has expired. You'll be disconnected.", 498)
        }
        throw new ApiError("User not authorized to connect to this API", 401)
      }
    };