const Demands = require('../models/demands');
const User = require('../models/user')
const Status = require('../models/status')
const ApiError = require('../errors/ApiError')
const ctrlWrapper = require("./utils/ctrlWrapper")



const serializeUser = ({email,phone, name,firstname, zipcode}) => {
    return {email, phone, firstname, zipcode, name};
}

const serializeDevice = ({navigator,screen, lang}) => {
    return {navigator,screen, lang};
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

exports.createDemand = ctrlWrapper(async ({body}, res) => {
    const statusId = await Status.findIdByCode('new');
    const result = new Demands({...body, handler: {status: statusId}});
    if(result) await result.save();
    res.status(201).json(result);
})

exports.createCommonDemand = ctrlWrapper(async ({body}, res) => {
    const doc = await createDemand(serializeDemand(body, "common_form"));
    res.status(201).json(doc);
})

exports.createProgramDemand = ctrlWrapper(async ({body}, res) => {
    const doc = await createDemand(serializeProgrammeDemand(body));
    res.status(201).json(doc);
})

exports.createProgramDemand = ctrlWrapper(async ({body}, res) => {
    const doc = await createDemand(serializeProgrammeDemand(body));
    res.status(201).json(doc);
})

exports.addComment = ctrlWrapper(async ({currentUserId, params, body}, res) => {
    await Demands.updateOne({_id: params.id}, { comment: { text: body.comment, owner: currentUserId} })
    res.status(200).end();
});

exports.removeComment = ctrlWrapper(async ({params}, res) => {
    await Demands.updateOne({_id: params.id}, { comment: null })
    res.status(200).end();
});

exports.assignToUser = ctrlWrapper(async ({body: {userId}, params}, res) => {
    const userExist = await User.exists({_id: userId});
    if(!userExist) throw new ApiError("Selected user doesn't exist or it's not allowed to handle a contact demand", 400)
    const statusId = await Status.findIdByCode('handled')
    await Demands.updateOne({_id: params.id}, { handler: {userId, status: statusId} })
    res.status(200).end();
});

exports.updateStatus = ctrlWrapper(async ({body: {statusId}, params}, res) => {
    const statusExist = await Status.exists({_id: statusId });
    if(!statusExist) throw new ApiError("This status doesn't exist", 400)
    await Demands.updateOne({_id: params.id}, { handler: { status: statusId } })
    res.status(200).end();
});