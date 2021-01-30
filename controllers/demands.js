const Demands = require('../models/demands');
const User = require('../models/user')
const Status = require('../models/status')
const ApiError = require('../errors/ApiError')
const controller = require("./utils/controller")

const serializeUser = ({email, phone, name, firstname, zipcode}) => ({
    email, phone, firstname, zipcode, name
});

const serializeDevice = ({navigator,screen, lang}) => ({
    navigator, screen, lang
});

const serializeProgramme = ({programmeName, programmeId, programmeVille,programmeGestionnaire, thematique}) => ({
    name: programmeName,
    id: programmeId,
    ville: programmeVille,
    gestionnaire: programmeGestionnaire,
    thematique
});

const serializeDemand = body => ({
    url:  body.url || 'origin missing' ,
    origin: 'gdpcom',
    action: body.action || 'no-action-given',
    message: body.message,
    user: serializeUser(body),
    device: serializeDevice(body)
});

const serializeProgrammeDemand = body => ({
    ...serializeDemand(body),
    programme: serializeProgramme(body)
})

const createDemand = async (demand) => {
    const statusId = await Status.findIdByCode('new');
    if(!statusId) throw ApiError("status_not_defined", 400)
    const doc = new Demands({...demand, handler: {status: statusId}});
    const res = await doc.save();
    return res;
};

exports.createCommonDemand = controller(async ({body}, res) => {
    await createDemand(serializeDemand(body));
    res.status(201).end();
});

exports.createProgramDemand = controller(async ({body}, res) => {
    await createDemand(serializeProgrammeDemand(body));
    res.status(201).end();
});

exports.addComment = controller(async ({currentUserId, params, body}, res) => {
    await Demands.updateOne({_id: params.id}, { comment: { text: body.comment, owner: currentUserId} })
    res.status(200).end();
});

exports.removeComment = controller(async ({params}, res) => {
    await Demands.updateOne({_id: params.id}, { comment: null })
    res.status(200).end();
});

exports.assignToUser = controller(async ({body: {userId}, params}, res) => {
    const userExist = await User.exists({_id: userId});
    if(!userExist) throw new ApiError("Selected user doesn't exist or it's not allowed to handle a contact demand", 400)
    const statusId = await Status.findIdByCode('handled')
    await Demands.updateOne({_id: params.id}, { handler: {userId, status: statusId} })
    res.status(200).end();
});

exports.updateStatus = controller(async ({body: {statusId}, params}, res) => {
    const statusExist = await Status.exists({_id: statusId });
    if(!statusExist) throw new ApiError("This status doesn't exist", 400)
    await Demands.updateOne({_id: params.id}, { handler: { status: statusId } })
    res.status(200).end();
});