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
    }
}, { timestamps: true })

module.exports = model('Demand', demandSchemas);