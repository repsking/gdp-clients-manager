const { Schema, model } = require("mongoose");
const { requiredString } = require("./utils/customSchemaType");
const { emailValidator } = require('./utils/validators');
const { ROLES } = require('../config/roles');

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

userSchemas.statics.getMailListUser = async function() {
  const res = await this.find({ $or: [  {inMailList: true}, {role: { $gte: ROLES.admin.value}}  ] }, {email: true, prenom: true, nom: true});
  return res;
};
userSchemas.plugin(require("mongoose-autopopulate"));
module.exports = model("User", userSchemas);
