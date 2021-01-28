const {Schema, model} = require('mongoose');
const {requiredString} = require('./utils/customSchemaType')

const schemas = Schema({
    username: {...requiredString, unique: true},
    email: requiredString,
    password: requiredString,
    nom: requiredString,
    prenom: requiredString,
    role: {
        type: Schema.Types.ObjectId,
        required: true
    }
})
//userSchemas.index({nom:1, prenom:1,email:1 }, { text: true });
module.exports = model('User', schemas);