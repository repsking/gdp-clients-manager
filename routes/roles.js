const {ROLES} = require('../config/roles')
const express = require('express');
const router = express.Router();
const { authUser, authRole } = require('../middlewares/auth')
const controller = require('../controllers/utils/controller')

const getRoles = controller((req, res) => res.json(ROLES))
router.get('/',authUser, authRole(ROLES.reps), getRoles)

module.exports = router;