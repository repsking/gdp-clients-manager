const Demands = require('../models/demands');
const User = require('../models/user')
const ApiError = require('../Errors/ApiError')

exports.addComment = function({params, body}, res, next) {
    try {
        const result = Demands.updateOne({_id: params.id}, { comment: body.comment })
        res.json(result);
    } catch (error) {
        next(error);
    }
};
exports.assignToUser = function({body: {userId}, params}, res, next) {
    const userExist = User.exists({_id: userId});
    if(!userExist) throw new ApiError("Selected user doesnt exist or it's not allowed to handle a contact demand", 400)
    try {
        const result = Demands.updateOne({_id: params.id}, { handler: {userId, status: 'handled'} })
        res.json(result);
    } catch (error) {
        next(error);
    }
}