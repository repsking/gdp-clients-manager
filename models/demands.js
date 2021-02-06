const {Schema, model} = require('mongoose');
const {requiredString} = require('./utils/customSchemaType')
const { emailValidator, phoneValidator } = require('./utils/validators');
const { searchFieldFilter } = require('./utils/utils')


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
        type: String,
       //Put in comment cause we need to specify to not validate if value == null validate: phoneValidator
    },
    zipcode: String
})

const demandSchemas = Schema({
    
    message: String,
    origin: {
        type: Schema.Types.ObjectId,
        ref: 'Origin',
        autopopulate: true,
    },
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
        }
    }
}, { timestamps: true })

const searchFields = ['message', 'user.name', 'user.firstname','user.email', 'user.phone'];

demandSchemas.statics.excludeProjection = () => ['comment.owner.password', 'comment.owner.role', 'comment.owner.email'];
demandSchemas.statics.fieldsSearchFilter = function(string) {
    return searchFieldFilter(searchFields, string)
  };
demandSchemas.plugin(require('mongoose-autopopulate'));
module.exports = model('Demand', demandSchemas);
