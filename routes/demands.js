const Demands = require('../models/demands')
const generateCrud = require('./utils/generateCrud');
const auth = require('../middlewares/auth');
const {addComment, assignToUser, removeComment, createProgramDemand, createCommonDemand, createBeContactedDemand, paginatedList, importDemands} = require('../controllers/demands');
const router = generateCrud(Demands, {noCreate: true, noGet: true});
 
router.get('/paginated', auth, paginatedList)
router.post('/common', createCommonDemand)
router.post('/programme', createProgramDemand)
router.post('/beContacted', createBeContactedDemand)
router.post('/addComment/:id',auth, addComment)
router.post('/removeComment/:id',auth, removeComment)
router.post('/assignTo/:id', auth, assignToUser)
router.post('/import',importDemands)
module.exports = router;