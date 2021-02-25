const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { NotAuthorizedError, PasswordsDontMatch, WeakStrengthPassword, ApiError, ServerError } = require("../Errors");
const {controller, ACTION} = require('./utils/controller')
const { serializeRole, deserializeRole } = require('../config/roles');

require('dotenv').config();

const checkPwdStrength = pwd => true;

exports.login = controller(async ({body: {username, password}}) => {
    const errorMsg = "Creditentials Incorrect";
    
    const user = await User.findOne({username}, {password: true, username: true, email: true, nom: true, prenom: true, role: true, tmpPass: true});
    if(!user) throw new NotAuthorizedError(errorMsg);
    
    const result = await bcrypt.compare(password, user.password);
    if(!result) throw new NotAuthorizedError(errorMsg);
    return {
            username: user.username,
            nom: user.nom,
            prenom: user.prenom,
            userId: user._id,
            email: user.email,
            tmpPass: user.tmpPass === true || undefined,
            role: serializeRole(user.role),
            token: jwt.sign({userId: user._id}, process.env.SECRET_AUTH_TOKEN, {expiresIn: "24h"})
        };
}, ACTION.RESULT);

exports.newUser = controller(async ({user, body}) => {
    let {email, prenom, nom, username, role, inMailList = false} = body;

    role = deserializeRole(role);
    //TODO: Change this tmp password by a function that will generate a random string 
    const tmpPass = '1234test';
    const newUser = new User({email, prenom, nom, username, role, inMailList, password: tmpPass, tmpPass: true, createdBy: user._id})
    newUser.password = await bcrypt.hash(tmpPass, 10);
    await newUser.save();
    return {email,prenom, nom, username, role, tmpPwd: tmpPass};
}, ACTION.CREATE);

exports.changePassword = controller(async ({user = {}, body}) => {

    const { newPassword, oldPassword } = body;
    if(!newPassword || !oldPassword ) throw new ApiError("Some informations are missing")

    const userPwd = await User.findById(user._id, {password: 1});
    if(!userPwd || !userPwd.password) throw new ServerError("Connected user informations are not findable");
    const checkPwd = await bcrypt.compare(oldPassword, userPwd.password);
    if(!checkPwd) throw new ApiError("The current password is not correct.")
    if(!checkPwdStrength(newPassword)) throw new WeakStrengthPassword();
    
    const hashPwd = await bcrypt.hash(newPassword, 10);
    await User.updateOne({_id: user._id, $set: { password: hashPwd, tmpPass: false }});
    return { tmpPass: false};
}, ACTION.RESULT);


const fieldIsValid = async (field, value, Model) => {
    if(!field || !Model || !value) return false
    const res = await Model.exists({[field]: value});
    if(res) throw new ApiError(`Validation Error: ${field} with ${value} value already exist`);
}
exports.updateUserInfo = controller(async({user = {}, body}) => {
    let { username, nom, prenom, email } = body;
    console.log({user})
    if(username == user.username) username = undefined;
    if(email == user.email) email = undefined;

    if(!user || !user._id) throw new ServerError("Connected user informations are not findable");
    await Promise.all([fieldIsValid('email', email, User), fieldIsValid('username',username, User) ]);
    return User.findByIdAndUpdate(user._id, { username, nom, prenom, email }, {new: true, omitUndefined: true, select:{ username: true, nom: true, prenom: true, email: true } });
}, ACTION.RESULT);