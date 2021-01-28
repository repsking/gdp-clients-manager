const jwt = require('jsonwebtoken');
const ApiError = require('../errors/ApiError');


// 498 HTTP CODE means that the token is expired. Generally, the front disconnect the user in this case.
module.exports =  (req, res, next) => {
    try {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.SECRET_AUTH_TOKEN);
        const userId = decoded.userId;
        if (req.headers.uuid && req.headers.uuid !== userId) throw ApiError('Invalid user ID', 498);
        req.currentUserId = userId;
        next()
      } catch(error) {
        if(error.name === 'TokenExpiredError') {
          throw new ApiError("User token has expired. You'll be disconnected.", 498)
        }
        throw new ApiError("User not authorized to connect to this API", 401)
      }
    };