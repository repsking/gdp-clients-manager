const {ROLES} = require('../config/roles')
const express = require('express');
const router = express.Router();
const { authUser, authRole } = require('../middlewares/auth')
const {controller, ACTION} = require('../controllers/utils/controller')

router.get('/',authUser, authRole(ROLES.reps), controller(() => ROLES, ACTION.RESULT))

module.exports = router;