const Demands = require('../models/demands')
const generateCrud = require('./utils/generateCrud');
const auth = require('../middlewares/auth');
const {addComment, assignToUser, removeComment, createProgramDemand, createCommonDemand, } = require('../controllers/demands');
const router = generateCrud(Demands, {noCreate: true});

router.post('/', createCommonDemand)
router.post('/programme', createCommonDemand)

router.post('/addComment/:id',auth, addComment)
router.post('/removeComment/:id',auth, removeComment)
router.post('/assignTo/:id', auth, assignToUser)
module.exports = router;