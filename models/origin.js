const {Schema, model} = require('mongoose');
const {requiredString} = require('./utils/customSchemaType')

const originSchemas = Schema({
    name: requiredString,
    url: requiredString,
    keywords: [String]
})

originSchemas.statics.findIdByName = async function(name) {
    const $regex = new RegExp(name, 'i');
    const res = await this.findOne({ name: { $regex } },{_id: 1});
    return res._id;
  };
module.exports = model('Origin', originSchemas);
