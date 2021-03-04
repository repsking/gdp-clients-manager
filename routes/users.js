const { login, newUser, changePassword, updateUserInfo, getContributors } = require('../controllers/user');
const User = require('../models/user')
const crud = require('./utils/crud');
const { authUser, authRole } = require('../middlewares/auth');
const { ROLES } = require('../config/roles')
const { Router } = require('express');
const router = Router();

router.post('/login', login);
router.get('/contributors', authUser, authRole(ROLES.contributor), getContributors);
router.post('/newuser', authUser, authRole(ROLES.admin), newUser);
router.put('/changePassword', authUser, changePassword);
router.put('/updateUser', authUser, updateUserInfo);

module.exports = crud(User, { router, needAuth: true, role: ROLES.admin });
