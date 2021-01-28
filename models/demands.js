const {Schema, model} = require('mongoose');
const {requiredString} = require('./utils/customSchemaType')

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
    email: requiredString,
    phone: requiredString,
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
        userId: Schema.Types.ObjectId,
        status: {
            type: Schema.Types.ObjectId,
            ref: 'DemandStatus',
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
            ref: 'user'
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
module.exports = model('Demand', demandSchemas);