const { Schema, model } = require('mongoose');
const { requiredString } = require('./utils/customSchemaType')

const originSchemas = Schema({
    name: {...requiredString, unique: true },
    url: {
        ...requiredString,
        unique: true
    },
    color: {
        type: String,
        default: "#bbb"
    },
    keywords: [String]
})

originSchemas.statics.findIdByKeyword = async function(word) {
    const $regex = new RegExp(word, 'i');
    const res = await this.findOne({ keywords: { $regex } });
    return res && res._id;
};

originSchemas.statics.findByKeyword = async function(word) {
    const $regex = new RegExp(word, 'i');
    const res = await this.findOne({ keywords: { $regex } });
    return res
};
module.exports = model('Origin', originSchemas);