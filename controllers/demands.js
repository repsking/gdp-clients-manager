const Demands = require('../models/demands');
const User = require('../models/user')
const Status = require('../models/demandStatus')
const ApiError = require('../Errors/ApiError')
const ctrlWrapper = require("./utils/ctrlWrapper")

exports.createDemand = async ({body}, res, next) => {
    try {
        res.status(200).end();
        const statusId = await Status.findIdByCode('new');
        const result = new Demands({...body, handler: {status: statusId}});
        if(result) await result.save();
        res.status(201).json(result);
    } catch (error) {        
        next(error)
    }
}

const serializeUser = ({email,phone, name,firstname, zipcode}) => {
    return {email, phone, firstname, zipcode, name};
}

const serializeDevice = ({navigator,screen}) => {
    return {navigator,screen};
}

const serializeProgramme = ({programmeName, programmeId, programmeVille,programmeGestionnaire, thematique}) => {
    return {
        name: programmeName,
        id: programmeId,
        ville: programmeVille,
        gestionnaire: programmeGestionnaire,
        thematique
    }
}

const serializeDemand = (body, action) => {
    const url = body.url || 'origin missing';
    const origin = 'gdpcom';
    return {
        url,
        action,
        origin,
        message: body.message,
        user: serializeUser(body),
        device: serializeDevice(body)
    }
}

const serializeProgrammeDemand = body => {
    return {
        ...serializeDemand(body, "programme_form"),
        programme: serializeProgramme(body)
    }
}

const createDemand = async (demand) => {
    const statusId = await Status.findIdByCode('new');
    const doc = new Demands({...demand, handler: {status: statusId}});
    const res = await doc.save();
    return res;
}

exports.createCommonDemand = ctrlWrapper(async ({body}, res) => {
    const doc = await createDemand(serializeDemand(body, "common_form"));
    res.status(201).json(doc);
})

exports.createProgramDemand = ctrlWrapper(async ({body}, res) => {
    const doc = await createDemand(serializeProgrammeDemand(body));
    res.status(201).json(doc);
})

exports.addComment = async ({currentUserId, params, body}, res, next) => {
    try {
        await Demands.updateOne({_id: params.id}, { comment: { text: body.comment, owner: currentUserId} })
        res.status(200).end();
    } catch (error) {
        next(error);
    }
};

exports.removeComment = async function({params}, res, next) {
    try {
        await Demands.updateOne({_id: params.id}, { comment: null })
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