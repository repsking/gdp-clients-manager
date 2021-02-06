const Origin = require("../models/Origin");
const Demands = require("../models/demands");
const User = require("../models/user");
const Status = require("../models/status");
const ApiError = require("../errors/ApiError");
const controller = require("./utils/controller");
const email = require("../emails/mailService");
const paginatedController = require('./utils/paginatedController')


const serializeUser = ({ email, phone, name, firstname, zipcode }) => ({
    email,
    phone,
    firstname,
    zipcode,
    name,
});

const serializeDevice = ({ navigator, screen, lang }) => ({
    navigator,
    screen,
    lang,
});

const serializeProgramme = ({ programmeName, programmeId, programmeVille, programmeGestionnaire, thematique }) => ({
    name: programmeName,
    id: programmeId,
    ville: programmeVille,
    gestionnaire: programmeGestionnaire,
    thematique,
});

const serializeDemand = (body) => ({
    url: body.url || "origin missing",
    origin: "gdpcom",
    action: body.action || "no-action-given",
    message: body.message,
    user: serializeUser(body),
    device: serializeDevice(body),
});

const serializeProgrammeDemand = (body) => ({
    ...serializeDemand(body),
    message: body.message || "progamme_info",
    programme: serializeProgramme(body)
});

const sendResponseMail = async ({ url, origin, action, messge, user, programme, createdAt: demandDate }) => {
    const client = {
        from: `"${origin.name}" <foo@example.com>`, // sender address
        to: user.email, // list of receivers
        subject: "Demane bien prise en compte", // Subject line
        html: `<b>Bonjour M.</br>C'est fait !`, // html body
    };

    const team = {
        from: '"Le Guide du Patrimoine.com" <foo@example.com>', // sender address
        to: user.email, // list of receivers
        subject: "Une nouvelle demande vient d`être enregistré", // Subject line
        html: `<b>Bonjour M. Saliou</br>C'est fait !`, // html body
    };
    try {
        await Promise.all([email(client), email(team)]);
        return true;
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
    if (!statusId) throw ApiError("status_not_defined", 400);
    const doc = new Demands({ ...demand, origin: originId, handler: { status: statusId } });
    const res = await doc.save();
    sendResponseMail(res);
    return res;
};

exports.createCommonDemand = controller(async ({ body }, res) => {
    await createDemand(serializeDemand(body));
    res.status(201).end();
});

exports.createBeContactedDemand = controller(async ({ body }, res) => {
    await createDemand(serializeDemand({ ...body, message: "Want to be contacted" }));
    res.status(201).end();
});

exports.createProgramDemand = controller(async ({ body }, res) => {
    await createDemand(serializeProgrammeDemand({ ...body}));
    res.status(201).end();
});

exports.addComment = controller(async ({ currentUserId, params, body }, res) => {
    await Demands.updateOne({ _id: params.id }, { comment: { text: body.comment, owner: currentUserId } });
    res.status(200).end();
});

exports.removeComment = controller(async ({ params }, res) => {
    await Demands.updateOne({ _id: params.id }, { comment: null });
    res.status(200).end();
});

exports.assignToUser = controller(async ({ body: { userId }, params }, res) => {
    const userExist = await User.exists({ _id: userId });
    if (!userExist)
        throw new ApiEzoomrror("Selected user doesn't exist or it's not allowed to handle a contact demand", 400);
    const statusId = await Status.findIdByCode("handled");
    await Demands.updateOne({ _id: params.id }, { handler: { userId, status: statusId } });
    res.status(200).end();
});

exports.updateStatus = controller(async ({ body: { statusId }, params }, res) => {
    const statusExist = await Status.exists({ _id: statusId });
    if (!statusExist) throw new ApiError("This status doesn't exist", 400);
    await Demands.updateOne({ _id: params.id }, { handler: { status: statusId } });
    res.status(200).end();
});

exports.updateOrigin = controller(async (req, res) => {
    await Demands.updateMany({}, { origin: "6012657655cdfe39deceb96e" });
    res.status(200).end();
});

const serializeFilterQuery = ({search,status, origin, handler}) => ({search: search || undefined, status, origin, handler})
const serializeSortQuery = ({sortBy, sortDesc}) => ({by: sortBy, direction: sortDesc && sortDesc == 'true' ? 'desc' : 'asc'})
const serializePaginatedQuery = (query) => ({ sort: serializeSortQuery(query), filter: serializeFilterQuery(query), pagination: {page: query.page, limit: query.perPage}})

exports.paginatedList = controller(async ({query}, res) => {
    const {sort, filter, pagination} = serializePaginatedQuery(query);
    const result = await paginatedController(Demands, filter, sort, pagination);
    res.json(result);
});