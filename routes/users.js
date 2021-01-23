const {login, newUser, getUsers} = require('../controllers/user');
const express = require('express');
const router = express.Router();
router.post('/login', login);
router.post('/newuser', newUser);
router.get('/list', getUsers);

module.exports = router;