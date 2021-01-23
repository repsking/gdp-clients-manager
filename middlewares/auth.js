const jwt = require('jsonwebtoken');
module.exports =  (req, res, next) => {
    try {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.SECRET_AUTH_TOKEN);
        next();       
      } catch(error) {
          console.log(error);
        res.status(401).json({
          error: 'Not_Authorized',
          message: "User not authorized to connect to this API"
        });
      }
    };