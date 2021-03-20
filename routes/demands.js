const Demands = require('../models/demands')
const { authUser, authRole } = require('../middlewares/auth');
const { ROLES } = require("../config/roles")
const { addComment, assignToUser, removeComment, createProgramDemand, createCommonDemand, createBeContactedDemand, paginatedList, importDemands, generateContact, cleanDummy } = require('../controllers/demands');
const ehpad = require('../controllers/ehpad');
const { Router } = require('express');
const router = Router();

router.get('/paginated', authUser, paginatedList)
router.post('/common', createCommonDemand)
router.post('/programme', createProgramDemand)
router.post('/beContacted', createBeContactedDemand)
router.post('/addComment/:id', authUser, addComment)
router.post('/removeComment/:id', authUser, removeComment)
router.post('/cleanDummy', authUser, authRole(ROLES.reps), cleanDummy)
router.post('/assignTo/:id', authUser, authRole(ROLES.admin), assignToUser)
router.post('/import', authUser, authRole(ROLES.reps), importDemands)
router.post('/generateContact/:id', authUser, generateContact)
router.post('/ehpad', ehpad)

module.exports = require('./utils/crud')(Demands, { router, noCreate: true, needAuth: true, role: ROLES.contributor });