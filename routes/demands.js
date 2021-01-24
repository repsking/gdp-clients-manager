const Demands = require('../models/demands')
const generateCrud = require('./utils/generateCrud');
const {addComment, assignToUser} = require('../controllers/demands');
const router = generateCrud(Demands);

router.post('/addComment/:id', addComment)
router.post('/assignTo/:id', assignToUser)
module.exports = router;