const { Schema, model } = require("mongoose");
const { requiredString, nameType } = require("./utils/customSchemaType");
const { emailValidator } = require('./utils/validators');
console.log("HEy", nameType);
const schemas = Schema({
  username: { ...requiredString, unique: true },
  email: {
    ...requiredString,
    validate: emailValidator,
    },
  password: { ...requiredString, select: false },
  nom: {...requiredString, required: true},
  prenom: {...requiredString, required: true},
  role: {
    type: Schema.Types.ObjectId,
    required: true,
    autopopulate: true,
    ref: "Role",
  },
  createdBy: {
    required: true,
    type: Schema.Types.ObjectId,
    ref: "User",
  }
});
schemas.plugin(require("mongoose-autopopulate"));
module.exports = model("User", schemas);
