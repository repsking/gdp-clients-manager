const Origin = require("../../models/Origin");
const Demand = require('../../models/demands')
const Status = require('../../models/status')
const { ApiError } = require("../../Errors");
const {controller} = require("../utils/controller");
const mysql = require('mysql');
const { serializeProgramme, serializeDevice } = require("./utils");

const removePrefix = str => str.replace(/^\w{3,4}_/, '')
const objectEmpty = obj => !obj || Object.entries(obj).length <= 0 || Object.values(obj).every(v => !v);

const serializeJson = jsonStr => {
    if(!jsonStr) return;
    const isProgramKey = key => /(^programme)|(product$)/i.test(key);
    try {
        const jsonParsed = jsonStr && JSON.parse(jsonStr)
        const programme = Object.keys(jsonParsed).reduce((program, field) => {
            return isProgramKey(field) && { ...program, [field]: jsonParsed[field] } || program
        }, {});

        const device = serializeDevice(jsonParsed);
        return {
            programme: objectEmpty(programme) ? undefined : serializeProgramme(programme),
            device: objectEmpty(device) ? undefined : device,
            url: jsonParsed.url,
            zipcode: jsonParsed.zipcode,
            message: jsonParsed.message
        };
    } catch (error) {
        console.warn('A json returned undefined', error);
        return;
    }
}

const serializeUser = demand => {
    const isUserKey = key => /^Use_/i.test(key);
    try {
        return Object.keys(demand).reduce((user, field) => {
            return isUserKey(field) && { ...user, [removePrefix(field)]: demand[field] } || user
        }, {});
    } catch (error) {
        console.warn('A serialze user returned undefined', error);
        return;
    }
}

const getOrigin = (demand) => {
    const origin = demand && demand.origin && demand.origin.replace(/\s/gi, '')
    return origin && Origin.findIdByKeyword(origin)
}
const serializeFinal =
 ({origin, action, message, zipcode,Con_id,Con_datas, user, created, programme, device, url, Con_created}) => 
 ({origin, remoteId: `${Con_id}`,datas: Con_datas, zipcode, action: action && action.replace(/\s/ig,'').toLocaleLowerCase() , message, user, created, programme, device, url, createdAt: new Date(Con_created)})

const serializeContact = async (contact) => {
    const json = serializeJson(contact.Con_datas);
    const user = serializeUser(contact);
    const origin = await getOrigin(contact);
    return serializeFinal({ ...contact, origin, user, ...json });
};
const saveDemand = async(demand, status) => {
    const doc = new Demand({ ...demand, handler: { status } });
    const err = doc.validateSync();
    if(err) throw Error(`The demand #${demand.remoteId} has an invalid document`, err);
    const alreadyImported = await Demand.exists({remoteId: demand.remoteId});
    if(alreadyImported) throw Error(`The demand #${demand.remoteId} is already imported`);
    return doc.save();
};
module.exports = controller(async ({ query }, res) => {
    const { limit = 10, offset = 200 } = query
    const db = mysql.createConnection({
        host: process.env.DB_MYSQL_HOST,
        user: process.env.DB_MYSQL_USER,
        password: process.env.DB_MYSQL_PWD,
        database: process.env.DB_MYSQL_NAME
    });
    db.connect(function (err) {
        if (err) throw new ApiError('Sql Database unreacheble', 500);
        db.query(`SELECT Con_id, Con_message, Con_datas, Use_name, Use_firstname, Use_email,Use_phone, Con_url,Con_created, Ori_nom as origin, Act_nom as action FROM contact INNER JOIN origin ON Ori_id = Con_originId INNER JOIN action ON Act_id = Con_actionId INNER JOIN user ON Use_id = Con_userId WHERE Con_deleted = 0 LIMIT ${limit} OFFSET ${offset}`, async function (err, result) {

            if (err) throw err;
            const demands = await Promise.all(result.map(serializeContact))
            const status = await Status.findIdByCode("import");
            const errors = []

            for(const demand of demands) {
                try {
                    await saveDemand(demand, status);
                } catch (error) {
                    errors.push(error)
                }
            }
            if(errors.length > 0) return res.status(400).json({message:"Some imports didn't saved correctly", errors: errors.map(err => err.message)})
            res.status(201).send(demands.length + " contacts demand imported");
        });
    })
})