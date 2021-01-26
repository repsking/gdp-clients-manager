const {Schema, model} = require('mongoose');
const {requiredString} = require('./utils/customSchemaType')

const userSchemas = Schema({

    nom: String,
    prenom: String,
    email: {...requiredString, unique: true},
    phone: {...requiredString, unique: true}
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
    handler: {
        userId: Schema.Types.ObjectId,
        status: {
            type: Schema.Types.ObjectId,
            ref: 'DemandStatus',
        },
    },
    comments: [{
        text: String,
        personnal: {
            type: Boolean,
            default: false,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'user'
        } 
    }]
}, { timestamps: true })

module.exports = model('Demand', demandSchemas);