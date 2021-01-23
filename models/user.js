const mongoose = require('mongoose');

const SR ={
    type: String,
    required: true
};

const schemas = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
    },
    password: SR,
    nom: {...SR},
    prenom: {...SR},
})
//userSchemas.index({nom:1, prenom:1,email:1 }, { text: true });


module.exports = mongoose.model('User', schemas);