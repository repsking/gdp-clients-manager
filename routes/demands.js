const Demands = require('../models/demands')
const generateCrud = require('./utils/generateCrud');
const {addComment, assignToUser, removeComment} = require('../controllers/demands');
const router = generateCrud(Demands);

router.post('/addComment/:id', addComment)
router.post('/removeComment/:id', removeComment)
router.post('/assignTo/:id', assignToUser)
module.exports = router;