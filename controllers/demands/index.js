const Origin = require("../../models/origin");
const Demands = require("../../models/demands");
const User = require("../../models/user");
const Status = require("../../models/status");
const { ApiError } = require("../../Errors");
const {controller, ACTION} = require("../utils/controller");
const email = require("../../emails/service");
const importDemands = require('./import');
const {paginatedController} = require('../utils/paginate')
const { serializeDemand, serializeProgrammeDemand } = require('./utils');

const sendResponseMail = async ({ url, origin, action, messge, user, programme, createdAt }) => {

    // find team with mail
    const client = {
        from: `"${origin.name}" <contact@${origin.url}>`, // sender address
        to: user.email, // list of receivers
        subject: "Demane bien prise en compte", // Subject line
        html: `<b>Bonjour M.</br>C'est fait !`, // html body
    };

    const team = {
        from: `"${origin.name}" <contact@${origin.url}>`, // sender address
        to: 'saliou71@gmail.com', // list of receivers
        subject: `Une nouvelle demande vient dêtre enregistré sur ${origin.name} `,
        html: `<b>Bonjour M. Saliou</br>C'est fait !`,
    };
    try {
        const [clientRes, teamRes] = await Promise.all([email(client), email(team)]);
        return {clientRes, teamRes};
    } catch (e) {
        // Save a log which says that the demands gone but not the email and do not block the process
        return false;
    }
};

const createDemand = async (demand) => {
    const [originId = null, statusId] = await Promise.all([
        Origin.findIdByKeyword(demand.origin),
        Status.findIdByCode("new"),
    ]);
    if (!statusId) throw ApiError("status_not_defined", 500);
    const doc = new Demands({ ...demand, origin: originId, handler: { status: statusId } });
    const res = await doc.save();
    sendResponseMail(res);
    return res;
};


exports.importDemands = importDemands;

exports.createCommonDemand = controller(({ body }) => {
    return createDemand(serializeDemand(body));
}, ACTION.CREATE);

exports.createBeContactedDemand = controller(({ body }) => {
    return createDemand(serializeDemand({ ...body, message: "Auto: 'Ce prospect désire être recontacté.'" }));
}, ACTION.CREATE);

exports.createProgramDemand = controller(({ body }) => {
    return createDemand(serializeProgrammeDemand({ ...body}));
}, ACTION.CREATE);

exports.addComment = controller(({ user, params, body }) => {
    return Demands.updateOne({ _id: params.id }, { comment: { text: body.comment, owner: user._id } });
}, ACTION.INFORM);

exports.removeComment = controller(({ params }) => {
    return Demands.updateOne({ _id: params.id }, { comment: null });
}, ACTION.INFORM);

exports.assignToUser = controller(async ({ body: { userId }, params }) => {
    const userExist = await User.exists({ _id: userId });
    if (!userExist) throw new ApiError("Selected user doesn't exist", 400);
    const statusId = await Status.findIdByCode("handled");
    return Demands.updateOne({ _id: params.id }, { handler: { userId, status: statusId } });
}, ACTION.INFORM);

exports.updateStatus = controller(async ({ body: { statusId }, params }) => {
    const statusExist = await Status.exists({ _id: statusId });
    if (!statusExist) throw new ApiError("This status doesn't exist", 400);
    return Demands.updateOne({ _id: params.id }, { handler: { status: statusId } });
},  ACTION.INFORM);

const serializeFilterQuery = ({search,status, origin, handler}) => 
({
    search: search || undefined,
    status,
    origin,
    // origin && { Model: Origin, filterValue: { origin: { url: origin, name: origin } }, field: 'origin' },
    handler
});

const serializeSortQuery = ({sortBy, sortDesc}) => ({by: sortBy, direction: sortDesc && sortDesc == 'true' ? 'desc' : 'asc'})
const serializePaginatedQuery = (query) => ({ sort: serializeSortQuery(query), filter: serializeFilterQuery(query), pagination: {page: query.page, limit: query.perPage}})
exports.paginatedList = controller(({query}) => {
    const {sort, filter, pagination} = serializePaginatedQuery(query);
    return paginatedController(Demands, filter, sort, pagination);
}, ACTION.RESULT);