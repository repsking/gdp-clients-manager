const nodemailer = require('nodemailer');
const Email = require('email-templates');
const Handlebars = require('handlebars')
    //FIXME: Remove it from package.json with an uninstall then remove this line
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')

const internalIp = require('internal-ip');

const getTransporter = async() => {
    const testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    return nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
        },
    });
}

module.exports = async function({ message: { to, from }, template, datas = {} }) {

    const transport = await getTransporter();
    const clientIp = await internalIp.v4();

    const email = new Email({
        transport,
        views: {
            options: {
                extension: 'hbs'
            }
        }
    });
    try {
        const res = await email
            .send({
                template,
                message: { to, from },
                locals: {
                    ...datas,
                    clientIp
                },
            });
        return res;

    } catch (error) {
        console.log({ error });
    }






    return res;
}