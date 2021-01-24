const Demands = require('../models/demands');

exports.addComment = function({params, body}, res, next) {
    try {
        const result = Demands.updateOne({_id: params.id}, { comment: body.comment })
        res.json(result);
    } catch (error) {
        next(error);
    }
};