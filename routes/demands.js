const Demands = require('../models/demands')
const generateCrud = require('./utils/generateCrud');
const {addComment} = require('../controllers/demands');
const router = generateCrud(Demands);

router.post('/addComment/:id', addComment)
module.exports = router;