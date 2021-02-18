const { Schema, model } = require("mongoose");
const { requiredString } = require("./utils/customSchemaType");
const { emailValidator } = require('./utils/validators');
const { ROLES } = require('../config/roles');
const { isNotEmpty } = require('../utils/array')

const userSchemas = Schema({
  username: { ...requiredString, unique: true },
  email: {
    ...requiredString,
    validate: emailValidator,
    },
  password: { ...requiredString, select: false },
  nom: {...requiredString, required: true},
  prenom: {...requiredString, required: true},
  role: {
    type: Number,
    required: true,
    enum: Object.values(ROLES).map(({value}) => value)
  },
  inMailList: {
    type: Boolean,
    default: false
  },
  createdBy: {
    required: true,
    type: Schema.Types.ObjectId,
    ref: "User",
  }
});
    
userSchemas.statics.getTeamEmails = async function() {
  const DEFAULT_USER = {name: 'Default user', address:'saliou71@gmail.com'};
  const res = await this.find({ $or: [  {inMailList: true}, {role: { $gte: ROLES.admin.value}}  ] }, {email: true, prenom: true, nom: true});
  return isNotEmpty(res) && res.map(user => ({name: `${user.prenom} ${user.nom}`, address: `${user.email}`})) || [DEFAULT_USER];
};
userSchemas.plugin(require("mongoose-autopopulate"));
module.exports = model("User", userSchemas);
