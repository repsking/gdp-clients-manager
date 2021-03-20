const Origin = require("../../models/origin");
const Demands = require("../../models/demands");
const Contact = require("../../models/contact")
const User = require("../../models/user");
const Status = require("../../models/status");
const { ApiError } = require("../../Errors");
const { controller, ACTION } = require("../utils/controller");
const importDemands = require('./import');
const { paginatedController } = require('../utils/paginate')
const { serializeDemand, serializeProgrammeDemand } = require('./utils');
const { sendResponseMail } = require('./emailsManager');



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
    return createDemand(serializeProgrammeDemand({ ...body }));
}, ACTION.CREATE);

exports.addComment = controller(async ({ user, params, body }) => {
    await Demands.updateOne({ _id: params.id }, { comment: { text: body.comment, owner: user._id } });
    return { text: body.comment, owner: user._id }
}, ACTION.RESULT);

exports.removeComment = controller(({ params }) => {
    return Demands.updateOne({ _id: params.id }, { comment: null });
}, ACTION.INFORM);

exports.assignToUser = controller(async ({ body: { userId }, params }) => {
    const user = await User.findById(userId, { nom: true, prenom: true, id: true });
    if (!user) throw new ApiError("Selected user doesn't exist", 400);
    const status = await Status.findOne({ code: { $regex: 'handled' } });
    await Demands.updateOne({ _id: params.id }, { handler: { userId, status: status.id } });
    return { userId: user, status }
}, ACTION.RESULT);

exports.updateStatus = controller(async ({ body: { statusId }, params }) => {
    const statusExist = await Status.exists({ _id: statusId });
    if (!statusExist) throw new ApiError("This status doesn't exist", 400);
    return Demands.updateOne({ _id: params.id }, { handler: { status: statusId } });
}, ACTION.INFORM);

exports.cleanDummy = controller(() => Demands.deleteMany({ 'user.email': 'edart@gmail.com'}), ACTION.INFORM);

exports.generateContact = controller(async ({ body: { comment }, params }) => {
    const demand = await Demands.findById(params._id);
    if (!demand) throw new ApiError("This demands doesn't exist");

    const user = new Contact({ ...demand.user, comment });
    const userError = user.validateSync();
    if (userError) throw new ApiError("The user in the contact demand seems to have some problems");

    await Promise.all([user.save(), Demands.updateOne({ _id: params.id }, { user })]);
    return user;
}, ACTION.RESULT);

const serializeFilterQuery = ({ search, status, origin, handler }) =>
    ({
        search: search || undefined,
        status,
        origin,
        // origin && { Model: Origin, filterValue: { origin: { url: origin, name: origin } }, field: 'origin' },
        handler
    });

const serializeSortQuery = ({ sortBy, sortDesc }) => ({ by: sortBy, direction: sortDesc && sortDesc == 'true' ? 'desc' : 'asc' })
const serializePaginatedQuery = (query) => ({ sort: serializeSortQuery(query), filter: serializeFilterQuery(query), pagination: { page: query.page, limit: query.perPage } })
exports.paginatedList = controller(({ query }) => {
    const { sort, filter, pagination } = serializePaginatedQuery(query);
    return paginatedController(Demands, filter, sort, pagination);
}, ACTION.RESULT);