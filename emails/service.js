const nodemailer = require('nodemailer');
const Email = require('email-templates');
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const insecureHandlebars = allowInsecurePrototypeAccess(Handlebars)
const getTransporter = async () => {
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


module.exports = async function ({ message: {to, from}, template, datas = {} }) {

  const transport = await getTransporter();
  const email = new Email({ transport, views: {
    options: {
      extension: 'hbs'
    }
  } });
  try {
    const res = await email
    .send({
      template,
      message: { to, from },
      locals: datas
    });
    return res;
    
  } catch (error) {
    console.log({error})
  }
  





  return res;
}

