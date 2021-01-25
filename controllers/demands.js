const Demands = require('../models/demands');
const User = require('../models/user')
const ApiError = require('../Errors/ApiError')

exports.addComment = async function({currentUserId, params, body}, res, next) {
    try {
        await Demands.updateOne({_id: params.id}, { 
            $push: {comments: 
                {
                    text: body.comment ,
                    personnal: body.personnal,
                    owner: currentUserId 
                } } })
        res.status(200).end();
    } catch (error) {
        next(error);
    }
};

exports.removeComment = async function({currentUserId, params, body}, res, next) {
    try {
        const demand = await Demands.findOne({_id: params.id});
        if(!demand.comments.find(comment => comment.id === body.commentId && comment.owner == currentUserId))
            throw new ApiError("You're not allowed to edit or delete this comment", 401);
        await Demands.updateOne({_id: params.id}, { 
            $pull: {comments: {
                    _id: body.commentId
                } } })
        res.status(200).end();
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