const {Schema, model} = require('mongoose');
const {requiredString} = require('./utils/customSchemaType')
const { emailValidator, phoneValidator } = require('./utils/validators');
const contactSchemas = Schema({

    name: String,
    firstname: String,
    email: {
        ...requiredString,
        validate: emailValidator,
        unique: true
    },
    phone: {
        type: String,
        unique: true
       //Put in comment cause we need to specify to not validate if value == null validate: phoneValidator
    },
    zipcode: String,
    comment: String,
    origin: {
        type: Schema.Types.ObjectId,
        ref: 'Origin',
        default: undefined
    }
})

module.exports = model('Contact', contactSchemas);