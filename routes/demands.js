const Demands = require('../models/demands')
const crud = require('./utils/crud');
const {authUser} = require('../middlewares/auth');
const { ROLES } = require("../config/roles")
const {addComment, assignToUser, removeComment, createProgramDemand, createCommonDemand, createBeContactedDemand, paginatedList, importDemands} = require('../controllers/demands');
const router = crud(Demands, {noCreate: true, noGet: true, needAuth: true, role: ROLES.reader });
 
router.get('/paginated', authUser, paginatedList)
router.post('/common', createCommonDemand)
router.post('/programme', createProgramDemand)
router.post('/beContacted', createBeContactedDemand)
router.post('/addComment/:id',authUser, addComment)
router.post('/removeComment/:id',authUser, removeComment)
router.post('/assignTo/:id', authUser, assignToUser)
router.post('/import', authUser, importDemands)
module.exports = router;