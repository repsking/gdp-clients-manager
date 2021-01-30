const {Schema, model} = require('mongoose');
const {requiredString, nameType} = require('./utils/customSchemaType')
const { emailValidator, phoneValidator } = require('./utils/validators');


const programmeSchemas = Schema({
    name: String,
    id: requiredString,
    ville: String,
    gestionnaire: String,
    thematique: String 
})
const userSchemas = Schema({

    name: String,
    firstname: String,
    email: {
        ...requiredString,
        validate: emailValidator
    },
    phone: {
        ...requiredString,
        validate: phoneValidator
    },
    zipcode: String
})

const demandSchemas = Schema({
    
    message: String,
    origin: requiredString,
    action: requiredString,
    datas: {
        type: Schema.Types.Mixed,
        required: false
    },
    user: {
        type: userSchemas,
        required: true
    },
    device: {
        navigator: {
            type: Schema.Types.Mixed
        },
        screen: {
            type: Schema.Types.Mixed
        }
    },
    url: requiredString,
    handler: {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            autopopulate: true,
        },
        status: {
            type: Schema.Types.ObjectId,
            ref: 'Status',
            autopopulate: true,
        },
    },
    programme: {
        type: programmeSchemas,
        required: false,
        default: undefined
    },
    comment: {
        text: String,
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            autopopulate: true,
        }
    }
}, { timestamps: true })


demandSchemas.index({
    message: 'text',
    'user.name': 'text',
    'user.firstname': 'text',
    'user.email': 'text',
    'profile.something': 'text'
});

demandSchemas.plugin(require('mongoose-autopopulate'));
module.exports = model('Demand', demandSchemas);