const Demands = require('../models/demands')
const {authUser, authRole} = require('../middlewares/auth');
const { ROLES } = require("../config/roles")
const {addComment, assignToUser, removeComment, createProgramDemand, createCommonDemand, createBeContactedDemand, paginatedList, importDemands} = require('../controllers/demands');
const router = require('./utils/crud')(Demands, {noCreate: true, noGet: true, needAuth: true, role: ROLES.contributor });
 
router.get('/paginated', authUser, paginatedList)
router.post('/common', createCommonDemand)
router.post('/programme', createProgramDemand)
router.post('/beContacted', createBeContactedDemand)
router.post('/addComment/:id',authUser, addComment)
router.post('/removeComment/:id',authUser, removeComment)
router.post('/assignTo/:id', authUser, authRole(ROLES.admin), assignToUser)
router.post('/import', authUser, authRole(ROLES.reps), importDemands)
module.exports = router;