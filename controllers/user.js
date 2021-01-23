const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ApiError = require('../Errors/ApiError');
require('dotenv').config();

exports.login = async ({body: {username, password}}, res, next) => {
    const errorMessage = "Username or password incorrect"
    try {

        const user = await User.findOne({username});
        if(!user) throw new ApiError(errorMessage, 401);
        const result = await bcrypt.compare(password, user.password);
        if(!result) {
            throw new ApiError(errorMessage, 401);
        }
        res.json(
            {
                username: user.username,
                nom: user.nom,
                prenom: user.prenom,
                userId: user._id,
                token: jwt.sign({userId: user._id}, process.env.SECRET_AUTH_TOKEN, {expiresIn: "24h"})
            });
        
    } catch (error) {
        next(error);
    }

};

exports.newUser = async ({body}, res, next) => {

    try {
        const password = await bcrypt.hash(body.password, 10);
        const user = new User({...body, password});
        await user.save();
        res.status(201).json({user});
    } catch (error) {
        next(error)
    } 
};

exports.getUsers = async (req, res, next) => {

    try {
        const list = await User.find();
        res.json(list);
    } catch (error) {
        next(error);
    } 
};