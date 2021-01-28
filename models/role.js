const {Schema, model} = require('mongoose');
const {requiredString} = require('./utils/customSchemaType')

const roleSchemas = Schema({
    label: requiredString,
    name: {...requiredString, unique: true},
    value: {
        type: Number,
        required: true
    },
})

roleSchemas.statics.findIdBylabel = async function(label) {
    const $regex = new RegExp(label, 'i');
    const res = await this.findOne({ $or: [{name: { $regex } }, {label: { $regex } }]},{_id: 1});
    return res._id;
  };
module.exports = model('Role', roleSchemas);