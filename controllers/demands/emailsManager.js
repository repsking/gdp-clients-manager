const { getAction } = require('../../config/actions')
const email = require("../../emails/service");
const { ApiError } = require("../../Errors");
const User = require("../../models/user");


const mailTemplate = (action, type) => {
    if (!['Client', 'Team'].includes(type)) return;
    // Pour le moment on retourne une concaténation mais a terme les actions seront en dur
    return `${action}${type}`;
};
exports.sendResponseMail = async({ url, origin, action, message, user, programme, createdAt }) => {
    try {
        const originSerialized = { url: origin.url, name: origin.name }
        const actObj = getAction(action);
        if (!actObj) throw new ApiError(`action is undefined or doesn't exit`)

        const clientOptions = {
            message: {
                from: `"${origin.name}" <contact@${origin.url}>`,
                to: user.email, // list of receivers
            },
            template: mailTemplate(actObj.name, 'Client'),
            datas: {
                origin: originSerialized
            }
        };

        // list of receivers
        const teamEmails = await User.getTeamEmails();
        const teamOptions = {
            message: {
                from: `"${origin.name}" <contact@${origin.url}>`,
                to: teamEmails,
            },
            template: mailTemplate(actObj.name, 'Team'),
            datas: {
                origin: originSerialized,
                url,
                createdAt,
                message,
                user: {
                    phone: user.phone,
                    email: user.email,
                    name: user.name,
                    firstname: user.firstname
                }
            }
        };

        const [clientRes, teamRes] = await Promise.all([email(clientOptions), email(teamOptions)]);
        return { clientRes, teamRes };
    } catch (e) {
        // Save a log which says that the demands gone but not the email and do not block the process
        console.error("\x1b[36m", 'Error from Send Mail : ', e.message || e)
        return false;
    }
};