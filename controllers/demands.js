const Demands = require('../models/demands');
const User = require('../models/user')
const Status = require('../models/demandStatus')
const ApiError = require('../Errors/ApiError')

exports.createDemand = async ({body}, res, next) => {
    try {
        const statusId = await Status.findIdByCode('new');
        const result = new Demands({...body, handler: {status: statusId}});
        if(result) await result.save();
        res.status(201).json(result);
    } catch (error) {        
        next(error)
    }
}

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
exports.assignToUser = async function({body: {userId}, params}, res, next) {
    const userExist = await User.exists({_id: userId});
    const statusId = await Status.findIdByCode('handled')
    if(!userExist) throw new ApiError("Selected user doesn't exist or it's not allowed to handle a contact demand", 400)
    try {
        await Demands.updateOne({_id: params.id}, { handler: {userId, status: statusId} })
        res.status(200).end();
    } catch (error) {
        next(error);
    }
}

exports.updateStatus = async function({body: {statusId}, params}, res, next) {
    const statusExist = await Status.exists({_id: statusId });
    if(!statusExist) throw new ApiError("This status doesn't exist", 400)
    try {
        await Demands.updateOne({_id: params.id}, { handler: { status: statusId } })
        res.status(200).end();
    } catch (error) {
        next(error);
    }
}