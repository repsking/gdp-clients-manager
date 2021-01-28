const {Schema, model} = require('mongoose');
const {requiredString} = require('./utils/customSchemaType')

const statusSchemas = Schema({
    label: requiredString,
    code: requiredString,
    color: requiredString,
    stepIndex: {
        type: Number,
        required: true,
    }
})

statusSchemas.statics.findIdByCode = async function(code) {
    const $regex = new RegExp(code, 'i');
    const res = await this.findOne({ code: { $regex } },{_id: 1});
    return res._id;
  };
module.exports = model('Status', statusSchemas);