const Demands = require('../models/demands');

exports.list = function(req, res, next) {
    try {
        res.json([{message: 'Its a fake response from demands controller'}])
    } catch (error) {
        next(error);
    }
};